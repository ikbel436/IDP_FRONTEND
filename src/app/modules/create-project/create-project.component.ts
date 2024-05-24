import { CommonModule, NgIf } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { QuillEditorComponent } from 'ngx-quill';
import { ProjectComponent } from 'app/mock-api/apps/project/project.component';
import { MatOptionModule } from '@angular/material/core';
import { DetailsProjectService } from '../details-project/details-project.service';


import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-create-project',
  standalone: true,
  imports: [MatButtonModule,MatOptionModule,MatSelectModule,CommonModule, MatIconModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, NgIf, QuillEditorComponent],
  templateUrl: './create-project.component.html',
  styleUrl: './create-project.component.scss'
})
export class CreateProjectComponent {
  
  databaseOptions: string[] = ['MySQL', 'MongoDB', 'PostgreSQL', 'SQLite', 'Other'];
  
  providerOptions: string[] = ['AWS', 'Azure', 'GCP'];
  projectForm: FormGroup;
  constructor(
    public matDialogRef: MatDialogRef<ProjectComponent>,
    private fb: FormBuilder,
    private projectSerivce:DetailsProjectService
)
{   this.projectForm = this.fb.group({
  name: ['', Validators.required],
  description: ['', Validators.required],
  provider: ['', Validators.required],
  lien: ['', Validators.required],
  backendDockerImage: ['', Validators.required],
  frontendDockerImage: ['', Validators.required],
  databaseType: ['', Validators.required]
});
}
selectProjectForm: UntypedFormGroup;
    quillModules: any = {
        toolbar: [
            ['bold', 'italic', 'underline'],
            [{align: []}, {list: 'ordered'}, {list: 'bullet'}],
            ['clean'],
        ],
    };
// -----------------------------------------------------------------------------------------------------
// @ Lifecycle hooks
// -----------------------------------------------------------------------------------------------------

/**
 * On init
 */
ngOnInit(): void
{
  
}
onSubmit() {
  if (this.projectForm.valid) {
    this.projectSerivce.createProject(this.projectForm.value).subscribe(
      response => {
        console.log('Project created successfully', response);
        this.matDialogRef.close(response); // Close dialog on success
      },
      error => {
        console.error('Error creating project', error);
      }
    );
  } else {
    console.error('Form is invalid');
    this.logValidationErrors();
  }
}

logValidationErrors() {
  Object.keys(this.projectForm.controls).forEach(key => {
    const controlErrors = this.projectForm.get(key).errors;
    if (controlErrors != null) {
      Object.keys(controlErrors).forEach(keyError => {
        console.error(`Control: ${key}, Error: ${keyError}, Value: ${controlErrors[keyError]}`);
      });
    }
  });
}
 /**
     * Show the copy field with the given field name
     *
     * @param name
     */


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
