import { NgIf } from '@angular/common';
import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators ,FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef , MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { QuillEditorComponent } from 'ngx-quill';
import { MatOptionModule } from '@angular/material/core';

@Component({
    selector     : 'mailbox-compose',
    templateUrl  : './compose.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone   : true,
    imports      : [MatButtonModule, MatIconModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, NgIf, QuillEditorComponent,MatOptionModule],
})
export class MailboxComposeComponent implements OnInit
{
    composeForm: FormGroup;
    
    // -----------------------------------------------------------------------------------------------------
    
    /**
     * Constructor
     */
    constructor(
        public matDialogRef: MatDialogRef<MailboxComposeComponent>,
        private _formBuilder: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: any

    )
    {this.composeForm = this._formBuilder.group({
        name: ['', Validators.required],
        provider: ['', Validators.required],
        SonarQubeproject: ['', Validators.required],
        K8s: ['', Validators.required],
        ArgoCD: ['', Validators.required],
        Dockerimg: ['', Validators.required],
        databaseType: ['', Validators.required]
      });
        
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // this.composeForm= this._formBuilder.group({
        //     name: [this.data?.project?.name || ''],
        //     provider: [this.data?.project?.provider || ''],
        //     SonarQubeproject: [this.data?.project?.SonarQubeproject || ''],
        //     K8s: [this.data?.project?.K8s || ''],
        //     ArgoCD: [this.data?.project?.ArgoCD || ''],
        //     Dockerimg: [this.data?.project?.Dockerimg || ''],
        //     databaseType: [this.data?.project?.databaseType || '']
        //   });

    }


    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

   

    /**
     * Save and close
     */
    saveAndClose(): void
    {
        // Save the message as a draft
        this.saveAsDraft();

        // Close the dialog
        this.matDialogRef.close();
    }

    /**
     * Discard the message
     */
    discard(): void
    {
    }

    /**
     * Save the message as a draft
     */
    saveAsDraft(): void
    {
    }

    /**
     * Send the message
     */
    send(): void
    {
    }
}
