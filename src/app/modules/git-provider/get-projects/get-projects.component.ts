import { Component } from '@angular/core';
import {
  AsyncPipe,
  CommonModule,
  CurrencyPipe,
  NgClass,
  NgFor,
  NgIf,
  NgTemplateOutlet,
} from '@angular/common';
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
import { BehaviorSubject, Subscription } from 'rxjs';
import { GitProviderService } from 'app/core/services/git-provider.service';
import { LocalStorageService } from 'app/modules/auth/utils/localStorage.service';
import { HttpClient } from '@angular/common/http';


export interface Repository {
  name: string;
  description?: string;
  createdAt: Date;
  lastUpdated: Date;
  cloneUrl: string;
  language: string;
}
@Component({
  selector: 'app-get-projects',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    NgIf,
    MatProgressBarModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSortModule,
    NgFor,
    NgTemplateOutlet,
    MatPaginatorModule,
    NgClass,
    MatSlideToggleModule,
    MatSelectModule,
    MatOptionModule,
    MatCheckboxModule,
    MatRippleModule,
    AsyncPipe,
    CurrencyPipe,
  ],
  templateUrl: './get-projects.component.html',
  styleUrl: './get-projects.component.scss',
})


export class GetProjectsComponent {
  projects: any[];
  subscription: Subscription | undefined;
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [
    'name',
    'description',
    'createdAt',
    'lastUpdated',
    'cloneUrl',
    'language',
  ];
  selectedProvider: 'github' | 'bitbucket' = 'github';
  errorMessage: string = '';
  repositoriesSubject = new BehaviorSubject<any[]>([]);

  constructor(
    public dialog: MatDialog,
    private gitProviderService: GitProviderService,
    private localStorageService: LocalStorageService,
    private http: HttpClient
  ) {
  }

  ngOnInit(): void {
    this.loadRepositories();
  }
  
  loadRepositories(): void {
    this.http.get('http://localhost:3000/Repos/get').subscribe({
      next: (repositories) => {
        if (Array.isArray(repositories)) {
          this.dataSource.data = repositories;
          this.repositoriesSubject.next(repositories);
          this.repositoriesSubject.subscribe(repositories => {
            if (!Array.isArray(repositories) || repositories.length === 0) {
              this.openDialog();
            }
          });
        } else {
          this.errorMessage = 'No repositories found.';
        }
      },
      error: (error) => {
        console.error(error);
        this.errorMessage = 'Failed to load repositories.';
      },
    });
  }
  




  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  copyToClipboard(url: string) {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        alert('URL copied to clipboard');
      })

      .catch((err) => {
        alert('Failed to copy URL');
      });
  }

  fetchRepositories(): void {
    const methodCall =
      this.selectedProvider === 'github'
        ? this.gitProviderService.getRepositoriesGit()
        : this.gitProviderService.getRepositoriesBitbucket();

    methodCall.subscribe({
      next: (response) => {
        if (response && Array.isArray(response)) {
          const mappedResponse = response.map((repo) => ({
            name: repo.name || repo.full_name,
            description: repo.description,
            createdAt: repo.createdAt || repo.created_at,
            lastUpdated: repo.updated_at,
            cloneUrl: repo.cloneUrl || repo.url,
            language: repo.language,
          }));

          this.http.post('http://localhost:3000/Repos/RepoTouser', mappedResponse).subscribe({
            next: () => {
              this.dataSource.data = mappedResponse;
              return "Repositories saved successfully."
            },
            error: (error) => {
              console.error(error);
              this.errorMessage = 'Failed to save repositories.';
            },
          });
        } else {
          this.errorMessage = 'No repositories found.';
        }
        this.errorMessage = '';
      },
      error: () => {
        this.errorMessage = 'Failed to fetch repositories. Please try again.';
      },
    });
  }


  openDialog(): void {
    const dialogRef = this.dialog.open(BitbucketCredComponent, {
      width: '400px',
      data: { selectedProvider: this.selectedProvider },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const { accessToken, workspace, selectedProvider } = result;
        this.gitProviderService.setCredentials(accessToken, workspace);
        this.selectedProvider = selectedProvider;
        this.fetchRepositories();
      }
    });
  }
}
