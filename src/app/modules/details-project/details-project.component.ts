import { CurrencyPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { ProjectService } from 'app/mock-api/apps/project/project.service';
import { InventoryProject } from 'app/mock-api/apps/project/project.types';
import { AsyncPipe } from '@angular/common';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';
import { Observable, Subject, map, takeUntil, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DetailsProjectService } from './details-project.service';
import { UserService } from 'app/core/user/user.service';
@Component({
  selector: 'app-details-project',
  encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone     : true,
    imports        : [TranslocoModule,AsyncPipe,CommonModule, MatIconModule, MatButtonModule, MatRippleModule, MatMenuModule, MatTabsModule, MatButtonToggleModule, NgApexchartsModule, NgFor, NgIf, MatTableModule, NgClass, CurrencyPipe],

  templateUrl: './details-project.component.html',
  styleUrl: './details-project.component.scss'
})
export class DetailsProjectComponent {
  chartGithubIssues: ApexOptions = {};
    chartTaskDistribution: ApexOptions = {};
    chartBudgetDistribution: ApexOptions = {};
    chartWeeklyExpenses: ApexOptions = {};
    chartMonthlyExpenses: ApexOptions = {};
    chartYearlyExpenses: ApexOptions = {};
    data: any;
   // selectedProject: string;
   projects$: Observable<{ projects: InventoryProject[] }>;
    selectedProject: InventoryProject | null = null;
    selectedProjectName: string | null = null;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    currentProject:any
    /**
     * Constructor
     */
  
    constructor(
        private _projectService: DetailsProjectService,
        private _router: Router,
         private cd: ChangeDetectorRef,
         private userService: UserService
    )
    { // this.projects$ = this._projectService.getProjects();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------
    currentUser:any
    /**
     * On init
     */
    ngOnInit(): void

    {
      this.projects$ = this._projectService.getProjects();
      // Subscribe to projects$ observable to get the first project and set it as selected
      this.projects$.subscribe(data => {
        const projects = data.projects; // Access the projects array from the data object
        if (projects && projects.length > 0) {
          this.selectedProjectName = projects[0].name;
          this.selectedProject = projects[0];
          console.log("Selected Project:", this.selectedProject);
          this.cd.detectChanges(); // Trigger change detection manually
        }
      });
      this.userService.get().subscribe(
        user => {
          // this.getUserData(user);
          this.currentUser = user;
        //  this.ctx = user;
          // Ensure currentUser is defined before calling fetchImage
        //   if (this.currentUser) {
        //     this.imageUrl = 'hello'
        //     // this.fetchImage(this.currentUser.image);
        //   }
          // Fetch user data after currentUser is set
        },
        error => {
          console.error('Error fetching current user:', error);
        }
      );
      //  Get the data
        // this._projectService.getProjects
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe((data) =>
        //     {
        //        // Store the data
        //         this.data = data;

        //         //Prepare the chart data
        //         this._prepareChartData();
        //     });

        // Attach SVG fill fixer to all ApexCharts
        window['Apex'] = {
            chart: {
                events: {
                    mounted: (chart: any, options?: any): void =>
                    {
                        this._fixSvgFill(chart.el);
                    },
                    updated: (chart: any, options?: any): void =>
                    {
                        this._fixSvgFill(chart.el);
                    },
                },
            },
        };
    }

    // handleProjectSelection(projectName: string): void {
    //   console.log('Selected Project:', projectName); // Check if this log appears when you click
    //   this.selectedProjectName = projectName; // Update the selected project name
    //   // Optionally, you can update the selected project details as well
    //   // Assuming you have the project details available in the `projects$` observable
    //   this.projects$.subscribe(projects => {
    //     if (Array.isArray(projects)) {
    //       const selectedProject = projects.find(project => project.name === projectName);
    //       if (selectedProject) {
    //         this.selectedProject = selectedProject;
    //         console.log('aaaaaaaaaa',this.selectedProject)
    //         console.log('Selected Project Details:', this.selectedProject);
    //       }
    //     }
    //   });
    // }
    handleProjectSelection(projectName: string): void {
      this.selectedProjectName = projectName; // Update the selected project name
      console.log("Selected Project:", this.selectedProjectName);
  
      this.projects$.subscribe(data => {
        const projects = data.projects; // Access the projects array from the data object
        console.log('Projects:', projects); // Log the projects to see what is being returned
        const selectedProject = projects.find(project => project.name === projectName);
        console.log('Selected Project:', selectedProject); // Log the selected project to see if it matches
        if (selectedProject) {
          this.selectedProject = selectedProject;
          console.log('Selected Project Details:', this.selectedProject);
          this.cd.detectChanges(); // Trigger change detection manually
        }
      });
    }
    
   
    // fetchSelectedProject(projectId: string) {
    //   this._projectService.getProjectsByIds(projectId).subscribe(
    //     (project) => {
    //       this.selectedProject = project;
    //       console.log('Fetched selected project:', this.selectedProject);
    //     },
    //     (error) => {
    //       console.error('Error fetching selected project:', error);
    //     }
    //   );
    // }
  
    // fetchProjectDetails(projectId: string): void {
    //   this._projectService.getProjectsByIds(projectId).subscribe(project => {
    //     this.selectedProject = project;
    //   });
    // }
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

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Fix the SVG fill references. This fix must be applied to all ApexCharts
     * charts in order to fix 'black color on gradient fills on certain browsers'
     * issue caused by the '<base>' tag.
     *
     * Fix based on https://gist.github.com/Kamshak/c84cdc175209d1a30f711abd6a81d472
     *
     * @param element
     * @private
     */
    private _fixSvgFill(element: Element): void
    {
        // Current URL
        const currentURL = this._router.url;

        // 1. Find all elements with 'fill' attribute within the element
        // 2. Filter out the ones that doesn't have cross reference so we only left with the ones that use the 'url(#id)' syntax
        // 3. Insert the 'currentURL' at the front of the 'fill' attribute value
        Array.from(element.querySelectorAll('*[fill]'))
            .filter(el => el.getAttribute('fill').indexOf('url(') !== -1)
            .forEach((el) =>
            {
                const attrVal = el.getAttribute('fill');
                el.setAttribute('fill', `url(${currentURL}${attrVal.slice(attrVal.indexOf('#'))}`);
            });
    }

    /**
     * Prepare the chart data from the data
     *
     * @private
     */
    private _prepareChartData(): void
    {
        // Github issues
        this.chartGithubIssues = {
            chart      : {
                fontFamily: 'inherit',
                foreColor : 'inherit',
                height    : '100%',
                type      : 'line',
                toolbar   : {
                    show: false,
                },
                zoom      : {
                    enabled: false,
                },
            },
            colors     : ['#64748B', '#94A3B8'],
            dataLabels : {
                enabled        : true,
                enabledOnSeries: [0],
                background     : {
                    borderWidth: 0,
                },
            },
            grid       : {
                borderColor: 'var(--fuse-border)',
            },
            labels     : this.data.githubIssues.labels,
            legend     : {
                show: false,
            },
            plotOptions: {
                bar: {
                    columnWidth: '50%',
                },
            },
            series     : this.data.githubIssues.series,
            states     : {
                hover: {
                    filter: {
                        type : 'darken',
                        value: 0.75,
                    },
                },
            },
            stroke     : {
                width: [3, 0],
            },
            tooltip    : {
                followCursor: true,
                theme       : 'dark',
            },
            xaxis      : {
                axisBorder: {
                    show: false,
                },
                axisTicks : {
                    color: 'var(--fuse-border)',
                },
                labels    : {
                    style: {
                        colors: 'var(--fuse-text-secondary)',
                    },
                },
                tooltip   : {
                    enabled: false,
                },
            },
            yaxis      : {
                labels: {
                    offsetX: -16,
                    style  : {
                        colors: 'var(--fuse-text-secondary)',
                    },
                },
            },
        };

        // Task distribution
        this.chartTaskDistribution = {
            chart      : {
                fontFamily: 'inherit',
                foreColor : 'inherit',
                height    : '100%',
                type      : 'polarArea',
                toolbar   : {
                    show: false,
                },
                zoom      : {
                    enabled: false,
                },
            },
            labels     : this.data.taskDistribution.labels,
            legend     : {
                position: 'bottom',
            },
            plotOptions: {
                polarArea: {
                    spokes: {
                        connectorColors: 'var(--fuse-border)',
                    },
                    rings : {
                        strokeColor: 'var(--fuse-border)',
                    },
                },
            },
            series     : this.data.taskDistribution.series,
            states     : {
                hover: {
                    filter: {
                        type : 'darken',
                        value: 0.75,
                    },
                },
            },
            stroke     : {
                width: 2,
            },
            theme      : {
                monochrome: {
                    enabled       : true,
                    color         : '#93C5FD',
                    shadeIntensity: 0.75,
                    shadeTo       : 'dark',
                },
            },
            tooltip    : {
                followCursor: true,
                theme       : 'dark',
            },
            yaxis      : {
                labels: {
                    style: {
                        colors: 'var(--fuse-text-secondary)',
                    },
                },
            },
        };

        // Budget distribution
        this.chartBudgetDistribution = {
            chart      : {
                fontFamily: 'inherit',
                foreColor : 'inherit',
                height    : '100%',
                type      : 'radar',
                sparkline : {
                    enabled: true,
                },
            },
            colors     : ['#818CF8'],
            dataLabels : {
                enabled   : true,
                formatter : (val: number): string | number => `${val}%`,
                textAnchor: 'start',
                style     : {
                    fontSize  : '13px',
                    fontWeight: 500,
                },
                background: {
                    borderWidth: 0,
                    padding    : 4,
                },
                offsetY   : -15,
            },
            markers    : {
                strokeColors: '#818CF8',
                strokeWidth : 4,
            },
            plotOptions: {
                radar: {
                    polygons: {
                        strokeColors   : 'var(--fuse-border)',
                        connectorColors: 'var(--fuse-border)',
                    },
                },
            },
            series     : this.data.budgetDistribution.series,
            stroke     : {
                width: 2,
            },
            tooltip    : {
                theme: 'dark',
                y    : {
                    formatter: (val: number): string => `${val}%`,
                },
            },
            xaxis      : {
                labels    : {
                    show : true,
                    style: {
                        fontSize  : '12px',
                        fontWeight: '500',
                    },
                },
                categories: this.data.budgetDistribution.categories,
            },
            yaxis      : {
                max       : (max: number): number => parseInt((max + 10).toFixed(0), 10),
                tickAmount: 7,
            },
        };

        // Weekly expenses
        this.chartWeeklyExpenses = {
            chart  : {
                animations: {
                    enabled: false,
                },
                fontFamily: 'inherit',
                foreColor : 'inherit',
                height    : '100%',
                type      : 'line',
                sparkline : {
                    enabled: true,
                },
            },
            colors : ['#22D3EE'],
            series : this.data.weeklyExpenses.series,
            stroke : {
                curve: 'smooth',
            },
            tooltip: {
                theme: 'dark',
            },
            xaxis  : {
                type      : 'category',
                categories: this.data.weeklyExpenses.labels,
            },
            yaxis  : {
                labels: {
                    formatter: (val): string => `$${val}`,
                },
            },
        };

        // Monthly expenses
        this.chartMonthlyExpenses = {
            chart  : {
                animations: {
                    enabled: false,
                },
                fontFamily: 'inherit',
                foreColor : 'inherit',
                height    : '100%',
                type      : 'line',
                sparkline : {
                    enabled: true,
                },
            },
            colors : ['#4ADE80'],
            series : this.data.monthlyExpenses.series,
            stroke : {
                curve: 'smooth',
            },
            tooltip: {
                theme: 'dark',
            },
            xaxis  : {
                type      : 'category',
                categories: this.data.monthlyExpenses.labels,
            },
            yaxis  : {
                labels: {
                    formatter: (val): string => `$${val}`,
                },
            },
        };

        // Yearly expenses
        this.chartYearlyExpenses = {
            chart  : {
                animations: {
                    enabled: false,
                },
                fontFamily: 'inherit',
                foreColor : 'inherit',
                height    : '100%',
                type      : 'line',
                sparkline : {
                    enabled: true,
                },
            },
            colors : ['#FB7185'],
            series : this.data.yearlyExpenses.series,
            stroke : {
                curve: 'smooth',
            },
            tooltip: {
                theme: 'dark',
            },
            xaxis  : {
                type      : 'category',
                categories: this.data.yearlyExpenses.labels,
            },
            yaxis  : {
                labels: {
                    formatter: (val): string => `$${val}`,
                },
            },
        };
    }
}
