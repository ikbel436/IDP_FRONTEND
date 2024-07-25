import { Component } from '@angular/core';
import { CommonModule, NgClass, NgFor, TitleCasePipe } from '@angular/common';
import { TextFieldModule } from '@angular/cdk/text-field';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { InfrastructureService } from '../add-infrastructure/infrastructure.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-get-infra',
  standalone: true,
  imports: [CommonModule,  MatButtonModule, MatPaginatorModule, MatTableModule, MatSortModule, FormsModule, NgFor,
    MatIconModule, RouterLink, NgClass, MatMenuModule, MatCheckboxModule, MatProgressBarModule,
    MatFormFieldModule, MatInputModule, TextFieldModule, MatDividerModule, MatTooltipModule, TitleCasePipe
],
  templateUrl: './get-infra.component.html',
  styleUrl: './get-infra.component.scss'
})
export class GetInfraComponent {
  infrastructures: any[] = [];
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['image', 'title', 'description', 'fileName', 'actions'];

  constructor(private router: Router, private dialog: MatDialog, private infraService: InfrastructureService,private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getInfrastructures();
  }

  getInfrastructures(): void {
    this.infraService.getInfras().subscribe((data: any[]) => {
      this.infrastructures = data.map(infra => {
        if (infra.steps && infra.steps.length > 0) {
          infra.steps = infra.steps.reduce((acc, step) => {
            try {
              const parsedStep = JSON.parse(step);
              return Array.isArray(parsedStep) ? [...acc, ...parsedStep] : [...acc, parsedStep];
            } catch (e) {
              return [...acc, step];
            }
          }, []);
        }
        return infra;
      });
      this.dataSource.data = this.infrastructures;
    });
  }

  ngAfterViewInit(): void { }

  onPageChange(event: PageEvent): void {
    this.dataSource.paginator.pageIndex = event.pageIndex;
    this.dataSource.paginator.pageSize = event.pageSize;
  }

  downloadFile(fileUrl: string): void {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileUrl.split('/').pop();
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  deleteDeployment(id: string): void {
    this.infraService.deleteInfra(id).subscribe(() => {
      this.infrastructures = this.infrastructures.filter(infra => infra._id !== id);
      this.dataSource.data = this.infrastructures;
    });
  }
}
