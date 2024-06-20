import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TranslocoModule } from '@ngneat/transloco';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { ToastService } from 'app/services/toast.service';
import { concatMap, switchMap } from 'rxjs';

@Component({
  selector: 'settings-notifications',
  templateUrl: './notifications.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatSlideToggleModule, MatButtonModule, TranslocoModule, MatCheckboxModule, MatRadioModule],
})
export class SettingsNotificationsComponent implements OnInit {
  // -----------------------------------------------------------------------------------------------------
  // @ Public properties
  // -----------------------------------------------------------------------------------------------------

  notificationsForm: UntypedFormGroup;

  user: User;

  /**
   * Constructor
   */

  private destroyRef = inject(DestroyRef);
  constructor(private _formBuilder: UntypedFormBuilder, private _userService: UserService, private _ToastService: ToastService) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Create the form
    this.notificationsForm = this._formBuilder.group({
      companyNews: [false],
      featuredProducts: [false],
      messages: [false],
      pushNotifications: [''],
    });

    // Get the user
    this._userService.user$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((user: User) => {
      this.user = user;
      // this.notificationsForm.patchValue(user.additionalInformation.notificationsAgreements);
    });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public Methods
  // -----------------------------------------------------------------------------------------------------

  save() {
    this.notificationsForm.disable();
    const payload = {
      ...this.user,
      // additionalInformation: {
      //   ...this.user.additionalInformation,
      //   notificationsAgreements: this.notificationsForm.value,
      // },
    };

    this._userService
      .update(payload)
      .pipe(
        concatMap((res) => {
          this.notificationsForm.enable();
          return this._userService.user$;
        })
      )
      .subscribe({
        next: (user) => {
          this._ToastService.createSuccessToast('updateSuccess');
          this._userService.user$.subscribe((user) => {
            // user.additionalInformation.notificationsAgreements = this.notificationsForm.value;
          });
        },
        error: (error) => {
          this.notificationsForm.enable();
          this._ToastService.createErrorToast('notifications', 'updating');
        },
      });
  }
}
