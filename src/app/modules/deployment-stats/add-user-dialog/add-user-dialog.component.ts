import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { AuthService } from 'app/core/auth/auth.service';

@Component({
  selector: 'app-add-user-dialog',
  standalone: true,
  imports: [CommonModule,
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
    MatCheckboxModule,],
  templateUrl: './add-user-dialog.component.html',
  styleUrl: './add-user-dialog.component.scss'
})
export class AddUserDialogComponent {
  addUserForm: FormGroup;
  isUpdateMode: boolean;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddUserDialogComponent>,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isUpdateMode = !!data;

    this.addUserForm = this.fb.group({
      name: [data ? data.name : '', Validators.required],
      email: [data ? data.email : '', [Validators.required, Validators.email]],
      phoneNumber: [data ? data.phoneNumber : '', Validators.required],
      birthDate: [data ? data.birthDate : '', Validators.required],
      role: [data ? data.role : 'User']
    });

    if (!this.isUpdateMode) {
      this.addUserForm.addControl('password', this.fb.control('', Validators.required));
    }
  }

  onSubmit(): void {
    if (this.addUserForm.valid) {
      if (this.isUpdateMode) {
        const updateData = { ...this.addUserForm.value };
        this.authService.updateUser(this.data._id, updateData).subscribe(
          () => {
            this.dialogRef.close('success');
          },
          (error) => {
            console.error('Error updating user:', error);
          }
        );
      } else {
        this.authService.signUpAdmin(this.addUserForm.value).subscribe(
          () => {
            this.dialogRef.close('success');
          },
          (error) => {
            console.error('Error adding user:', error);
          }
        );
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
