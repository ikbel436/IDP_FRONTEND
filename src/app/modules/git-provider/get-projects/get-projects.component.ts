import { Component } from '@angular/core';
import { AsyncPipe, CommonModule, CurrencyPipe, NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { BitbucketCredComponent } from './bitbucket-cred.component';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { GitProviderService } from 'app/core/services/git-provider.service';



@Component({
  selector: 'app-get-projects',
  standalone: true,
  imports: [CommonModule, MatTableModule, NgIf, MatProgressBarModule, MatFormFieldModule, MatIconModule, MatInputModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatSortModule, NgFor, NgTemplateOutlet, MatPaginatorModule, NgClass, MatSlideToggleModule, MatSelectModule, MatOptionModule, MatCheckboxModule, MatRippleModule, AsyncPipe, CurrencyPipe],
  templateUrl: './get-projects.component.html',
  styleUrl: './get-projects.component.scss'
})
export class GetProjectsComponent {
  projects: any[];
  subscription: Subscription | undefined;
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['name', 'description', 'createdAt', 'lastUpdated', 'cloneUrl', 'language'];
  //repositories: any[] = [];
  errorMessage: string = '';
  constructor(
    public dialog: MatDialog, private gitProviderService: GitProviderService,
  ) { }

  ngOnInit() {
    this.openDialog();
  }


  fetchRepositories() {
    this.gitProviderService.getRepositories().subscribe({
      next: (response) => {
        if (response && response.repositories) {
          this.dataSource.data = response.repositories.enhancedRepositories;
        } else {
          this.errorMessage = 'No repositories found.';
        }
        this.errorMessage = '';
      },
      error: (error) => {
        this.errorMessage = 'Failed to fetch repositories. Please try again.';
      }
    });
  }




  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(BitbucketCredComponent, {
      width: '400px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const { accessToken, workspace } = result;
        this.gitProviderService.setCredentials(accessToken, workspace);
        this.fetchRepositories();
      }
    });

  }
  copyToClipboard(url: string) {
    navigator.clipboard.writeText(url).then(() => {
      alert('URL copied to clipboard');
    }).catch(err => {
      alert('Failed to copy URL');
    });
  }


}
