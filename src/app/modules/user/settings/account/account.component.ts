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
    uploadedImage: File | Blob;
    form: FormGroup;
    emailUpdated = false;

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
    ) {}

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
            about: [''],
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
                        description: user.description ? user.description : '',
                        email: user.email ? user.email : '',
                        phoneNumber: user.phoneNumber ? user.phoneNumber : '',
                        countryCode: user.phoneNumber ? user.phoneNumber : '',
                        birthDate: user.birthDate ? user.birthDate : '',
                        codePostal: user.codePostal ? user.codePostal : '',
                        country: user.country ? user.country : '',
                        city: user.city ? user.city : '',
                        
                        
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
            email: formValue.email.toLowerCase(),
            name: formValue.name,
            phoneNumber: formValue.phoneNumber,
            birthDate: DateTime.fromISO(formValue.birthDate).toFormat('yyyy-MM-dd'),
            country: formValue.country,
            descrption : formValue.description,
            city : formValue.city,
            codePostal : formValue.codePostal,


           
        };

        this._userService
            .update(payload)
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                concatMap((res) => {
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
                    if (this.user.email !== payload.email) {
                        this.emailUpdated = true;
                        // user.emailVerified = false;
                    }
                    // user.additionalInformation = payload.additionalInformation;
                    user.email = payload.email;
                    user.name = payload.name;
                    user.phoneNumber = payload.phoneNumber;
                },
                error: () => {
                    this.accountForm.enable();
                },
            });
    }

    // openDialog() {
    //   const dialogRef = this.dialog.open(ImageCropperComponent);

    //   dialogRef.afterClosed().subscribe((result) => {
    //     if (result !== undefined) {
    //       this.uploadedImage = result;
    //       const reader = new FileReader();
    //       reader.onloadend = () => {};
    //       if (this.uploadedImage instanceof Blob && this.uploadedImage) {
    //         reader.readAsDataURL(this.uploadedImage);
    //       }

    //       this._userService.uploadImage(this.uploadedImage).subscribe({
    //         next: (res) => {
    //           this._userService.user$.subscribe((user) => {
    //             user.avatar = res.url;
    //             this._toastService.createSuccessToast(
    //               this._translocoService.translate('confirmationDialog.titles.profilePicture'),
    //               'addSuccess'
    //             );
    //             this._cd.markForCheck();
    //             this._cd.detectChanges();
    //           });
    //         },
    //       });
    //     }
    //   });
    // }

    remove() {
        const profilePicTranslation = this._translocoService.translate(
            'settings.account.profilePic.title'
        );
        const dialogRef = this._fuseConfirmationService.open({
            title:
                this._translocoService.translate('buttons.remove') +
                ' ' +
                profilePicTranslation,
            message: this._translocoService.translate(
                'confirmationDialog.deleteProfilePicture',
                {
                    title: profilePicTranslation,
                }
            ),
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
        // dialogRef.afterClosed().subscribe((result) => {
        //   if (result === 'confirmed') {
        //     // we need to decode the blob name to remove it
        //     // example: https://talent.blob.core.windows.net/images/encodedBlobName
        //     let parts = this.user.profilePicture.split('/');
        //     let encodedBlobName = parts[parts.length - 1];
        //     let blobName = decodeURIComponent(encodedBlobName);
        //     this._userService
        //       .removeAvatar(blobName)
        //       .pipe(
        //         concatMap(() => {
        //           return this._userService.user$;
        //         })
        //       )
        //       .subscribe({
        //         next: (user) => {
        //           user.profilePicture = null;
        //           this._toastService.createSuccessToast(
        //             this._translocoService.translate('confirmationDialog.titles.profilePicture'),
        //             'deleteSuccess'
        //           );
        //           this._cd.markForCheck();
        //         },
        //       });
        //   }
        // });
    }
}
