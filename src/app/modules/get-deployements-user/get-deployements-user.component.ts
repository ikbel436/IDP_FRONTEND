import { Component, ViewChild } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { GetProjectsComponent } from '../git-provider/get-projects/get-projects.component';
import { DeploymentsService } from '../get-deployments/deployments.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { DeploymentDetailsComponent } from '../deployment-details/deployment-details.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-get-deployements-user',
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
    MatPaginatorModule,
    MatInputModule 
  ],
  templateUrl: './get-deployements-user.component.html',
  styleUrl: './get-deployements-user.component.scss'
})
export class GetDeployementsUserComponent {
  deployments: any[] = [];
  displayedColumns: string[] = ['name', 'description', 'status', 'actions'];
  dataSource = new MatTableDataSource(this.deployments);

@ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private deploymentService: DeploymentsService,public dialog: MatDialog) {}
  ngOnInit(): void {
    this.fetchDeployments();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  fetchDeployments(): void {
    this.deploymentService.getAllDeployments().subscribe(
      (response) => {
        this.deployments = response;
        this.dataSource.data = this.deployments;
        this.dataSource.paginator.pageSize = 6;
      },
      (error) => {
        console.error('Error fetching deployments:', error);
      }
    );
  }
  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  trackByFn(index, item) {
    return item.id;
  }
  openDetails(deployment): void {
    this.dialog.open(DeploymentDetailsComponent, {
      width: 'auto',
      data: deployment
    });
  }
}
