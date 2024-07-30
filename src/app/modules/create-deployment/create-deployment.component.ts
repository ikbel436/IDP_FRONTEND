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
import { DockerService } from './docker.service';

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
    @ViewChild('verticalStepper', { static: false })
    verticalStepper: MatStepper;
    dockerTags: string[][] = [];
    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<CreateDeploymentComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private apiService: DeploymentService,
        private projectService: ProjectService,
        private dialog: MatDialog,
        private _snackBar: MatSnackBar,
        private dockerService: DockerService
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

        this.dockerTags = [];
    }

    // fetchBundleData(): void {
    //     const bundleId = this.data.bundle._id;
    //     this.apiService.getBundleById(bundleId).subscribe(
    //         (bundle) => {
    //             this.bundleData = bundle;
    //             console.log('Bundle data:', this.bundleData);
    
    //             // Populate the envVars FormArray with the environment variables from the database                
    //             if(this.bundleData.myDBconfig.envVariables.length === 0) {                    
    //                 this.envVars.push(this.createEnvVariable());
    //             }
    //             else{
    //                 this.bundleData.myDBconfig.envVariables.forEach(envVar => {
    //                     this.envVars.push(this.createEnvVariable());
    //                     const index = this.envVars.length - 1;
    //                     this.envVars.at(index).patchValue({
    //                         name: envVar.key,
    //                         value: envVar.value
    //                     });
    //                 });
    //             }
    
    //             // Update other form fields
    //             this.step1.patchValue({
    //                 dbType: this.bundleData.myDBconfig.type  || '',
    //                 serviceName: this.bundleData.myDBconfig.serviceName || '',
    //                 port: this.bundleData.myDBconfig.port || ''
    //             });
    //             if (this.bundleData.myDBconfig.serviceName) {
    //                 this.step1.get('serviceName').disable();
    //             }
    //             this.step1.markAsDirty();
    //         },
    //         (error) => {
    //             console.error('Error fetching bundle data:', error);
    //         }
    //     );
    // }
    fetchBundleData(): void {
        const bundleId = this.data.bundle._id;
        this.apiService.getBundleById(bundleId).subscribe(
            (bundle) => {
                this.bundleData = bundle;
                console.log('Bundle data:', this.bundleData.myDBconfig);
    
                // Check if myDBconfig exists
                if (this.bundleData.myDBconfig) {
                    console.log('myDBconfig exists:', this.bundleData.myDBconfig);
    
                    // Check if envVariables exists and is an array
                    if (Array.isArray(this.bundleData.myDBconfig.envVariables)) {
                        this.bundleData.myDBconfig.envVariables.forEach(envVar => {
                            this.envVars.push(this.createEnvVariable());
                            const index = this.envVars.length - 1;
                            this.envVars.at(index).patchValue({
                                name: envVar.key,
                                value: envVar.value
                            });
                        });
                    } else {
                        console.warn('envVariables is not defined or not an array');
                    }
    
                    // Update other form fields
                    this.step1.patchValue({
                        dbType: this.bundleData.myDBconfig.type || '',
                        serviceName: this.bundleData.myDBconfig.serviceName || '',
                        port: this.bundleData.myDBconfig.port || ''
                    });
    
                    // Disable serviceName field if it already exists
                    if (this.bundleData.myDBconfig.serviceName) {
                        this.step1.get('serviceName').disable();
                    }
                } else {
                    console.warn('myDBconfig is not defined in the bundle data');
                }
    
                // Mark the form as dirty to make the save button clickable
                this.step1.markAsDirty();
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

    createProjectGroup(projectName: string, dockerImage: string, projectId: string, generated: boolean): FormGroup {
        return this.fb.group({
            projectName: [projectName, Validators.required],
            dockerImage: [dockerImage, Validators.required],
            dockerTag: ['main', Validators.required], // Ensure this is initialized
            registryType: ['', Validators.required],
            privacy: ['', Validators.required],
            projectId: [projectId],
            generated: [generated],
            serviceName: [
                { value: '', disabled: generated },
                [Validators.required, Validators.pattern('^[a-z0-9-]+$')],
            ],
            port: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
            imagePullSecretName: [''],
            dockerUsername: [''],
            dockerPassword: [''],
            dockerEmail: ['', Validators.email],
            expose: [false],
            host: [''],
            projectEnvVars: this.fb.array([]),
        });
      }
      
      
      
      
      
      onDockerImageBlur(projectIndex: number) {
        const projectGroup = this.projectsArray.at(projectIndex) as FormGroup;
        const dockerImage = projectGroup.get('dockerImage')?.value;
    
        if (dockerImage) {
            const [namespace, repository] = dockerImage.includes('/')
                ? dockerImage.split('/')
                : ['library', dockerImage];
            this.dockerService
                .getDockerImageTags(namespace, repository)
                .subscribe(
                    (data) => {
                        this.dockerTags[projectIndex] = data.results.map(
                            (tag) => tag.name
                        );
    
                        // Ensure 'main' tag is always included
                        if (!this.dockerTags[projectIndex].includes('main')) {
                            this.dockerTags[projectIndex].push('main');
                        }
    
                        // Set the first tag as default if it exists, otherwise set 'main' as default
                        if (this.dockerTags[projectIndex].length > 0) {
                            projectGroup
                                .get('dockerTag')
                                ?.setValue(this.dockerTags[projectIndex][0]);
                        } else {
                            projectGroup.get('dockerTag')?.setValue('main');
                        }
                    },
                    (error) => {
                        this.dockerTags[projectIndex] = ['main']; // Set 'main' as default in case of error
                        projectGroup.get('dockerTag')?.setValue('main');
                        this._snackBar.open(
                            'Error fetching Docker image tags',
                            'OK',
                            {
                                duration: 3000,
                                panelClass: ['mat-snack-bar-error'],
                            }
                        );
                        console.error(
                            'Error fetching Docker image tags:',
                            error
                        );
                    }
                );
        } else {
            this.dockerTags[projectIndex] = ['main']; // Set 'main' as default if no image is provided
            projectGroup.get('dockerTag')?.setValue('main');
        }
    }
    

    onRegistryTypeChange(projectIndex: number): void {
        const projectGroup = this.projectsArray.at(projectIndex) as FormGroup;
        this.clearValidators(projectGroup);
        const registryType = projectGroup.get('registryType')?.value;
        // if (registryType === 'github') {
        //     projectGroup.get('dockerTag')?.setValue('main');
        //     this.dockerTags[projectIndex] = ['main']; // Initialize with 'main'
        //     this.fetchDockerTags(projectIndex, ''); // Fetch additional tags for GitHub repository
            
        // } 

        // projectGroup.updateValueAndValidity();
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
        group.get('imagePullSecretName').updateValueAndValidity();
        group.get('dockerUsername').updateValueAndValidity();
        group.get('dockerPassword').updateValueAndValidity();
        group.get('dockerEmail').updateValueAndValidity();
        group.get('dockerImage').updateValueAndValidity();
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
    fetchDockerTags(projectIndex: number, dockerImage: string): void {
        if (dockerImage) {
            const [namespace, repository] = dockerImage.split('/');
            this.dockerService
                .getDockerImageTags(namespace, repository)
                .subscribe(
                    (tags) => {
                        this.dockerTags[projectIndex] = tags;
    
                        // Ensure 'main' tag is always included
                        if (!this.dockerTags[projectIndex].includes('main')) {
                            this.dockerTags[projectIndex].push('main');
                        }
    
                        const projectGroup = this.projectsArray.at(projectIndex);
                        const dockerTagControl = projectGroup.get('dockerTag');
                        if (dockerTagControl) {
                            dockerTagControl.setValue(this.dockerTags[projectIndex][0]); // Set the first tag as default
                        }
                    },
                    (error) => {
                        console.error('Error fetching Docker image tags:', error);
                        this._snackBar.open(
                            'Error fetching Docker image tags',
                            'OK',
                            {
                                duration: 3000,
                                panelClass: ['mat-snack-bar-error'],
                            }
                        );
                    }
                );
        }
    }
    
    fetchProjects(): void {
        const projectIds = this.data.bundle.Projects;
        const projectRequests = projectIds.map((id) =>
            this.projectService.getProjectsByIds(id)
        );
      
        forkJoin(projectRequests).subscribe(
          (projects: any[]) => {
            projects.forEach((project, index) => {
              const projectDeploymentConfig = project.myprojectDepl || [];
              const projectGroup = this.createProjectGroup(
                project.name,
                project.DockerImage[0],
                project._id,
                projectDeploymentConfig.length > 0
              );
      
              if (projectDeploymentConfig.length > 0) {
                const deploymentConfig = projectDeploymentConfig[0] || {};
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
                  registryType: deploymentConfig.registryType || '', // Fetch registryType
                  privacy: deploymentConfig.privacy || '', // Fetch privacy
                  generated: true
                });
                if (projectDeploymentConfig.length > 0) {
                  projectGroup.get('serviceName').disable();
                }
                const projectEnvVarsArray = projectGroup.get('projectEnvVars') as FormArray;
                projectEnvVarsArray.clear();
                envVariables.forEach(envVarGroup => projectEnvVarsArray.push(envVarGroup));
              }
      
              this.projectsArray.push(projectGroup);
              this.dockerTags[index] = [];
              this.fetchDockerTags(index, project.DockerImage[0]); // Fetch tags automatically
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
      
      skipProjectDeployment(index: number): void {
        const projectGroup = this.projectsArray.at(index) as FormGroup;
        projectGroup.patchValue({ generated: true, skipped: true }); // Mark as skipped

        this._snackBar.open('Project configuration skipped', 'OK', { duration: 2000 });

        // Optionally navigate to the final step
        this.verticalStepper.next(); // Move to the next step
    }
    
    generateDatabaseDeployment(): void {
        const deploymentData = {
            dbType: this.step1.value.dbType,
            serviceName: this.step1.get('serviceName').value,
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

    generateProjectDeployment(index: number): void {
        const projectGroup = this.projectsArray.at(index) as FormGroup;

        const deploymentData = {
            serviceName: projectGroup.get('serviceName').value,
            port: projectGroup.value.port,
            image: projectGroup.value.dockerImage,
            dockerTag: projectGroup.value.dockerTag,
            registryType: projectGroup.value.registryType,
            privacy: projectGroup.value.privacy,
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
        };

        console.log('Sending deployment data:', deploymentData);

        this.apiService.generateDeployment(deploymentData).subscribe(
            (response) => {
                console.log('Response from backend:', response);
                this.generatedFiles.push(response.deploymentFilePath);
                if (response.ingressFilePath) {
                    this.generatedFiles.push(response.ingressFilePath);
                }
                if (deploymentData.host) {
                    this.hosts.push(deploymentData.host);
                }
                projectGroup.patchValue({ generated: true });

                this._snackBar.open(response.msg, 'OK', { duration: 3000 });
            },
            (error) => {
                this._snackBar.open(
                    'Error generating project deployment',
                    'OK',
                    {
                        duration: 3000,
                        panelClass: ['mat-snack-bar-error'],
                    }
                );
                console.error('Error generating project deployment:', error);
            }
        );
    }
  
    onSubmit(): void {
        const deploymentData = {
            name: this.stepperForm.value.namespace,
            description: this.data.bundle.description,
            bundles: this.data.bundle,
            namespace: this.stepperForm.value.namespace,
        };

        this.apiService.pushFiles(deploymentData).subscribe(
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
