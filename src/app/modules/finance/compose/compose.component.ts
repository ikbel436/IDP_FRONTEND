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

interface RepositoryItem {
    _id: string;
    name: string;
    description: string | null;
    createdAt: string;
    lastUpdated: string;
    cloneUrl: string;
    language: string | null;
    __v: number;
}

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
    // selectedRepository: any;
    isLoading: boolean;
    @Input() repositories: any[] = [];
    @Output() selectedRepository = new EventEmitter<any>();

    constructor(
        public matDialogRef: MatDialogRef<MailboxComposeComponent>,
        private _formBuilder: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: any,

        private http: HttpClient,
        private cdr: ChangeDetectorRef
    ) {
        this.composeForm = this._formBuilder.group({
            name: ['', Validators.required],
            provider: [[]],
            SonarQubeproject: ['', Validators.required],
            K8s: ['', Validators.required],
            ArgoCD: ['', Validators.required],
            Dockerimg: ['', Validators.required],
            databaseType: ['', Validators.required],
        });
    }

    ngOnInit(): void {
        this.loadRepositories();
    }

    saveAndClose(): void {
        // Save the message as a draft
        this.saveAsDraft();

        // Close the dialog
        this.matDialogRef.close();
    }

    trackByFn(index: number, item: any): any {
        return item ? item.value : index;
    }

    selectRepository(repository: any): void {
        this.selectedRepository.emit(repository);
    }

    discard(): void {}

    saveAsDraft(): void {}

    send(): void {}

    onRepositorySelected(repository: any): void {
        this.selectedRepository = repository;
    }

    loadRepositories(): void {
        this.isLoading = true;

        this.http
            .get<RepositoryItem[]>('http://localhost:3000/Repos/Allrepos')
            .subscribe({
                next: (repositories) => {
                    const repoOptions = repositories.map((repo) => ({
                        value: repo._id,
                        viewValue: repo.name,
                    }));

                    console.log('Repo Options:', repoOptions);

                    if (!this.composeForm.controls['provider']) {
                        this.composeForm.setControl(
                            'provider',
                            new FormControl([])
                        );
                    }

                    this.composeForm.controls['provider'].setValue(repoOptions);

                    console.log(
                        'Provider Control Value:',
                        this.composeForm.controls['provider'].value
                    );

                    this.cdr.markForCheck();
                    this.isLoading = false;
                },
                error: (error) => {
                    console.error(error);
                    this.errorMessage = 'Failed to load repositories.';
                    this.isLoading = false;
                },
            });
    }
}
