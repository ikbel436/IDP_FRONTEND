import { Component, Inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogModule,
    MatDialogRef,
} from '@angular/material/dialog';
import {
    FormBuilder,
    FormGroup,
    FormArray,
    Validators,
    ReactiveFormsModule,
    AbstractControl,
} from '@angular/forms';
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
    bundleData: any;


    // @ViewChild('verticalStepper') private verticalStepper: MatStepper; // Inject the MatStepper
    @ViewChild('verticalStepper', { static: false }) verticalStepper: MatStepper;

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
                port: [
                    '',
                    [Validators.required, Validators.pattern('^[0-9]+$')],
                ],
                serviceName: [
                    '',
                    [Validators.required, this.lowercaseValidator],
                ],
                envVars: this.fb.array([]),
            }),
            projects: this.fb.array([]),
            namespace: [this.data.bundle.name, Validators.required],
        });
    }

    ngOnInit(): void {
        this.fetchProjects();
        this.fetchBundleData();
    }

    fetchBundleData(): void {
        const bundleId = this.data.bundle._id;
        this.apiService.getBundleById(bundleId).subscribe(
            (bundle) => {
                this.bundleData = bundle;
                console.log('Bundle data:', this.bundleData);
    
                // Populate the envVars FormArray with the environment variables from the database                
                if(this.bundleData.myDBconfig.envVariables.length === 0) {                    
                    this.envVars.push(this.createEnvVariable());
                }
                else{
                    this.bundleData.myDBconfig.envVariables.forEach(envVar => {
                        this.envVars.push(this.createEnvVariable());
                        const index = this.envVars.length - 1;
                        this.envVars.at(index).patchValue({
                            name: envVar.key,
                            value: envVar.value
                        });
                    });
                }
    
                // Update other form fields
                this.step1.patchValue({
                    dbType: this.bundleData.myDBconfig.dbType || '',
                    serviceName: this.bundleData.myDBconfig.serviceName || '',
                    port: this.bundleData.myDBconfig.port || ''
                });
            },
            (error) => {
                console.error('Error fetching bundle data:', error);
            }
        );
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
            name: [''],
            value: [''],
        });
    }

    addEnvVar(): void {
        this.envVars.push(this.createEnvVariable());
    }
    
    removeEnvVar(index: number): void {
        this.envVars.removeAt(index);
    }
    createProjectGroup(projectName: string, dockerImage: string, projectId: string, p0: boolean): FormGroup {
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
            projectId: [projectId, Validators.required] 
        });
    }
    

    onRegistryTypeChange(projectIndex: number): void {
        const projectGroup = this.projectsArray.at(projectIndex) as FormGroup;
        this.clearValidators(projectGroup);
    }

    onPrivacyChange(projectIndex: number, privacy: string): void {
        const projectGroup = this.projectsArray.at(projectIndex) as FormGroup;
        this.clearValidators(projectGroup);

        if (privacy === 'private') {
            projectGroup
                .get('imagePullSecretName')
                .setValidators(Validators.required);
            projectGroup
                .get('dockerUsername')
                .setValidators(Validators.required);
            projectGroup
                .get('dockerPassword')
                .setValidators(Validators.required);
            projectGroup
                .get('dockerEmail')
                .setValidators([Validators.required, Validators.email]);
        } else if (privacy === 'public') {
            projectGroup.get('dockerImage').setValidators(Validators.required);
        }

        projectGroup.get('privacy').setValue(privacy); // Set the privacy value for the specific project
        projectGroup.updateValueAndValidity();
    }

    clearValidators(group: FormGroup): void {
        group.get('imagePullSecretName').clearValidators();
        group.get('dockerUsername').clearValidators();
        group.get('dockerPassword').clearValidators();
        group.get('dockerEmail').clearValidators();
        group.get('dockerImage').clearValidators();
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
                    console.log('Project:', project);
                    const projectDeploymentConfig = project.myprojectDepl || [];
                    console.log('Project Deployment Config:', projectDeploymentConfig);
    
                    const projectGroup = this.createProjectGroup(
                        project.name,
                        project.DockerImage[0],
                        project._id,
                        projectDeploymentConfig.length > 0
                    );
    
                    if (projectDeploymentConfig.length > 0) {
                        const deploymentConfig = projectDeploymentConfig[0] || {};
                        console.log('Deployment Config:', deploymentConfig);
    
                        const envVariables = Array.isArray(deploymentConfig.envVariables)
                            ? deploymentConfig.envVariables.map(envVar => this.fb.group({
                                name: [envVar.key || envVar.name, Validators.required],
                                value: [envVar.value, Validators.required]
                            }))
                            : [];
    
                        projectGroup.patchValue({
                            serviceName: deploymentConfig.serviceName || '',
                            port: deploymentConfig.port || '',
                            imagePullSecretName: deploymentConfig.imagePullSecretName || '',
                            dockerUsername: deploymentConfig.dockerUsername || '',
                            dockerPassword: deploymentConfig.dockerPassword || '',
                            dockerEmail: deploymentConfig.dockerEmail || '',
                            expose: deploymentConfig.expose || false,
                            host: deploymentConfig.host || '',
                            generated: true
                        });
    
                        // Update the project environment variables
                        const projectEnvVarsArray = projectGroup.get('projectEnvVars') as FormArray;
                        projectEnvVarsArray.clear();
                        envVariables.forEach(envVarGroup => projectEnvVarsArray.push(envVarGroup));
                    }
    
                    this.projectsArray.push(projectGroup);
                });
            },
            (error) => {
                this._snackBar.open('Error fetching projects', 'OK', {
                    duration: 3000,
                    panelClass: ['mat-snack-bar-error'],
                });
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
            bundleId: this.data.bundle._id, 
        };
    
        this.apiService.generateDatabaseDeployment(deploymentData).subscribe(
            (response) => {
                this.generatedFiles.push(response.deploymentFilePath);
                this._snackBar.open('Database deployed', 'OK', {
                    duration: 3000,
                });
            },
            (error) => {
                this._snackBar.open(
                    'Error generating database deployment',
                    'OK',
                    {
                        duration: 3000,
                        panelClass: ['mat-snack-bar-error'],
                    }
                );
                console.error('Error generating database deployment:', error);
            }
        );
    }
    // generateProjectDeployment(index: number): void {
    //     const projectGroup = this.projectsArray.at(index) as FormGroup;
        
    //     const deploymentData = {
    //         serviceName: projectGroup.value.serviceName,
    //         port: projectGroup.value.port,
    //         image: projectGroup.value.dockerImage,
    //         envVariables: projectGroup.value.projectEnvVars,
    //         namespace: this.stepperForm.value.namespace,
    //         imagePullSecretName: projectGroup.value.imagePullSecretName,
    //         dockerUsername: projectGroup.value.dockerUsername,
    //         dockerPassword: projectGroup.value.dockerPassword,
    //         dockerEmail: projectGroup.value.dockerEmail,
    //         expose: projectGroup.value.expose,
    //         host: projectGroup.value.host,
    //         bundleId: this.data.bundle._id,
    //         projectId: projectGroup.value.projectId
    //     };
    
    //     console.log('Sending deployment data:', deploymentData); // Log the data being sent
    
    //     this.apiService.generateDeployment(deploymentData).subscribe(
    //         (response) => {
    //             console.log('Response from backend:', response); // Log the response
    
    //             this.generatedFiles.push(response.deploymentFilePath);
    //             if (response.ingressFilePath) {
    //                 this.generatedFiles.push(response.ingressFilePath);
    //             }
    
    //             projectGroup.patchValue({ generated: true });
    
    //             const nextIndex = index + 1;
    //             if (nextIndex < this.projectsArray.length) {
    //                 this.projectsArray.at(nextIndex).get('serviceName').markAsTouched();
    //             } else {
    //                 if (this.verticalStepper) {
    //                     this.verticalStepper.next();
    //                 } else {
    //                     console.warn('verticalStepper is undefined');
    //                 }
    
    //                 if (this._snackBar) {
    //                     this._snackBar.open('Project Deployed', 'OK', { duration: 3000 });
    //                 } else {
    //                     console.warn('snackBar is undefined');
    //                 }
    //             }
    //         },
    //         (error) => {
    //             this._snackBar.open('Error generating project deployment', 'OK', {
    //                 duration: 3000,
    //                 panelClass: ['mat-snack-bar-error'],
    //             });
    //             console.error('Error generating project deployment:', error);
    //         }
    //     );
    // }
    
    generateProjectDeployment(index: number): void {
        const projectGroup = this.projectsArray.at(index) as FormGroup;
    
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
            expose: projectGroup.value.expose,
            host: projectGroup.value.host,
            bundleId: this.data.bundle._id,
            projectId: projectGroup.value.projectId,
            id: projectGroup.value.deploymentId || undefined // Ensure to include the deployment ID
        };
    
        console.log('Sending deployment data:', deploymentData);
    
        this.apiService.generateDeployment(deploymentData).subscribe(
            (response) => {
                console.log('Response from backend:', response);
                this.generatedFiles.push(response.deploymentFilePath);
                if (response.ingressFilePath) {
                    this.generatedFiles.push(response.ingressFilePath);
                }
    
                projectGroup.patchValue({ generated: true });
    
                this._snackBar.open(response.msg, 'OK', { duration: 3000 });
            },
            (error) => {
                this._snackBar.open('Error generating project deployment', 'OK', {
                    duration: 3000,
                    panelClass: ['mat-snack-bar-error'],
                });
                console.error('Error generating project deployment:', error);
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
                const hostsData = { hosts: this.hosts };
                this._snackBar.open('Great you are almost done', 'OK', {
                    duration: 3000,
                });
                this.openHostsModal(hostsData);
            },
            (error) => {
                this._snackBar.open('Error applying deployment', 'OK', {
                    duration: 3000,
                    panelClass: ['mat-snack-bar-error'],
                });
                console.error('Error applying deployment:', error);
            }
        );
    }

    openHostsModal(data: { hosts: string[] }): void {
        const dialogRef = this.dialog.open(HostsModalComponent, {
            data: data,
        });

        dialogRef.afterClosed().subscribe((result) => {});
    }

    onCancel(): void {
        this.dialogRef.close();
        this.saveAsDraft();
    }

    lowercaseValidator(
        control: AbstractControl
    ): { [key: string]: any } | null {
        const isLowercase = /^[a-z]+$/.test(control.value);
        return isLowercase ? null : { lowercase: { value: control.value } };
    }

    hostValidator(control: AbstractControl): { [key: string]: any } | null {
        const isValidHost = /^[a-z]+(\.[a-z]+)*$/.test(control.value);
        return isValidHost ? null : { host: { value: control.value } };
    }

    saveAsDraft(): void {}
}
