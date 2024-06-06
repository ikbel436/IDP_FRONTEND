import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { Country } from 'app/models/country.types';
import { CountryService } from 'app/services/country.service';
import { DateTime } from 'luxon';
import { concatMap, Observable, of, switchMap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ToastService } from 'app/services/toast.service';
import { ImageCropperComponent } from 'ngx-image-cropper';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'app/core/auth/auth.service';
@Component({
  selector: 'settings-account',
  templateUrl: './account.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    TextFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    TranslocoModule,
    MatDatepickerModule,
    MatProgressSpinnerModule,
  ],
})
export class SettingsAccountComponent implements OnInit {
  // -----------------------------------------------------------------------------------------------------
  // @ ViewChild
  // -----------------------------------------------------------------------------------------------------
  @ViewChild('countrySelect') countrySelect: MatSelect;

  // -----------------------------------------------------------------------------------------------------
  // @ Public fields
  // -----------------------------------------------------------------------------------------------------
  accountForm: FormGroup;
  selectedCountry: Country;
  countries: Country[];
  user: User;
  uploadedImage: File | undefined;
  // uploadedImage: Blob | File;
  form: FormGroup;
  emailUpdated = false;
  imagePreviewUrl: string | ArrayBuffer | null = '';
  // -----------------------------------------------------------------------------------------------------
  // @ Observables
  // -----------------------------------------------------------------------------------------------------
  $countries: Observable<Country[]>;
  user$: Observable<User>;

  /**
   * Constructor
   */

  private destroyRef = inject(DestroyRef);
  constructor(
    private _formBuilder: FormBuilder,
    private _userService: UserService,
    private _countryService: CountryService,
    private _cd: ChangeDetectorRef,
    private _translocoService: TranslocoService,
    private _toastService: ToastService,
    private _fuseConfirmationService: FuseConfirmationService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _authService: AuthService
  ) {
    this.form = this._formBuilder.group({
      phoneNumber: ['', [Validators.required]]
    });

    this.accountForm = this._formBuilder.group({
      name: [''],
      birthDate: ['', [this.validateBirthdate]],
      city: [''],
      description: [''],

      email: ['', [Validators.email, Validators.required]],
      phoneNumber: [
        '',
        [
          Validators.minLength(7),
          Validators.maxLength(15),
          Validators.pattern('^[0-9]*$'),
        ],
      ],
      countryCode: [''],
      country: [''],
      codePostal: [''],

    });
  }
  validateBirthdate(control: AbstractControl): ValidationErrors | null {
    const birthDate = new Date(control.value);
    const currentDate = new Date();
    const age = currentDate.getFullYear() - birthDate.getFullYear();
    const monthDifference = currentDate.getMonth() - birthDate.getMonth();
    const dayDifference = currentDate.getDate() - birthDate.getDate();

    if (
      age < 18 ||
      (age === 18 && (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)))
    ) {
      return { invalidAge: true };
    }

    return null;
  }
  private _showInvalidBirthdateMessage(): void {
    this._snackBar.open('L\'âge doit être de 18 ans ou plus', 'Close', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------
  private toastShownForUpdate = false;
  ngOnInit(): void {
    // Create the form

    // Reset the toast flag when the component initializes
    this.toastShownForUpdate = false;
    this.user$ = this._userService.user$;
    console.log("User fffff:", this.user$);

    this.user$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap((user) => {
          console.log("user", user);

          this.user = user;
          this.accountForm.patchValue({
            name: user.name ? user.name : '',
            birthDate: user.birthDate ? user.birthDate : '',
            city: user.city ? user.city : '',
            description: user.description ? user.description : '',
            email: user.email ? user.email : '',
            phoneNumber: user.phoneNumber ? user.phoneNumber : '',
            countryCode: user.countryCode ? user.countryCode : '',
            country: user.country ? user.country : '',
            codePostal: user.codePostal ? user.codePostal : '',

          });
          return this._countryService.getCountries();
        })
      )
      .subscribe((countries) => {
        this.countries = countries;
        if (this.user.phoneNumber) {
          this.selectedCountry = this.getCountryByCode(
            this.user.countryCode
          );
        } else {
          this.selectedCountry = this.getCountryByCode('+216');
        }

        this._cd.markForCheck();
      });
    this.accountForm.get('countryCode').valueChanges.subscribe(() => this.updateFullPhoneNumber());
    this.accountForm.get('phoneNumber').valueChanges.subscribe(() => this.updateFullPhoneNumber());
  }
  updateFullPhoneNumber() {
    const countryCode = this.accountForm.get('countryCode').value || '';
    const phoneNumber = this.accountForm.get('phoneNumber').value || '';
    const fullPhoneNumber = `${countryCode}${phoneNumber}`;
    this.user.phoneNumber = fullPhoneNumber;
    //console.log('Full phone number:', fullPhoneNumber);

  }
  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  getCountryByCode(code: string): Country {
    if (code) {
      return this.countries.find((country) => country.code === code);
    }
  }

  get ActiveLang() {
    return this._translocoService.getActiveLang();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  onOpenedChange(opened: boolean) {
    if (opened) {
      this.countrySelect.focus();
    }
  }

  onCountryChange(event: any): void {
    this.selectedCountry = this.getCountryByCode(event.value);
  }

  /**
   * Save the user data
   */
  save() {
    if (this.accountForm.invalid) {
      this._snackBar.open('Please correct the errors in the form before submitting.', 'Close', {
        duration: 5000,
      });
      return;
    }
    this.accountForm.disable();
    const formValue = this.accountForm.value;
    const updatedUserInfo = {
      ...this.user,
      name: formValue.name,
      birthDate: DateTime.fromISO(formValue.birthDate).toFormat('yyyy-MM-dd'),
      city: formValue.city,
      description: formValue.description,
      email: formValue.email,
      phoneNumber: formValue.phoneNumber,
      countryCode: formValue.countryCode,
      country: formValue.country,
      codePostal: formValue.codePostal,
      image: this.user.image,

    };


    this._userService
      .update(updatedUserInfo)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        concatMap(() => {
          this.accountForm.enable();
          return this._userService.user$;
        })
      )
      .subscribe({
        next: (user) => {
          this.accountForm.enable();
          // Show the toast only if it hasn't been shown for this update session
          if (!this.toastShownForUpdate) {
            this._toastService.createSuccessToast(
              this._translocoService.translate('confirmationDialog.titles.account'),
              'updateSuccess'
            );
            this.toastShownForUpdate = true;
          }



          // Patch the form with updated user data
          this.patchFormWithUserData(user);

          // Manually trigger change detection
          // this._cd.detectChanges();
          //  this.patchFormWithUserData(user);
          if (this.user.email !== updatedUserInfo.email) {
            this.emailUpdated = true;
            //  user.emailVerified = false;
          }
          user.name = updatedUserInfo.name;
          user.birthDate = updatedUserInfo.birthDate;
          user.city = updatedUserInfo.city;
          user.description = updatedUserInfo.description;
          user.email = updatedUserInfo.email;
          user.phoneNumber = updatedUserInfo.phoneNumber
          user.country = updatedUserInfo.country
          user.codePostal = updatedUserInfo.codePostal
          user.image = updatedUserInfo.image
          user.createdAt = updatedUserInfo.createdAt
          user.countryCode = updatedUserInfo.countryCode
          this._cd.detectChanges();

          this.patchFormWithUserData(this.user);
          console.log("Updated user data:", user);
        },


        error: () => {
          this.accountForm.enable();
        },
      });
  }
  patchFormWithUserData(user: User) {
    this.accountForm.patchValue({
      name: user.name,
      description: user.description,
      email: user.email,
      phoneNumber: user.phoneNumber,
      countryCode: user.phoneNumber,
      birthDate: user.birthDate,
      codePostal: user.codePostal,
      country: user.country,
      city: user.city,

    });
    this._cd.detectChanges();
  }
  updateUserData(user: User, payload: any) {
    if (this.user.email !== payload.email) {
      this.emailUpdated = true;
    }
    this.user = {
      ...user,
      ...payload
    };
  }


  images: string;
  triggerFileInput() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }
  remove() {
    const profilePicTranslation = this._translocoService.translate('settings.account.profilePic.title');
    const dialogRef = this._fuseConfirmationService.open({
      title: this._translocoService.translate('buttons.remove') + ' ' + profilePicTranslation,
      message: this._translocoService.translate('confirmationDialog.deleteProfilePicture', {
        title: profilePicTranslation,
      }),
      icon: {
        show: true,
        name: 'heroicons_outline:exclamation-triangle',
        color: 'warn',
      },
      actions: {
        confirm: {
          label: this._translocoService.translate('buttons.confirm'),
          color: 'warn',
        },
        cancel: {
          show: true,
          label: this._translocoService.translate('buttons.cancel'),
        },
      },
      dismissible: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirmed') {
        this._userService.removeImage().subscribe({
          next: (res) => {
            this.imagePreviewUrl = '';
            this.uploadedImage = undefined;
            this.user.image = '';
            // Show the toast only if it hasn't been shown for this update session
            if (!this.toastShownForUpdate) {
              this._toastService.createSuccessToast(
                this._translocoService.translate('confirmationDialog.titles.account'),
                'updateSuccess'
              );
              this.toastShownForUpdate = true;
            };
            this._cd.markForCheck();
          },
          error: (err) => {
            this._toastService.createErrorToast(
              this._translocoService.translate('errorDialog.titles.removeFailed'),
              'removeError'
            );
          }
        });
      }
    });
  }



  selectImage(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.uploadedImage = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviewUrl = reader.result;

        this.uploadImage();
      };
      reader.readAsDataURL(file);
    }
  }
  uploadImage() {
    if (!this.uploadedImage) {
      console.log("error")
      return;
    }

    this._userService.uploadImage(this.uploadedImage).subscribe({
      next: (res) => {
        this._userService.user$.subscribe((user) => {
          user.image = res.url;
          // Show the toast only if it hasn't been shown for this update session
          if (!this.toastShownForUpdate) {
            this._toastService.createSuccessToast(
              this._translocoService.translate('confirmationDialog.titles.account'),
              'updateSuccess'
            );
            this.toastShownForUpdate = true;
          }
          this._cd.markForCheck();
          this._cd.detectChanges();
        });
      },
      error: (err) => {
        this._toastService.createErrorToast(
          this._translocoService.translate('errorDialog.titles.uploadFailed'),
          'uploadError'
        );
      }
    });
  }

  validatePhoneNumber(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
  }

  preventNonNumeric(event: KeyboardEvent): void {
    if (event.key && !/[0-9]/.test(event.key)) {
      event.preventDefault();
    }
  }




}
