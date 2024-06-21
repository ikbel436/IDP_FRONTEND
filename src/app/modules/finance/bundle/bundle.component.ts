import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogModule,
    MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
@Component({
    selector: 'app-bundle',
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatDividerModule,
        MatTableModule,
        MatSortModule,
        MatProgressBarModule,
        MatFormFieldModule,
        MatDialogModule,
        FormsModule,
        MatInputModule,
    ],
    templateUrl: './bundle.component.html',
    styleUrl: './bundle.component.scss',
})
export class BundleComponent {
    constructor(
        public matDialogRef: MatDialogRef<BundleComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private http: HttpClient
    ) {}
    onNoClick(): void {
        this.matDialogRef.close();
    }
    onSave(bundleName: string, bundleDescription: string): void {
        const selectedProjects = this.data.selectedProjects;
        console.log('Selected projects:', selectedProjects);
        this.http
            .post('http://localhost:3000/Bundle/BundleTouser', {
                name: bundleName,
                description: bundleDescription,
                Projects: selectedProjects,
            })
            .subscribe(
                (response) => {
                    console.log('Bundle created successfully:', response);
                    this.matDialogRef.close(true);
                },
                (error) => {
                    console.error('Error creating bundle:', error);
                }
            );
    }
}
