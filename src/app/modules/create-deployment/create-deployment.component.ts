import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    FormArray,
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import {
    MAT_DIALOG_DATA,
    MatDialogModule,
    MatDialogRef,
} from '@angular/material/dialog';
import { DeploymentService } from './deployment.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { HttpClientModule } from '@angular/common/http';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ProjectService } from 'app/mock-api/apps/project/project.service';
import { Observable, forkJoin } from 'rxjs';
import { FuseLoadingBarComponent } from '@fuse/components/loading-bar';

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
    

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<CreateDeploymentComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private apiService: DeploymentService,
        private projectService: ProjectService
    ) {
        this.stepperForm = this.fb.group({
            step1: this.fb.group({
                dbType: ['', [Validators.required]],
                port: ['', Validators.required],
                serviceName: ['', Validators.required],
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

    createProjectGroup(projectName: string, dockerImage: string): FormGroup {
        return this.fb.group({
            projectName: [projectName, Validators.required],
            dockerImage: [{ value: dockerImage, disabled: true }, Validators.required],
            serviceName: ['', Validators.required],
            port: ['', Validators.required],
            expose: [false],
            host: [''],
            projectEnvVars: this.fb.array([this.createEnvVariable()]),
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
                    const projectGroup = this.createProjectGroup(project.name, project.DockerImage);
                    this.projectsArray.push(projectGroup);
                });
                console.log(this.projectsArray);
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
        console.log('Deployment Data', deploymentData);
    
        this.apiService.generateDatabaseDeployment(deploymentData).subscribe(
            (response) => {
                this.generatedFiles.push(response.deploymentFilePath);
            },
            (error) => {
                console.error('Error generating database deployment:', error);
            }
        );
    }

    generateProjectDeployment(index: number): void {
        const projectGroup = this.projectsArray.at(index) as FormGroup;
        const deploymentData = {
            serviceName: projectGroup.value.serviceName,
            port: projectGroup.value.port,
            image: projectGroup.value.dockerImage,
            envVariables: projectGroup.value.projectEnvVars,
            namespace: this.stepperForm.value.namespace,
        };
    
        const expose = projectGroup.value.expose;
        const host = projectGroup.value.host;
    
        this.apiService
          .generateDeployment({...deploymentData, expose, host })
          .subscribe(
                (response) => {
                    console.log('Project deployment generated:', response);
                    this.generatedFiles.push(response.deploymentFilePath);
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
        console.log('Deployment', deploymentData);

        this.apiService.applyK8sFiles(deploymentData).subscribe(
            (response) => {
                console.log('Deployment applied:', response);
                this.dialogRef.close(this.stepperForm.value);
            },
            (error) => {
                console.error('Error applying deployment:', error);
            }
        );
    }

    onCancel(): void {
        this.dialogRef.close();
    }
}


