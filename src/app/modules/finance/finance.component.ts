import { CommonModule, CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { GitProviderService } from 'app/core/services/git-provider.service';
import { Subject, catchError, of, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MailboxComposeComponent } from './compose/compose.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BehaviorSubject } from 'rxjs';
import { FinanceService } from './finance.service';
import { DetailsProjectService } from '../details-project/details-project.service';
import { InventoryProject } from 'app/mock-api/apps/project/project.types';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GetProjectsComponent } from '../git-provider/get-projects/get-projects.component';
import { BundleComponent } from './bundle/bundle.component';
import { MatCheckboxModule } from '@angular/material/checkbox';

export interface Repository {
    name: string;
    // description: string | null;
    createdAt: string;
    lastUpdated: string;
    cloneUrl: string;
    Status: string | null;
    ArgoCD: string | null;
    DockerImage: string | null;
    DBType: string | null;
    language: string | null;
    SonarQube: string | null;
}

@Component({
    selector: 'finance',
    templateUrl: './finance.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrl: './finance.component.scss',
    standalone: true,
    imports: [
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
    ],
})
export class FinanceComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('displayedColumns', { read: MatSort })
    displayedColumnsMatSort: MatSort;
    dataSource = new MatTableDataSource<any>();
    errorMessage: string = '';
    @Input() selectedProviderId: string;
    @Output() newProjectId = new EventEmitter<string>();
    projects: any[] = [];
    displayedColumns: string[] = [
        'checkbox',
        'name',
        'language',
        'createdAt',
        'cloneUrl',
        'lastUpdated',
        'Status',
        'ArgoCD',
        'DockerImage',
        'SonarQube',
        'DBType',
        'actions',
    ];
    selectedProjects: any[] = []; 
    data: any;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
//    selectedProject: any; 
    /**
     * Constructor
     */
    constructor(
        private gitProviderService: GitProviderService,
        private http: HttpClient,
        private _matDialog: MatDialog,
        private cd: ChangeDetectorRef,
        private financeService: FinanceService,
        private projectSerivce: DetailsProjectService,
        private _snackBar: MatSnackBar
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.getProjectData();
    }
    openBundleDialog(): void {
        this.collectSelectedProjects(); // Ensure selected projects are collected
        const dialogRef = this._matDialog.open(BundleComponent, {
          width: '500px',
          height: '500px',
          data: { selectedProjects: this.selectedProjects }
        });
        
      
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            console.log('The dialog was closed');
            // Handle the result, e.g., save the new bundle
          }
        });
      }
      

    collectSelectedProjects() {
        this.projects = this.dataSource.data;
      this.selectedProjects = this.projects.filter(project => project.selected);
      console.log('Projects before filtering:', this.projects);
      console.log('Selected projects:', this.selectedProjects);
    }
    
 
    editRow(element: any): void {
        this.openComposeDialog(element);
    }

    deleteRow(id: string): void {
        this.projectSerivce.deleteProject(id).subscribe(
            () => {
                this.dataSource.data = this.dataSource.data.filter(project => project._id !== id);
                this.cd.detectChanges(); 
                this._snackBar.open('Project deleted successfully', 'Close', {
                    duration: 2000,
                });
            },
            (error) => {
                console.error('Failed to delete project:', error);
                this._snackBar.open('Failed to delete project', 'Close', {
                    duration: 2000,
                });
            }
        );
    }
    /**
     * After view init
     */
    ngAfterViewInit(): void {}

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    /**
     * Open compose dialog
     */

    openComposeDialog(projectData: any = null): void {
        // Open the dialog without newProjectId
        const dialogRef = this._matDialog.open(MailboxComposeComponent, {
            panelClass: 'custom-dialog-container',
            data: { projectData }
        });

        dialogRef.componentInstance.selectedRepository.subscribe(
            (repositoryId) => {
                this.handleUpdatedRepository(
                    { provider: repositoryId },
                    dialogRef
                );
            }
        );

        dialogRef.afterClosed().subscribe((result) => {
            if (result && result.updatedProject) {
                // Update the data source with the new/updated project
                const index = this.dataSource.data.findIndex(project => project._id === result.updatedProject._id);
                if (index > -1) {
                    // Update existing project
                    this.dataSource.data[index] = result.updatedProject;
                } else {
                    // Add new project
                    this.dataSource.data = [...this.dataSource.data, result.updatedProject];
                }
                this.dataSource._updateChangeSubscription(); // Trigger table update
                this.cd.detectChanges(); // Trigger change detection manually
            }
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------
    handleUpdatedRepository(data: { provider: string }, dialogRef: any): void {
        this.financeService
            .getRepositoryById(data.provider)
            .subscribe((updatedDetails) => {
                this.dataSource.data = [updatedDetails];
                this.cd.detectChanges();

                const project: InventoryProject = {
                    _id: updatedDetails._id,
                    name: updatedDetails.name,
                    // description: updatedDetails.description,
                    createdAt: updatedDetails.createdAt,
                    lastUpdated: updatedDetails.lastUpdated,
                    cloneUrl: updatedDetails.cloneUrl,
                    Status: updatedDetails.Status,
                    ArgoCD: updatedDetails.ArgoCD,
                    DockerImage: updatedDetails.DockerImage,
                    DBType: updatedDetails.DBType,
                    language: updatedDetails.language,
                    SonarQube: updatedDetails.SonarQube,
                };

                this.projectSerivce.createProject(project).subscribe(
                    (response) => {
                        const newProjectId = response._id.toString(); // Ensure it's a string
                        dialogRef.componentInstance.newProjectId = newProjectId;
                        dialogRef.componentInstance.cdr.detectChanges();
                    },
                    (error) => {
                        console.error('Failed to add project:', error);
                    }
                );
            });
    }

    private getProjectData(): void {
        this.projectSerivce
            .getProjects()
            .pipe(
                catchError((error) => {
                    console.error('Error fetching projects:', error);
                    return of([]);
                })
            )
            .subscribe((projects) => {
                if ('projects' in projects) {
                    this.dataSource.data = projects.projects;
                } else {
                    console.error('Unexpected projects structure:', projects);
                }
                this.cd.detectChanges(); // Trigger change detection manually
            });
    }
}
