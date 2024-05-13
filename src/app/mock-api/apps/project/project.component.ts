    import { CommonModule } from '@angular/common';
    import { AsyncPipe, CurrencyPipe, NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
    import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
    import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
    import { MatButtonModule } from '@angular/material/button';
    import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
    import { MatOptionModule, MatRippleModule  } from '@angular/material/core';

    import { MatFormFieldModule } from '@angular/material/form-field';
    import { MatIconModule } from '@angular/material/icon';
    import { MatInputModule } from '@angular/material/input';
    import { MatTableModule } from '@angular/material/table';
    import { MatTabsModule } from '@angular/material/tabs';

    import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
    import { MatProgressBarModule } from '@angular/material/progress-bar';
    import { MatSelectModule } from '@angular/material/select';
    import { MatSlideToggleModule } from '@angular/material/slide-toggle';
    import { MatSort, MatSortModule } from '@angular/material/sort';
    import { fuseAnimations } from '@fuse/animations';
    import { FuseConfirmationService } from '@fuse/services/confirmation';
    import { catchError, debounceTime, map, merge, Observable, of, Subject, switchMap, takeUntil, tap } from 'rxjs';
    import { InventoryProject } from './project.types';
    import {  ProjectService } from './project.service';
    import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';


    @Component({
    selector: 'app-project',
    standalone: true,
    templateUrl: './project.component.html',
    styles: [  
        /* language=SCSS */
    `
        .inventory-grid {
            grid-template-columns: 48px auto 40px;

            @screen sm {
                grid-template-columns: 48px auto 112px 72px;
            }

            @screen md {
                grid-template-columns: 48px 112px auto 112px 72px;
            }

            @screen lg {
                grid-template-columns: 48px 112px auto 112px 96px 96px 72px;
            }
        }
    `,
    ],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations     : fuseAnimations,
    imports        : [MatTabsModule,NgIf,ReactiveFormsModule, MatProgressBarModule, MatFormFieldModule, MatIconModule, MatInputModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatSortModule, NgFor, NgTemplateOutlet, MatPaginatorModule, NgClass, MatSlideToggleModule, MatSelectModule, MatOptionModule, MatCheckboxModule, MatRippleModule, AsyncPipe, CurrencyPipe],
    })
    export class ProjectComponent {
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    projects$: Observable<InventoryProject[]>;


    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    selectProject: InventoryProject | null = null;
   
    selectProjectForm: UntypedFormGroup;
    tagsEditMode: boolean = false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    user: any; // Initialize with the user's data
    name: string;
    description: string;
    lien: string;
    provider: string;
    isloaded: boolean = false;
    testProjects: any[] = []
 
    /**
     * Constructor
     */
    constructor(
        private cdRef: ChangeDetectorRef,
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: UntypedFormBuilder,
        // private _inventoryService: InventoryService,
        private _inventoryService: ProjectService,
        private router: Router

    )
    { 
    }
    

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------
    handleProviderSelection(provider: string): void {
        const providers = this.selectProjectForm.get('provider') as FormControl;
        if (Array.isArray(providers.value)) { // Ensure providers.value is an array
            if (providers.value.includes(provider)) {
                providers.setValue(providers.value.filter(p => p!== provider));
            } else {
                providers.setValue([...providers.value, provider]);
            }
        } else {
            console.error('Expected providers.value to be an array');
        }
    }
    

    /**
     * On init
     */
    ngOnInit(): void
    { 
        this.fetchProjects();
        this.projects$ = this._inventoryService.products$;
        // this.projects$ = this._inventoryService.products$;
        // console.log(this.projects$);
        // Create the selected product form
        this.selectProjectForm = this._formBuilder.group({
            _id: [''],
            name: ['', Validators.required],
            provider: [''],
            lien: [''],
            description: [''],
            reference: [''],
        });
     
        // Subscribe to search input field value changes
        this.searchInputControl.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                switchMap((query) =>
                {
                    this.closeDetails();
                    this.isLoading = true;
                    return this._inventoryService.getProjects();
                }),
                map(() =>
                {
                    this.isLoading = false;
                }),
            )
            .subscribe();
            this.projects$ = this._inventoryService.products$;
    }

    /**
     * After view init
     */
    ngAfterViewInit(): void
    {
        if ( this._sort && this._paginator )
        {
            // Set the initial sort
            this._sort.sort({
                id          : 'name',
                start       : 'asc',
                disableClear: true,
            });

            // Mark for check
            this._changeDetectorRef.markForCheck();

            // If the user changes the sort order...
            this._sort.sortChange
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(() =>
                {
                    // Reset back to the first page
                    this._paginator.pageIndex = 0;

                    // Close the details
                    this.closeDetails();
                });

            // Get products if sort or page changes
            merge(this._sort.sortChange, this._paginator.page).pipe(
                switchMap(() =>
                {
                    this.closeDetails();
                    this.isLoading = true;
                    return this._inventoryService.getProjects();
                }),
                map(() =>
                {
                    this.isLoading = false;
                }),
            ).subscribe();
        }
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    showDetails = false;
 /**
     * Toggle product details
     *
     * @param productId
     */

 private showDetailsMap = new Map<string, boolean>();

 toggleDetails(productId: string): void {
     // Check if the product is already selected
     if (this.selectProject && this.selectProject._id === productId) {
         // If the product is already selected, close the details
         this.closeDetails();
         return;
     }
     console.log('Project ID:', productId);
     // Attempt to get the project by ID
     this._inventoryService.getProjectsByIds(productId).subscribe((project) => {
        console.log('Received project:', project);
         // Toggle the visibility of the details
         console.log(productId);
         this.showDetails =!this.showDetails;
         this.showDetailsMap.set(productId,!this.showDetailsMap.get(productId));
 
         // Set the selected project
         this.selectProject = project;
 
         // Patch the form with the selected project's data
         this.selectProjectForm.patchValue({
             _id: project._id,
             name: project.name,
             provider: project.provider,
             lien: project.lien,
             description: project.description,
             reference: project.reference
         });
         console.log(this.selectProjectForm.getRawValue())
 
         // Mark the component for change detection
         this._changeDetectorRef.markForCheck();
 
         // Optionally, log the selected project again after patching the form
         console.log(this.selectProject);
     }, error => {
         // Handle any errors that occur during the subscription
         console.error('Error fetching project:', error);
     });
 }
    /**
     * Close the details
     */
    closeDetails(): void
    {
        this.selectProject = null;
    }



    /**
     * Toggle the tags edit mode
     */
    toggleTagsEditMode(): void
    {
        this.tagsEditMode = !this.tagsEditMode;
    }


    /**
     * Create product
     */
    createProject(): void {
        // Create the product
        this._inventoryService.createProject(this.name, this.description, this.provider, this.lien).subscribe((newProject) => {
            // Go to new product
            this.selectProject = newProject;
          
            // Fill the form
            this.selectProjectForm.patchValue(newProject);
            // Mark for check
            this._changeDetectorRef.markForCheck();
    
            // Fetch projects again to refresh the list
            this.fetchProjects();
        });
    }



    // Inside your component class
    fetchProjects(): void {
    
        this._inventoryService.getProjects()
        .pipe(
        tap(), // Debugging line
            switchMap((projects:any) => {
            this.testProjects = projects.projects
            return of(projects.projects); 
            }),
            catchError(error => {
            console.error('Error fetching projects:', error);
            return of([]);
            })
        )
        .subscribe(
            (projects) => {
            this.projects$ = of(projects);
            this.projects$.subscribe((projects:any) => {
                console.log("projects", projects);
                this.testProjects = projects
              
                this.isloaded = true;
                console.log("isloaded", this.isloaded);
                
                this.cdRef.detectChanges();
            })
            this.cdRef.detectChanges(); // Manually trigger change detection

            }
        );
    }
    

    openLien(url: string) {
        window.open(url, '_blank');
      }
 
     
      


    // /**
    //  * Update the selected product using the form data
    //  */
   
    
 
    updateSelectedProduct(): void {
        // Assuming getRawValue() returns the form values as they were submitted
        const project = this.selectProjectForm.getRawValue();
        console.log("project aaaaaa", project._id);
        
        // Update the product on the server
        this._inventoryService.updateProject1(project._id,project).subscribe(
            (updatedProject) => {
                // Assuming 'school' is a nested form group and 'code' is a form control within it
                const updatedValues = {
                    school: {
                        code: updatedProject.code // Adjust according to your actual form structure
                    },
                    // Include other form controls as needed
                };
                console.log("the new name", updatedProject.name);
    
                // Patch the form with the updated project values
                this.selectProjectForm.patchValue(updatedValues);
                console.log("projectupdated", this.selectProjectForm.value); // Log the updated form values
    
                // Manually trigger change detection
                this._changeDetectorRef.detectChanges();
                const index = this.testProjects.findIndex(p => p._id === updatedProject._id);
                if (index!== -1) {
                    // Replace the project in the array with the updated project
                    this.testProjects[index] = updatedProject;
                }
                // Optionally, show a success message
                this.showFlashMessage('success');
            },
            (error) => {
                console.error('Update failed:', error);
                // Handle error, e.g., show an error message
                this.showFlashMessage('error');
            }
        );
    }
    
    

    /**
     * Delete the selected product using the form data
     */
    deleteSelectedProduct(): void
    {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title  : 'Delete product',
            message: 'Are you sure you want to remove this product? This action cannot be undone!',
            actions: {
                confirm: {
                    label: 'Delete',
                },
            },
        });

       // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) =>
        {
            // If the confirm button pressed...
            if ( result === 'confirmed' )
            {
                // Get the product object
                const project = this.selectProjectForm.getRawValue();
        console.log("project aaaaaa", project.name);

                // Delete the product on the server
                this._inventoryService.deleteProduct(project._id).subscribe(() =>
                {   //this.fetchProjects();
                    // Close the details
                    this.closeDetails();
                    const index = this.testProjects.findIndex(p => p._id === project._id);
                    if (index!== -1) {
                        this.testProjects.splice(index, 1);
                    }
                    this.fetchProjects();
                });
            }
        });
    }

    /**
     * Show flash message
     */
    showFlashMessage(type: 'success' | 'error'): void
    {
        // Show the message
        this.flashMessage = type;

        // Mark for check
        this._changeDetectorRef.markForCheck();

        // Hide it after 3 seconds
        setTimeout(() =>
        {
            this.flashMessage = null;

            // Mark for check
            this._changeDetectorRef.markForCheck();
        }, 3000);
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }

    }
