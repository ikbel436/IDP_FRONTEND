import { CommonModule, CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
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
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MailboxComposeComponent } from './compose/compose.component';
import { MatFormFieldModule } from '@angular/material/form-field';



export interface Repository {
    name: string;
    description?: string;
    createdAt: Date;
    lastUpdated: Date;
    cloneUrl: string;
    language: string;
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
        MatFormFieldModule
    ],
})


export class FinanceComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('displayedColumns', { read: MatSort })
    displayedColumnsMatSort: MatSort;
    dataSource = new MatTableDataSource<any>();
    errorMessage: string = '';
    isloaded: boolean = false;


    // displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
    // dataSource = ELEMENT_DATA;
    displayedColumns: string[] = [
        'name',
        'description',
        'createdAt',
        'lastUpdated',
        
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

    ) {
      
        
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
         this.loadRepositories();

      
    }

    /**
     * After view init
     */
    ngAfterViewInit(): void {
        // Make the data source sortable
        // this.recentTransactionsDataSource.sort =
        //     this.recentTransactionsTableMatSort;
    }

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
 

   openComposeDialog(): void
{
    // Open the dialog
    const dialogRef = this._matDialog.open(MailboxComposeComponent, {
      
  panelClass: 'custom-dialog-container',
  
  
      });

    dialogRef.afterClosed()
        .subscribe((result) =>
        {
            console.log('Compose dialog was closed!');
        });
}

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    loadRepositories(): void {
        this.http.get('http://localhost:3000/Repos/Allrepos').subscribe({
          next: (repositories) => {
            console.log("azerty", Array.isArray(repositories));
            
            if (Array.isArray(repositories)) {                
              this.dataSource.data = repositories;
             this.isloaded = true;
            } else {
                this.isloaded = true;

              this.errorMessage = 'No repositories found.';
            }
          },
          error: (error) => {
            console.error(error);
            this.errorMessage = 'Failed to load repositories.';
          },
        });
      }
}
