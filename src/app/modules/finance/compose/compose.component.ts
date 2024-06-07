import { CommonModule, NgClass, NgIf } from '@angular/common';
import {
    Component,
    Inject,
    OnInit,
    ViewEncapsulation,
    ChangeDetectorRef,
    Input,
    Output,
    EventEmitter,
} from '@angular/core';
import {
    FormBuilder,
    FormsModule,
    ReactiveFormsModule,
    Validators,
    FormGroup,
    FormControl,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
    MatDialogRef,
    MAT_DIALOG_DATA,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { QuillEditorComponent } from 'ngx-quill';
import { MatOptionModule } from '@angular/material/core';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { TextFieldModule } from '@angular/cdk/text-field';
import { FinanceService } from '../finance.service';
import { DetailsProjectService } from 'app/modules/details-project/details-project.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';


@Component({
    selector: 'mailbox-compose',
    templateUrl: './compose.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        MatTableModule,
        MatButtonModule,
        MatIconModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        NgIf,
        QuillEditorComponent,
        MatOptionModule,
        FormsModule,
        MatButtonModule,
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatDialogClose,
        MatSelectModule,
        MatIconModule,
        MatDatepickerModule,
        MatOptionModule,
        MatChipsModule,
        MatButtonToggleModule,
        ReactiveFormsModule,
        NgClass,
        TextFieldModule,
        CommonModule,
    ],
})
export class MailboxComposeComponent implements OnInit {
    composeForm: FormGroup;
    displayedColumnsMatSort: MatSort;
    dataSource = new MatTableDataSource<any>();
    errorMessage: string = '';
    isloaded: boolean = false;
    providerOptions: any[] = [];
    isLoading: boolean;
    @Input() repositories: any[] = [];
    @Output() selectedRepository = new EventEmitter<any>();
    newProjectId: string | null = null; 
    projectData: any;
    isEditMode: boolean = false;
    showSnackbar$ = new BehaviorSubject<boolean>(false);

    constructor(
        public matDialogRef: MatDialogRef<MailboxComposeComponent>,
        private _formBuilder: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: any,
        


        private http: HttpClient,
        private cdr: ChangeDetectorRef,
        private financeService: FinanceService,
        private projectSerivce:DetailsProjectService,
        private _snackBar: MatSnackBar
    ) {
        // Initialize the form in the constructor
        this.composeForm = this._formBuilder.group({
            name: [{ value: '', disabled: this.isEditMode }, Validators.required],
            provider: [{ value: '', disabled: this.isEditMode }, Validators.required], // Ensure provider is required
            Status: ['', Validators.required],
            ArgoCD: ['', Validators.required],
            DockerImage: ['', Validators.required],
            DBType: ['', Validators.required],
            language: ['', Validators.required],
            SonarQube: ['', Validators.required],
        });

        if (data && data.projectData) {
            this.newProjectId = data.projectData._id;
            this.projectData = data.projectData; 
            this.isEditMode = true;

            // Populate the form if projectData is available
            if (this.projectData) {
                this.populateForm(this.projectData);
            }
        }
    }
    ngOnInit(): void {
     
        this.loadRepositories();
        if (this.isEditMode && this.projectData.provider) {
            this.loadProvider(this.projectData.provider);
        }
        if (this.projectData) {
            this.populateForm(this.projectData);
        }
    }
    loadProvider(providerId: string): void {
        this.financeService.getRepositoryById(providerId).subscribe((provider) => {
            this.composeForm.controls['provider'].setValue(provider._id);
        }, (error) => {
            console.error('Failed to load provider data:', error);
        });
    }
    populateForm(projectData: any): void {
        this.composeForm.patchValue({
            name: projectData.name,
            provider: projectData.provider,
            Status: projectData.Status,
            ArgoCD: projectData.ArgoCD,
            DockerImage: projectData.DockerImage,
            DBType: projectData.DBType,
            language: projectData.language,
            SonarQube: projectData.SonarQube,
        });

        if (this.isEditMode) {
            this.composeForm.controls['name'].disable();
            this.composeForm.controls['provider'].disable();
        }
    }

    saveAndClose(): void {
        // Save the message as a draft
        this.saveAsDraft();

        // Close the dialog
        this.matDialogRef.close();
    }

    discard(): void {}

    saveAsDraft(): void {}

    send(): void {
        const formData = this.composeForm.value;
    
        const updatedData = {
            _id: this.newProjectId,
            name: formData.name,
            provider: formData.provider,
            Status: formData.Status,
            ArgoCD: formData.ArgoCD,
            DockerImage: formData.DockerImage,
            DBType: formData.DBType,
            language: formData.language,
            SonarQube: formData.SonarQube,
        };


        this.projectSerivce.updateProject(this.newProjectId,updatedData)
        .subscribe(
            (updatedProject) => {
                this.matDialogRef.close({ updatedProject }); 
                window.location.reload();
                this._snackBar.open('Project updated', 'OK', {
                    duration: 3000,
                });
                
            },
            (error) => {
                console.error('Failed to update repository:', error);
            }
        );
    }
    
  
    loadRepositories(): void {
        setTimeout(() => {
            this.http
                .get<any[]>('http://localhost:3000/Repos/Allrepos')
                .subscribe((repositories) => {
                    this.dataSource.data = repositories;
                    this.repositories = repositories;
                    this.providerOptions = repositories.map((repo) => ({
                        value: repo._id,
                        viewValue: repo.name,
                    }));
                    this.cdr.detectChanges();
                    this.isLoading = true;
                    this.cdr.detectChanges();
                });
        }, 0);
    }

    selectRepository(repositoryId: string): void {
        this.selectedRepository.emit(repositoryId); // Emit the selected repository ID
        const selectedRepo = this.repositories.find(
            (repo) => repo._id === repositoryId
        );
    
        if (selectedRepo) {
            this.composeForm.controls['provider'].setValue(selectedRepo._id); 
            this.composeForm.patchValue({
                name: selectedRepo.name,
                ArgoCD: selectedRepo.ArgoCD,
                language: selectedRepo.language,
                DBType: selectedRepo.DBType,
                DockerImage: selectedRepo.DockerImage,
                Status: selectedRepo.Status,
                SonarQube: selectedRepo.SonarQube,
            });
        } else {
            console.error('Selected repository not found');
        }
    }

    trackByFn(index, item) {
        return item.value;
    }
}
