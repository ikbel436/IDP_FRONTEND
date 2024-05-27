import { Component, Inject, OnInit } from '@angular/core';
import {
    MatDialog,
    MAT_DIALOG_DATA,
    MatDialogRef,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
} from '@angular/material/dialog';
import { TextFieldModule } from '@angular/cdk/text-field';
import { NgClass } from '@angular/common';
import { ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { GitProviderService } from 'app/core/services/git-provider.service';
import { Router } from '@angular/router';
import { LocalStorageService } from 'app/modules/auth/utils/localStorage.service';
import { MatTableDataSource } from '@angular/material/table';


export interface DialogData {
    accessToken: string;
    workspace: string;
}

@Component({
    selector: 'bitbucket-cred.component',
    templateUrl: 'bitbucket-cred.component.html',
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    imports: [MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatDialogTitle,
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



    ],
})
export class BitbucketCredComponent {
    formFieldHelpers: string[] = [''];
    fixedSubscriptInput: FormControl = new FormControl('', [Validators.required]);
    dynamicSubscriptInput: FormControl = new FormControl('', [Validators.required]);
    fixedSubscriptInputWithHint: FormControl = new FormControl('', [Validators.required]);
    dynamicSubscriptInputWithHint: FormControl = new FormControl('', [Validators.required]);
    selectedProvider: 'github' | 'bitbucket';
    dataSource = new MatTableDataSource<any>();

    errorMessage: string = '';
    bitbucketForm: FormGroup;
    constructor(private formBuilder: FormBuilder, private gitProviderService: GitProviderService, private router: Router,
        public dialogRef: MatDialogRef<BitbucketCredComponent>,
        private localStorageService: LocalStorageService,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        this.bitbucketForm = this.formBuilder.group({
            accessToken: ['nothing', Validators.required],
            workspace: ['', Validators.required]
        });
    }
    onSubmit() {
        if (this.bitbucketForm.valid) {
            this.dialogRef.close(this.bitbucketForm.value);
        }
          this.fetchRepositories();
    }
    onCancel(): void {
        this.dialogRef.close();
    }

    handleProviderChange(event: MatSelectChange) {
        this.selectedProvider = event.value as 'github' | 'bitbucket'; // Cast the value to the expected type
        console.log(this.selectedProvider);
         this.fetchRepositories();
    }

    
    

    fetchRepositories() {
        let methodCall =
            this.selectedProvider 
                ? this.gitProviderService.getRepositoriesGit()
                : this.gitProviderService.getRepositoriesBitbucket();

        methodCall.subscribe({
            next: (response) => {
                if (response && Array.isArray(response)) {
                    // Map the response to match the expected structure
                    const mappedResponse = response.map((repo) => ({
                        name: repo.name || repo.full_name,
                        description: repo.description,
                        createdAt: repo.createdAt || repo.created_at,
                        lastUpdated: repo.updatedAt || repo.updated_at,
                        cloneUrl: repo.cloneUrl || repo.url,
                        language: repo.language,
                    }));

                    this.dataSource.data = mappedResponse;
                    this.localStorageService.saveData(
                        'repositories',
                        this.dataSource.data
                    );
                } else {
                    this.errorMessage = 'No repositories found.';
                }
                this.errorMessage = '';
            },
            error: (error) => {
                this.errorMessage =
                    'Failed to fetch repositories. Please try again.';
            },
        });
    }


    
}
