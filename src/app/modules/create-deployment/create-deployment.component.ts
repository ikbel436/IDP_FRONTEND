import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
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
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-create-deployment',
  standalone: true,
  imports: [CommonModule, MatButtonModule,
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
  ],
  templateUrl: './create-deployment.component.html',
  styleUrls: ['./create-deployment.component.scss']
})
export class CreateDeploymentComponent {
  stepperForm: FormGroup;
  projects: string[] = [];
  token = 'YOUR_JWT_TOKEN';
  generatedConfigMap = false;
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateDeploymentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: DeploymentService,
    private projectServicce: ProjectService
  )  {
    this.stepperForm = this.fb.group({
      databaseStep: this.fb.group({
        dbType: ['', Validators.required],
        port: ['', Validators.required],
        envVars: this.fb.array([this.createEnvVariable()])
      }),
      deploymentStep: this.fb.group({
        serviceName: ['', Validators.required],
        dockerImage: ['', Validators.required],
        envVars: this.fb.array([this.createEnvVariable()])
      }),
      projectStep: this.fb.group({
        project: ['', Validators.required],
        serviceName: ['', Validators.required],
        dockerImage: ['', Validators.required],
        port: ['', Validators.required],
        projectEnvVars: this.fb.array([this.createEnvVariable()]),
        expose: [false],
        host: ['']
      })
    });
  }

  ngOnInit(): void {
    this.fetchProjectNames();
  }

  get databaseStep(): FormGroup {
    return this.stepperForm.get('databaseStep') as FormGroup;
  }

  get deploymentStep(): FormGroup {
    return this.stepperForm.get('deploymentStep') as FormGroup;
  }

  get projectStep(): FormGroup {
    return this.stepperForm.get('projectStep') as FormGroup;
  }

  get envVars(): FormArray {
    return this.databaseStep.get('envVars') as FormArray;
  }

  get deploymentEnvVars(): FormArray {
    return this.deploymentStep.get('envVars') as FormArray;
  }

  get projectEnvVars(): FormArray {
    return this.projectStep.get('projectEnvVars') as FormArray;
  }

  createEnvVariable(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      value: ['']
    });
  }

  addEnvVar(): void {
    this.envVars.push(this.createEnvVariable());
  }

  removeEnvVar(index: number): void {
    this.envVars.removeAt(index);
  }

  addDeploymentEnvVar(): void {
    this.deploymentEnvVars.push(this.createEnvVariable());
  }

  removeDeploymentEnvVar(index: number): void {
    this.deploymentEnvVars.removeAt(index);
  }

  addProjectEnvVar(): void {
    this.projectEnvVars.push(this.createEnvVariable());
  }

  removeProjectEnvVar(index: number): void {
    this.projectEnvVars.removeAt(index);
  }
  fetchProjectNames(): void {
    const projectIds = this.data.bundle.Projects;
    const projectRequests = projectIds.map(id => this.projectServicce.getProjectsByIds(id));

    forkJoin(projectRequests).subscribe(
      (projects: any[]) => {
        this.projects = projects.map(project => project.name);
        console.log(this.projects); 
      },
      error => {
        console.error('Error fetching project names:', error);
      }
    );
  }

  generateDatabaseDeployment(): void {
    const deploymentData = {
      dbType: this.databaseStep.value.dbType,
      serviceName: this.databaseStep.value.serviceName,
      dbName: 'mydatabase', // Replace with actual DB name if needed
      port: this.databaseStep.value.port,
      envVariables: this.envVars.value
    };

    this.apiService.generateDatabaseDeployment(deploymentData).subscribe(response => {
      console.log('Database deployment generated:', response);
    }, error => {
      console.error('Error generating database deployment:', error);
    });
  }

  generateProjectDeployment(): void {
    const deploymentData = {
      serviceName: this.projectStep.value.serviceName,
      port: this.projectStep.value.port,
      image: this.projectStep.value.dockerImage,
      envVariables: this.projectStep.value.projectEnvVars
    };

    const expose = this.projectStep.value.expose;
    const host = this.projectStep.value.host;

    this.apiService.generateDeployment({ ...deploymentData, expose, host }).subscribe(response => {
      console.log('Project deployment generated:', response);
    }, error => {
      console.error('Error generating project deployment:', error);
    });
  }

  onSubmit(): void {
    console.log(this.stepperForm.value);
    this.dialogRef.close(this.stepperForm.value);
  }

  onCancel(): void {
    this.dialogRef.close();
  }}