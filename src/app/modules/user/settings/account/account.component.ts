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
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
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
import { concatMap, Observable, switchMap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ToastService } from 'app/services/toast.service';
import { ImageCropperComponent } from 'ngx-image-cropper';

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
    public dialog: MatDialog
  ) {
    this.form = this._formBuilder.group({
      phoneNumber: ['', [Validators.required]]
    });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Create the form
    this.accountForm = this._formBuilder.group({
      name: [''],
      birthDate: [''],
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
      // gender: [''],
    });

    this.user$ = this._userService.user$;

    this.user$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap((user) => {
          this.user = user;
          this.accountForm.patchValue({
            name: user.name ? user.name : '',
            birthDate: user.birthDate ? user.birthDate : '',
            city: user.city ? user.city : '',
            description: user.description ? user.description : '',
            email: user.email ? user.email : '',
            phoneNumber: user.phoneNumber ? user.phoneNumber : '',
            countryCode: user.phoneNumber ? user.phoneNumber : '',
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
            this.user.phoneNumber
          );
        } else {
          this.selectedCountry = this.getCountryByCode('+216');
        }

        this._cd.markForCheck();
      });
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
    this.accountForm.disable();
    const formValue = this.accountForm.value;
    const payload = {
      ...this.user,
      name: formValue.name,
      birthDate: DateTime.fromISO(formValue.birthDate).toFormat('yyyy-MM-dd'),
      city: formValue.city,
      description: formValue.description,
      email: formValue.email,
      phoneNumber: formValue.phoneNumber,
      countryCode: formValue.phoneNumber,
      country: formValue.country,
      codePostal: formValue.codePostal,
      image: this.user.image,

    };


    this._userService
      .update(payload)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        concatMap(() => {
          this.accountForm.enable();
          return this._userService.user$;
        })
      )
      .subscribe({
        next: (user) => {
          this._toastService.createSuccessToast(
            this._translocoService.translate(
              'confirmationDialog.titles.account'
            ),
            'updateSuccess'
          );
          //  this.patchFormWithUserData(user); 
          if (this.user.email !== payload.email) {
            this.emailUpdated = true;
            //  user.emailVerified = false;
          }
          user.name = payload.name;
          user.birthDate = payload.birthDate;
          user.city = payload.city;
          user.description = payload.description;
          user.email = payload.email;
          user.phoneNumber = payload.phoneNumber
          user.country = payload.country
          user.codePostal = payload.codePostal
          user.image = payload.image
          user.createdAt = payload.createdAt


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
            this._toastService.createSuccessToast(
              this._translocoService.translate('confirmationDialog.titles.profilePictureRemoved'),
              'removeSuccess'
            );
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
          this._toastService.createSuccessToast(
            this._translocoService.translate('confirmationDialog.titles.profilePicture'),
            'addSuccess'
          );
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
