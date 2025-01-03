import { BooleanInput } from '@angular/cdk/coercion';
import { NgClass, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { UserService } from 'app/core/user/user.service';
import { AuthService } from 'app/core/auth/auth.service';
import { User } from 'app/core/user/user.types';
import { Subject, takeUntil } from 'rxjs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
    selector: 'user',
    templateUrl: './user.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: 'user',
    standalone: true,
    imports: [MatButtonModule, MatMenuModule, NgIf, MatIconModule, NgClass, MatDividerModule],
})
export class UserComponent implements OnInit, OnDestroy {
    @Input() showAvatar: boolean = true;
    user: User;
    currentUser: any;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    isLoaded: boolean = false;

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _userService: UserService,
        private _sanitizer: DomSanitizer,
        private _authService: AuthService // Inject DomSanitizer
    ) { }

    ngOnInit(): void {
        this._userService.get().subscribe(
            (user: User) => {
                this.currentUser = user;

                this.isLoaded = true
            },
            (error) => {
                console.error('Error fetching current user:', error);
            }
        );
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    updateStatus1(status: string): void {
        this._userService.updateUserStatus(status).subscribe(
            (response) => {
                //console.log('User status updated successfully:', response);
                this.currentUser.status = status;
                window.location.reload();
            },
            (error) => {
                console.error('Error updating user status:', error);
            }
        );
    }
    goToProfile() {
        this._router.navigate(['/profile']);
    }
    goToSettings() {
        this._router.navigate(['/settings/account']);
    }

    signOut(): void {
        this._authService.signOut().subscribe({
            next: () => {
                // Redirect to the login page or any other action
                this._router.navigate(['/sign-out']);
            },
            error: (err) => {
                console.error('Sign out failed', err);
            }
        });
    }
}
