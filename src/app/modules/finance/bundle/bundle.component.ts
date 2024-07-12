import { ChangeDetectorRef, Component, Inject } from '@angular/core';
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
import { MatOptionModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';

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
        MatOptionModule,
        MatChipsModule,
    ],
    templateUrl: './bundle.component.html',
    styleUrls: ['./bundle.component.scss'],
})
export class BundleComponent {
    selectedProjects: any[] = [];
    formFieldHelpers: string[] = [''];
    bundleName: string = '';
    bundleDescription: string = '';

    constructor(
        public matDialogRef: MatDialogRef<BundleComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private http: HttpClient,
    ) {
        this.selectedProjects = data.selectedProjects;
    }

    onNoClick(): void {
        this.matDialogRef.close(null);
    }

    onSave(): void {
        const selectedProjects = this.data.selectedProjects;
        console.log('Selected projects:', selectedProjects);
        this.http
            .post('http://localhost:3000/Bundle/BundleTouser', {
                name: this.bundleName,
                description: this.bundleDescription,
                Projects: selectedProjects,
            })
            .subscribe(
                (response) => {
                    console.log('Bundle created successfully:', response);
                    this.matDialogRef.close(true);
                    this.selectedProjects = [];
                },
                (error) => {
                    console.error('Error creating bundle:', error);
                }
            );
    }

    removeChip(projectToRemove: any): void {
        const index = this.data.selectedProjects.findIndex(
            (project) => project.id === projectToRemove.id
        );
        if (index > -1) {
            this.data.selectedProjects.splice(index, 1);
        }
    }
}
