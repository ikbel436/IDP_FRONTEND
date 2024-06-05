import { CommonModule, CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnDestroy,
    OnInit,
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

export interface Repository {
    name: string;
    description: string | null;
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
    ],
})


export class FinanceComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('displayedColumns', { read: MatSort })
    displayedColumnsMatSort: MatSort;
    dataSource = new MatTableDataSource<any>();
    errorMessage: string = '';
    @Input() selectedProviderId: string;

    displayedColumns: string[] = [
        'name',
        'description',
        'createdAt',
        'lastUpdated',
        'Status',
        'ArgoCD',
        'DockerImage',
        'DBType',
        'language',
        'SonarQube',
    ];
    data: any;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private gitProviderService: GitProviderService,
        private http: HttpClient,
        private _matDialog: MatDialog,
        private cd: ChangeDetectorRef,
        private financeService: FinanceService,
        private projectSerivce:DetailsProjectService,

    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {

        this.getRepoData();

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

    openComposeDialog(): void {
        const dialogRef = this._matDialog.open(MailboxComposeComponent, {
            panelClass: 'custom-dialog-container',
        });

        dialogRef.componentInstance.selectedRepository.subscribe(
            (repositoryId) => {
                console.log('Received repository ID:', repositoryId);
                this.handleUpdatedRepository({ provider: repositoryId });
            }
        );

        dialogRef.afterClosed().subscribe((result) => {
            console.log('Compose dialog was closed!');
            
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------
    handleUpdatedRepository(data: { provider: string }): void {
        this.financeService
           .getRepositoryById(data.provider)
           .subscribe((updatedDetails) => {
                this.dataSource.data = [updatedDetails];
                this.cd.detectChanges();
                console.log('Updated details', updatedDetails);
    
                const repo: InventoryProject = {
                    name: updatedDetails.name,
                    description: updatedDetails.description,
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
    
                this.financeService.createRepo(repo).subscribe(
                    (response) => {
                        console.log('Project added successfully:', response);
                    },
                    (error) => {
                        console.error('Failed to add project:', error);
                    }
                );
            });
    }

    private getRepoData(): void {
        this.financeService.getRepos()
        .pipe(
             catchError(error => {
                 console.error('Error fetching projects:', error);
                 return of([]); 
             })
         )
         .subscribe(({ repos }: { repos: InventoryProject[] }) => {
            this.dataSource.data = repos;
            this.cd.detectChanges(); 
            console.log('Repos:', this.dataSource.data);
        });
    }
    
    }

    
    


