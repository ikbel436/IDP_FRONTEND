import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { HttpClientModule } from '@angular/common/http';
import { MatSelectModule } from '@angular/material/select';
import { InfrastructureService } from './infrastructure.service';

@Component({
  selector: 'app-add-infrastructure',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatIconModule,
    MatSelectModule,
    HttpClientModule
  ],
  templateUrl: './add-infrastructure.component.html',
  styleUrls: ['./add-infrastructure.component.scss']
})
export class AddInfrastructureComponent {
  infraForm: FormGroup;
  selectedImage: File | null = null;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private infraService: InfrastructureService,
    private snackBar: MatSnackBar
  ) {
    this.infraForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      steps: this.fb.array([this.createStep()]), // Add one step by default
      image: [null, Validators.required],
      file: [null, Validators.required]
    });
  }

  get steps(): FormArray {
    return this.infraForm.get('steps') as FormArray;
  }

  createStep(): FormGroup {
    return this.fb.group({
      step: ['', Validators.required]
    });
  }

  addStep() {
    this.steps.push(this.createStep());
  }

  removeStep(index: number) {
    this.steps.removeAt(index);
  }

  onImageSelected(event: any) {
    this.selectedImage = event.target.files[0];
    this.infraForm.patchValue({ image: this.selectedImage });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.infraForm.patchValue({ file: this.selectedFile });
  }

  triggerFileInput(inputId: string) {
    const fileInput = document.getElementById(inputId) as HTMLElement;
    fileInput.click();
  }

  resetForm() {
    this.infraForm.reset();
    // Clear the form array
    this.steps.clear();
    // Add one empty step
    this.addStep();
    // Reset file inputs
    this.selectedImage = null;
    this.selectedFile = null;
  }

  onSubmit() {
    if (this.infraForm.valid && this.selectedImage && this.selectedFile) {
      const formData = new FormData();
      formData.append('title', this.infraForm.get('title').value);
      formData.append('description', this.infraForm.get('description').value);
      formData.append('steps', JSON.stringify(this.infraForm.get('steps').value.map(step => step.step)));
      formData.append('image', this.selectedImage);
      formData.append('file', this.selectedFile);

      this.infraService.addInfra(formData).subscribe(
        () => {
          this.snackBar.open('Infrastructure added successfully', 'Close', { duration: 2000 });
          this.resetForm(); // Reset the form after successful submission
        },
        (error) => {
          console.error('Error adding infrastructure', error);
          this.snackBar.open('Failed to add infrastructure', 'Close', { duration: 2000 });
        }
      );
    } else {
      console.log('Form is invalid or files are missing');
    }
  }
}
