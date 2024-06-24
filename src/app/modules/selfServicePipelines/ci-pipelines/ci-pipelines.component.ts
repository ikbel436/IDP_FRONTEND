import { CommonModule } from '@angular/common';
import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Subject, takeUntil } from 'rxjs';
import { SettingsAccountComponent } from 'app/modules/user/settings/account/account.component'; // change this 
import { SettingsNotificationsComponent } from 'app/modules/user/settings/notifications/notifications.component';
import { BuildPushImageComponent } from '../build-push-image/build-push-image.component'; // change this 2 
@Component({
  selector: 'app-ci-pipelines',
  standalone: true,
  imports: [CommonModule, MatSidenavModule, MatButtonModule, MatIconModule, MatProgressBarModule],
  templateUrl: './ci-pipelines.component.html',
  styleUrls: ['./ci-pipelines.component.scss']
})
export class CIPipelinesComponent implements OnInit, OnDestroy {
  drawerMode: 'over' | 'side' = 'side';
  drawerOpened: boolean = true;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef }) dynamicComponentContainer: ViewContainerRef;

  constructor(private _fuseMediaWatcherService: FuseMediaWatcherService, private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit(): void {
    this._fuseMediaWatcherService.onMediaChange$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(({ matchingAliases }) => {
        if (matchingAliases.includes('lg')) {
          this.drawerMode = 'side';
          this.drawerOpened = true;
        } else {
          this.drawerMode = 'over';
          this.drawerOpened = false;
        }
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  showContent(content: string): void {
    this.dynamicComponentContainer.clear();
    let componentFactory;

    if (content === 'buildPush') {
      componentFactory = this.componentFactoryResolver.resolveComponentFactory(BuildPushImageComponent); // change your component here 
    } else if (content === 'deploy') {
      componentFactory = this.componentFactoryResolver.resolveComponentFactory(SettingsNotificationsComponent); // change the component here 
    }

    this.dynamicComponentContainer.createComponent(componentFactory);
  }
}
