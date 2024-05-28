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
import { CommonModule, NgClass } from '@angular/common';
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
import { MatSelectModule } from '@angular/material/select';
import { GitProviderService } from 'app/core/services/git-provider.service';
import { Router } from '@angular/router';


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
        CommonModule,


    ],
})
export class BitbucketCredComponent {
    formFieldHelpers: string[] = [''];
    fixedSubscriptInput: FormControl = new FormControl('', [Validators.required]);
    dynamicSubscriptInput: FormControl = new FormControl('', [Validators.required]);
    fixedSubscriptInputWithHint: FormControl = new FormControl('', [Validators.required]);
    dynamicSubscriptInputWithHint: FormControl = new FormControl('', [Validators.required]);
    selectedProvider: 'github' | 'bitbucket' ;
    bitbucketForm: FormGroup;
    constructor(private formBuilder: FormBuilder, private gitProviderService: GitProviderService, private router: Router,
        public dialogRef: MatDialogRef<BitbucketCredComponent>,
        
        @Inject(MAT_DIALOG_DATA) public data: any) {
            this.selectedProvider = data.selectedProvider || 'github'; 
        this.bitbucketForm = this.formBuilder.group({
            accessToken: ['', Validators.required],
            workspace: [''],
            selectedProvider: [this.selectedProvider, Validators.required] 
        });
       

    }
    onSubmit() {
        if (this.bitbucketForm.valid) {
            this.dialogRef.close(this.bitbucketForm.value);
        }
    }
    onCancel(): void {
        this.dialogRef.close();
    }

    handleProviderChange(provider: 'github' | 'bitbucket'): void {
        this.selectedProvider = provider;
        this.bitbucketForm.patchValue({ selectedProvider: provider }); 
    }
   
      
}