import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
@Component({
  selector: 'app-deployment-details',
  standalone: true,
  imports: [CommonModule,    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,     MatChipsModule,MatOptionModule ],
  templateUrl: './deployment-details.component.html',
  styleUrl: './deployment-details.component.scss'
})
export class DeploymentDetailsComponent {
  constructor(
    public dialogRef: MatDialogRef<DeploymentDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public deployment: any
  ) { }

  onClose(): void {
    this.dialogRef.close();
  }
}
