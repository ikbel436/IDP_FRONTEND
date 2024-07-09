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
    inject,
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
import { CreateDeploymentComponent } from '../create-deployment/create-deployment.component';
import { FuseLoadingBarComponent } from '@fuse/components/loading-bar';
import { RouterModule } from '@angular/router';
import { IStepOption, TourMatMenuModule, TourService } from 'ngx-ui-tour-md-menu';

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
        FuseLoadingBarComponent,RouterModule,TourMatMenuModule
    ],
})
export class FinanceComponent implements OnInit, AfterViewInit, OnDestroy {
    public readonly tourService = inject(TourService);
    hasStartedTour = false;
   readonly tourSteps: IStepOption[] = [
  {
    anchorId: 'home',
    content: 'Discover the power of our Git provider integration! Easily import your repositories and start managing your projects with ease.',
    title: 'Repositories Import',
    enableBackdrop: true,
  },
  {
    anchorId: 'about',
    content: 'Add new projects to your workspace with just a few clicks. Streamline your development process and stay on top of your project portfolio.',
    title: 'Add New Projects',
    enableBackdrop: true,
  },
  {
    anchorId: 'contact',
    content: 'Select the projects you want to bundle together. Consolidate your efforts and optimize your deployment workflow.',
    title: 'Select Projects',
    enableBackdrop: true,
  },
  {
    anchorId: 'bundle',
    content: 'Create custom bundles from the selected projects. Group related components, services, and configurations to simplify your deployment process.',
    title: 'Create Bundles',
    enableBackdrop: true,
  },
  {
    anchorId: 'bundles',
    content: 'Choose a bundle from the list and deploy your projects with a single click. Streamline your application delivery and ensure consistent deployments.',
    title: 'Select Bundle',
    enableBackdrop: true,
  },
];

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
    bundles: any[] = [];
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
      this.tourService.initialize(this.tourSteps, {});
      const hasStartedTour = localStorage.getItem('hasStartedTour');
      if (!hasStartedTour) {
        setTimeout(() => {
          this.startTour();
          localStorage.setItem('hasStartedTour', 'true');
        }, 100);
      }
      this.getProjectData();
      this.fetchBundles();
    }
    
    
    startTour() {
        this.tourService.start();
    
      }
    openBundleConfig(bundle): void {
        const dialogRef = this._matDialog.open(CreateDeploymentComponent, {
          width: '1000px',
          data: { bundle }
        });
        this.cd.detectChanges(); 

    
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            console.log('Bundle configuration submitted:', result);
          }
        });
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

    fetchBundles(): void {
        this.financeService.getBundles().subscribe(
          (bundles) => {
            this.bundles = bundles;
            this.cd.detectChanges(); // Trigger change detection manually
          },
          (error) => {
            console.error('Failed to fetch bundles:', error);
          }
        );
      }
      

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
