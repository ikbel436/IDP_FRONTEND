// create-deployment.component.ts
import { Component, Inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { DeploymentService } from './deployment.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule, MatStepper } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { HttpClientModule } from '@angular/common/http';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ProjectService } from 'app/mock-api/apps/project/project.service';
import { BehaviorSubject, Observable, forkJoin } from 'rxjs';
import { FuseLoadingBarComponent } from '@fuse/components/loading-bar';
import { HostsModalComponent } from './hosts-modal/hosts-modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-create-deployment',
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatDividerModule,
        MatTableModule,
        MatSortModule,
        MatDialogModule,
        MatStepperModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        ReactiveFormsModule,
        HttpClientModule,
        MatCheckboxModule,
        FuseLoadingBarComponent,
    ],
    templateUrl: './create-deployment.component.html',
    styleUrls: ['./create-deployment.component.scss'],
})
export class CreateDeploymentComponent {
    stepperForm: FormGroup;
    projects: string[] = [];
    docker: string[] = [];
    generatedFiles: string[] = [];
    token = 'YOUR_JWT_TOKEN';
    hosts: string[] = [];
    showSnackbar$ = new BehaviorSubject<boolean>(false);

    @ViewChild('verticalStepper') private verticalStepper: MatStepper;  // Inject the MatStepper

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<CreateDeploymentComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private apiService: DeploymentService,
        private projectService: ProjectService,
        private dialog: MatDialog,
        private _snackBar: MatSnackBar

    ) {
        this.stepperForm = this.fb.group({
            step1: this.fb.group({
                dbType: ['', [Validators.required]],
                port: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
                serviceName: ['', [Validators.required, this.lowercaseValidator]],
                envVars: this.fb.array([this.createEnvVariable()]),

            }),
            projects: this.fb.array([]),
            namespace: [this.data.bundle.name, Validators.required],
        });
    }

    ngOnInit(): void {
        this.fetchProjects();
    }

    get step1(): FormGroup {
        return this.stepperForm.get('step1') as FormGroup;
    }

    get envVars(): FormArray {
        return this.step1.get('envVars') as FormArray;
    }

    get projectsArray(): FormArray {
        return this.stepperForm.get('projects') as FormArray;
    }

    createEnvVariable(): FormGroup {
        return this.fb.group({
            name: ['', [Validators.required, this.lowercaseValidator]],
            value: ['', [Validators.required, this.lowercaseValidator]],
        });
    }

    addEnvVar(): void {
        this.envVars.push(this.createEnvVariable());
    }

    removeEnvVar(index: number): void {
        this.envVars.removeAt(index);
    }

    createProjectGroup(projectName: string, dockerImage: string): FormGroup {
        return this.fb.group({
            projectName: [projectName, Validators.required],
            dockerImage: [dockerImage, Validators.required],
            serviceName: ['', [Validators.required, this.lowercaseValidator]],
            port: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
            expose: [false],
            host: ['', [this.lowercaseValidator, this.hostValidator]],
            projectEnvVars: this.fb.array([this.createEnvVariable()]),
            registryType: ['', Validators.required],  
            generated: [false],  
            privacy: ['', Validators.required],  
            imagePullSecretName: [''],
            dockerUsername: [''],
            dockerPassword: [''],
            dockerEmail: [''],
        });
    }
    

    addProjectEnvVar(index: number): void {
        const projectGroup = this.projectsArray.at(index) as FormGroup;
        const projectEnvVars = projectGroup.get('projectEnvVars') as FormArray;
        projectEnvVars.push(this.createEnvVariable());
    }

    removeProjectEnvVar(projectIndex: number, envVarIndex: number): void {
        const projectGroup = this.projectsArray.at(projectIndex) as FormGroup;
        const projectEnvVars = projectGroup.get('projectEnvVars') as FormArray;
        projectEnvVars.removeAt(envVarIndex);
    }

    fetchProjects(): void {
        const projectIds = this.data.bundle.Projects;
        const projectRequests = projectIds.map((id) =>
            this.projectService.getProjectsByIds(id)
        );

        forkJoin(projectRequests).subscribe(
            (projects: any[]) => {
                projects.forEach((project) => {
                    const projectGroup = this.createProjectGroup(project.name, project.DockerImage[0]);
                    this.projectsArray.push(projectGroup);
                });
            },
            (error) => {
                console.error('Error fetching projects:', error);
            }
        );
    }

    generateDatabaseDeployment(): void {
        const deploymentData = {
            dbType: this.step1.value.dbType,
            serviceName: this.step1.value.serviceName,
            dbName: 'mydatabase',
            port: this.step1.value.port,
            envVariables: this.envVars.value,
            namespace: this.stepperForm.value.namespace,
        };
    
        this.apiService.generateDatabaseDeployment(deploymentData).subscribe(
            (response) => {
                this.generatedFiles.push(response.deploymentFilePath);
                this._snackBar.open('Database deployed', 'OK', {
                    duration: 3000,
                });
            },
            (error) => {
                console.error('Error generating database deployment:', error);
            }
        );
    }

    generateProjectDeployment(index: number): void {
        const projectGroup = this.projectsArray.at(index) as FormGroup;
        if (projectGroup.value.generated) {
            return;
        }

        const deploymentData = {
            serviceName: projectGroup.value.serviceName,
            port: projectGroup.value.port,
            image: projectGroup.value.dockerImage,
            envVariables: projectGroup.value.projectEnvVars,
            namespace: this.stepperForm.value.namespace,
            imagePullSecretName: projectGroup.value.imagePullSecretName,
            dockerUsername: projectGroup.value.dockerUsername,
            dockerPassword: projectGroup.value.dockerPassword,
            dockerEmail: projectGroup.value.dockerEmail,

        };
    
        const expose = projectGroup.value.expose;
        const host = projectGroup.value.host;
    
        // Store the host if the project is exposed
        if (expose) {
            this.hosts.push(host);
        }
    
        this.apiService
           .generateDeployment({...deploymentData, expose, host })
           .subscribe(
                (response) => {
                    this.generatedFiles.push(response.deploymentFilePath);
                    if (response.ingressFilePath) {
                        this.generatedFiles.push(response.ingressFilePath);
                    }

                    projectGroup.patchValue({ generated: true });

                    // Move to the next project form
                    const nextIndex = index + 1;
                    if (nextIndex < this.projectsArray.length) {
                        this.projectsArray.at(nextIndex).get('serviceName').markAsTouched();
                    } else {
                        // Move to the next step in the stepper if all projects are deployed
                        this.verticalStepper.next();
                        this._snackBar.open('Project Deployed', 'OK', {
                            duration: 3000,
                        });
                    }
                },
                (error) => {
                    console.error(
                        'Error generating project deployment:',
                        error
                    );
                }
            );
    }

    onSubmit(): void {
        const deploymentData = {
            files: this.generatedFiles,
            name: this.stepperForm.value.namespace,
            description: this.data.bundle.description,
            bundles: this.data.bundle,
            namespace: this.stepperForm.value.namespace,
        };
    
        this.apiService.applyK8sFiles(deploymentData).subscribe(
            (response) => {
    
                // Prepare the data to be passed to the modal
                const hostsData = {
                    hosts: this.hosts,
                };
    
                this._snackBar.open('Great you are almost done', 'OK', {
                    duration: 3000,
                });
                // Open the modal and pass the hosts data
                this.openHostsModal(hostsData);
            },
            (error) => {
                console.error('Error applying deployment:', error);
            }
        );
    }
    
    openHostsModal(data: { hosts: string[] }): void {
        const dialogRef = this.dialog.open(HostsModalComponent, {
          data: data,
        });
      
        dialogRef.afterClosed().subscribe(result => {
        });
    }
    
    onCancel(): void {
        this.dialogRef.close();
        this.saveAsDraft();

    }

    // Custom validators
    lowercaseValidator(control: AbstractControl): { [key: string]: any } | null {
        const isLowercase = /^[a-z]+$/.test(control.value);
        return isLowercase ? null : { lowercase: { value: control.value } };
    }

    hostValidator(control: AbstractControl): { [key: string]: any } | null {
        const isValidHost = /^[a-z]+(\.[a-z]+)*$/.test(control.value);
        return isValidHost ? null : { host: { value: control.value } };
    }

    saveAsDraft(): void {}

}
