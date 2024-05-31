import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Observable, Subject, takeUntil } from 'rxjs';
import { SettingsAccountComponent } from './account/account.component';
import { SettingsNotificationsComponent } from './notifications/notifications.component';
import { SettingsPlanBillingComponent } from './plan-billing/plan-billing.component';
import { SettingsSecurityComponent } from './security/security.component';
import { SettingsTeamComponent } from './team/team.component';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { LanguagesComponent } from 'app/layout/common/languages/languages.component';
// import { DarkModeComponent } from 'app/layout/common/darkmode/darkmode/darkmode.component';
import { UserComponent } from 'app/layout/common/user/user.component';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
// import { GoalsComponent } from 'app/modules/profiling/goals/goals.component';

@Component({
  selector: 'settings',
  templateUrl: './settings.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    SettingsAccountComponent,
    SettingsSecurityComponent,
    SettingsPlanBillingComponent,
    SettingsNotificationsComponent,
    SettingsTeamComponent,
    LanguagesComponent,
    // DarkModeComponent,
    UserComponent,
    RouterModule,
    TranslocoModule,
    // GoalsComponent
  ],
})
export class SettingsComponent implements OnInit, OnDestroy {
  @ViewChild('drawer') drawer: MatDrawer;
  drawerMode: 'over' | 'side' = 'side';
  drawerOpened: boolean = true;
  panels: any[] = [];
  /* 
    Here we are using the ActivatedRoute to get the current route and set the selectedPanel to the current route.
    This is a good practice to keep the selected panel in sync with the current route.
    firstChild is used to get the first child route of the current route. in our case /account or /security or /plan-billing ...
    routeConfig is used to get the route configuration of the current route. 
    path is used to get the path of the current route.
  */
  selectedPanel: string = this._ActivatedRoute.snapshot.firstChild?.routeConfig?.path || 'account';
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  /**
   * Constructor
   */
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
    private _router: Router,
    private _ActivatedRoute: ActivatedRoute,
    private _translocoService: TranslocoService
  ) { }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Setup available panels
    this.panels = [
      {
        id: 'account',
        icon: 'heroicons_outline:user-circle',
      },
      {
        id: 'security',
        icon: 'heroicons_outline:lock-closed',
      },
      {
        id: 'plan-billing',
        icon: 'heroicons_outline:credit-card',
      },
      {
        id: 'notifications',
        icon: 'heroicons_outline:bell',
      },
      {
        id: 'team',
        icon: 'heroicons_outline:user-group',
      },
    ];

    // Subscribe to media changes
    this._fuseMediaWatcherService.onMediaChange$.pipe(takeUntil(this._unsubscribeAll)).subscribe(({ matchingAliases }) => {
      // Set the drawerMode and drawerOpened
      if (matchingAliases.includes('lg')) {
        this.drawerMode = 'side';
        this.drawerOpened = true;
      } else {
        this.drawerMode = 'over';
        this.drawerOpened = false;
      }

      // Mark for check
      this._changeDetectorRef.markForCheck();
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

  /**
   * Navigate to the panel
   *
   * @param panel
   */
  goToPanel(panel: string): void {
    this.selectedPanel = panel;
    this._router.navigate([`/settings/${panel}`]);
    // Close the drawer on 'over' mode
    if (this.drawerMode === 'over') {
      this.drawer.close();
    }
  }

  /**
   * Get the details of the panel
   *
   * @param id
   */
  getPanelInfo(id: string): any {
    return this.panels.find((panel) => panel.id === id);
  }

  getPanelTitle(id: string): Observable<string> {
    return this._translocoService.selectTranslate(`settings.panels.${id}.title`);
  }

  isDarkModeEnabled(): boolean {
    return localStorage.getItem('scheme') === 'dark';
  }

  /**
   * Track by function for ngFor loops
   *
   * @param index
   * @param item
   */
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
}
