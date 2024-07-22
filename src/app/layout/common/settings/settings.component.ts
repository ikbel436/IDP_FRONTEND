import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { FuseDrawerComponent } from '@fuse/components/drawer';
import {
    FuseConfig,
    FuseConfigService,
    Scheme,
    Theme,
    Themes,
} from '@fuse/services/config';

import { Observable, Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'settings',
    templateUrl: './settings.component.html',
    styles: [
        `
            settings {
                position: static;
                display: block;
                flex: none;
                width: auto;
            }

            @media (screen and min-width: 1280px) {
                empty-layout + settings .settings-cog {
                    right: 0 !important;
                }
            }
        `,
    ],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        MatIconModule,
        FuseDrawerComponent,
        MatButtonModule,
        NgFor,
        NgClass,
        MatTooltipModule,
        CommonModule,
    ],
})
export class SettingsComponent implements OnInit, OnDestroy {
    config: FuseConfig;
    layout: string;
    scheme: 'dark' | 'light';
    theme: string;
    themes: Themes;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    
    /**
     * Constructor
     */
    constructor(
        private _router: Router,
        private _fuseConfigService: FuseConfigService,
        private http: HttpClient

    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Subscribe to config changes
        this._fuseConfigService.config$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((config: FuseConfig) => {
                // Store the config
                this.config = config;
            });
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

    /*
     These two methods are checking if the 
    user has projects and repositories stored in the local
    storage. 
   */

    loadRepositories(): Observable<any[]> {
        return this.http.get<any[]>('https://backend.idp.insparkconnect.com/Repos/get');
      }
      
    hasProjects(): boolean {
        return !!localStorage.getItem('myProjects');
    }

    hasRepos(): boolean {
        return !!localStorage.getItem('myRepos');
    }
    // Method to check if the user has repositories
   
      



   /**
    * The function `getStepRoute` takes a step ID as input and returns the corresponding route based on
    * a predefined mapping object.
    * @param {string} stepId - A string representing the ID of a step in a process.
    * @returns The `getStepRoute` function returns the route associated with the given `stepId`
    */
    getStepRoute(stepId: string): string {
        // Assuming you have a mapping object that maps step IDs to routes
        const stepRoutes = {
            'provider-setup': '/gitProvider',
            'service-setup': '/services',
            'deployment': '/deployment',
            'review': '/review',
            'confirmation': '/confirmation'
        };
    
        return stepRoutes[stepId];
    }

    /**
     * Set the layout on the config
     *
     * @param layout
     */
    setLayout(layout: string): void {
        // Clear the 'layout' query param to allow layout changes
        this._router
            .navigate([], {
                queryParams: {
                    layout: null,
                },
                queryParamsHandling: 'merge',
            })
            .then(() => {
                // Set the config
                this._fuseConfigService.config = { layout };
            });
    }

    /**
     * Set the scheme on the config
     *
     * @param scheme
     */
    setScheme(scheme: Scheme): void {
        this._fuseConfigService.config = { scheme };
    }

    /**
     * Set the theme on the config
     *
     * @param theme
     */
    setTheme(theme: Theme): void {
        this._fuseConfigService.config = { theme };
    }
}
