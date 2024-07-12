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
import {
    IStepOption,
    TourMatMenuModule,
    TourService,
} from 'ngx-ui-tour-md-menu';
import { MatInputModule } from '@angular/material/input';

export interface Repository {
    name: string;
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
        FuseLoadingBarComponent,
        RouterModule,
        TourMatMenuModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatTableModule,
        MatCheckboxModule,
    ],
})
export class FinanceComponent implements OnInit, AfterViewInit, OnDestroy {
    public readonly tourService = inject(TourService);
    hasStartedTour = false;
    showGitProviderPopup = false;
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

    @ViewChild('displayedColumns', { read: MatSort }) displayedColumnsMatSort: MatSort;
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

    constructor(
        private gitProviderService: GitProviderService,
        private http: HttpClient,
        private _matDialog: MatDialog,
        private cd: ChangeDetectorRef,
        private financeService: FinanceService,
        private projectSerivce: DetailsProjectService,
        private _snackBar: MatSnackBar
    ) {}

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
            data: { bundle },
        });
        this.cd.detectChanges();
        console.log('Bundle:', bundle._id); 
    
        dialogRef.afterClosed().subscribe((result) => {
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
            data: { selectedProjects: this.selectedProjects },
        });
    
        dialogRef.afterClosed().subscribe((result) => {
            console.log("Result from dialog:", result); // Check the result value
            if (result) {
                console.log('The dialog was closed successfully with result:', result);
                this.fetchBundles(); // Refresh the bundles after closing the dialog
            } else {
                console.log('The dialog was closed without adding a new bundle');
            }
        });
    }
    
    applyFilter(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    collectSelectedProjects() {
        this.projects = this.dataSource.data;
        this.selectedProjects = this.projects.filter(
            (project) => project.selected
        );
        console.log('Projects before filtering:', this.projects);
        console.log('Selected projects:', this.selectedProjects);
    }

    editRow(element: any): void {
        this.openComposeDialog(element);
    }

    onCheckboxChange(event: any, element: any): void {
        element.selected = event.checked;
        this.collectSelectedProjects();
    }

    deleteRow(id: string): void {
        this.projectSerivce.deleteProject(id).subscribe(
            () => {
                this.dataSource.data = this.dataSource.data.filter(
                    (project) => project._id !== id
                );
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

    ngAfterViewInit(): void {}

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();

        // Unregister all tour anchors
        this.tourSteps.forEach(step => {
            this.tourService.unregister(step.anchorId);
        });
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    openComposeDialog(projectData: any = null): void {
        const dialogRef = this._matDialog.open(MailboxComposeComponent, {
            panelClass: 'custom-dialog-container',
            data: { projectData },
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
                const index = this.dataSource.data.findIndex(
                    (project) => project._id === result.updatedProject._id
                );
                if (index > -1) {
                    this.dataSource.data[index] = result.updatedProject;
                } else {
                    this.dataSource.data = [
                        ...this.dataSource.data,
                        result.updatedProject,
                    ];
                }
                this.dataSource._updateChangeSubscription(); 
                this.cd.detectChanges();
            }
        });
    }

    fetchBundles(): void {
        this.financeService.getBundles().subscribe(
            (bundles) => {
                this.bundles = bundles;
                console.log('Fetched bundles:', bundles);
                this.cd.detectChanges(); 
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
                        const newProjectId = response._id.toString(); 
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
                this.cd.detectChanges();
            });
    }
}
