import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, NgClass } from '@angular/common';

import { AuthService } from 'app/core/auth/auth.service';
import { DeploymentsService } from './deployments.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { GetProjectsComponent } from '../git-provider/get-projects/get-projects.component';
import { MatPaginator } from '@angular/material/paginator';

import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-get-deployments',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    MatTableModule,
    MatSortModule,
    NgClass,
    MatProgressBarModule,
    CurrencyPipe,
    DatePipe,
    CommonModule,
    MatFormFieldModule,
    GetProjectsComponent,
    MatCheckboxModule,
    MatPaginatorModule
  ],
  templateUrl: './get-deployments.component.html',
  styleUrls: ['./get-deployments.component.scss']
})
export class GetDeploymentsComponent implements OnInit {
  deployments: any[] = [];
  displayedColumns: string[] = ['name', 'description', 'status', 'user', 'actions'];
  dataSource = new MatTableDataSource(this.deployments);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private deploymentService: DeploymentsService,private _snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.fetchDeployments();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  fetchDeployments(): void {
    this.deploymentService.getAllDeployments().subscribe(
      (response) => {
        this.deployments = response;
        this.dataSource.data = this.deployments;
      },
      (error) => {
        console.error('Error fetching deployments:', error);
      }
    );
  }
  deleteDeployment(deploymentId: string): void {
    this.deploymentService.deleteDeployment(deploymentId).subscribe(
      () => {
        this._snackBar.open('Deployment deleted successfully', 'Close', {
          duration: 2000,
        });
        this.fetchDeployments(); // Reload deployments after deletion
      },
      (error) => {
        console.error('Error deleting deployment', error);
        this._snackBar.open('Failed to delete deployment', 'Close', {
          duration: 2000,
        });
      }
    );
  }
}