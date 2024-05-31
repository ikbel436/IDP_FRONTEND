import { NgIf } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
  UntypedFormBuilder,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterLink } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { FuseValidators } from '@fuse/validators';
import { AuthService } from 'app/core/auth/auth.service';
import { PasswordStrengthMeterComponent } from 'angular-password-strength-meter';
import { Country } from 'app/models/country.types';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { CountryService } from 'app/services/country.service';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LanguagesComponent } from 'app/layout/common/languages/languages.component';
@Component({
  selector: 'auth-sign-up',
  templateUrl: './sign-up.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
  standalone: true,

  imports: [
    RouterLink,
    MatSelectModule,
    // PasswordStrengthMeterComponent,
    NgIf,
    FuseAlertComponent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    MatProgressSpinnerModule,
    TranslocoModule,
    LanguagesComponent,
  ],
})
export class AuthSignUpComponent implements OnInit {
  // -----------------------------------------------------------------------------------------------------
  // @ ViewChild
  // -----------------------------------------------------------------------------------------------------

  @ViewChild('countrySelect') countrySelect: MatSelect;
  // -----------------------------------------------------------------------------------------------------
  // @ Public properties
  // -----------------------------------------------------------------------------------------------------

  signUpForm: FormGroup;
  showAlert: boolean = false;
  selectedCountry: Country;
  countries: Country[];
  signUpNgForm: NgForm;

  destroyRef = inject(DestroyRef);
  /**
   * Constructor
   */

  constructor(
    private _authService: AuthService,
    private _formBuilder: UntypedFormBuilder,
    private _countryService: CountryService,
    private _router: Router,
    private _translocoService: TranslocoService
  ) { }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this._countryService
      .getCountries()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((countries) => {
        this.countries = countries;
        this.selectedCountry = this.getCountryByIso('tn');
      });

    // Create the form
    this.signUpForm = this._formBuilder.group(
      {
        name: ['', Validators.required],
        // lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phoneNumber: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(15), Validators.pattern('^[0-9]*$')]],
        countryCode: ['tn'],
        password: ['', [Validators.required]],
        passwordConfirm: ['', Validators.required],
        agreements: ['', Validators.requiredTrue],
        recaptchaReactive: new FormControl(null, Validators.required),
      },
      {
        validators: FuseValidators.mustMatch('password', 'passwordConfirm'),
      }
    );
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  get ActiveLang() {
    return this._translocoService.getActiveLang();
  }

  getCountryByIso(iso: string): Country {
    if (iso) {
      return this.countries.find((country) => country.iso === iso);
    }
  }
  isDarkModeEnabled(): boolean {
    return localStorage.getItem('theme') === 'dark';
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  // custom password strength meter
  // the password is considered valid if the strength is 4
  passwordStrength = 0;
  onStrengthChange(strength: number): void {
    this.passwordStrength = strength;
    this.signUpForm.get('password').updateValueAndValidity();
  }
  passwordStrengthValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (this.passwordStrength < 4) {
        return { passwordStrength: 'Password is not strong enough' };
      }
      return null;
    };
  }

  /**
   * Sign up
   */
  signUp(): void {
    // Do nothing if the form is invalid
    if (this.signUpForm.invalid) {
      return;
    }
    // Disable the form
    this.signUpForm.disable();
    const payloadForKeycloak = {
      name: this.signUpForm.value.name,
      email: this.signUpForm.value.email.toLowerCase(),
      password: this.signUpForm.value.passwordConfirm,
      role: ['User'],
    };

    const payLoadForDatabase = {
      ...payloadForKeycloak,
      phone: {
        countryCode: this.getCountryByIso(this.signUpForm.value.countryCode).code,
        phoneNumber: this.signUpForm.value.phoneNumber,
      },
      agreements: this.signUpForm.value.agreements,
    };
    // Sign up
    this._authService.signUp(this.signUpForm.value).subscribe({
      complete: () => {
        this._router.navigate(['/confirmation-required']);
      },
      error: () => {
        // Re-enable the form
        this.signUpForm.enable();
        // Reset the form
        this.signUpForm.controls.password.setValue('');
        this.signUpForm.controls.passwordConfirm.setValue('');
        this.signUpForm.controls.recaptchaReactive.setValue(null);
        this.signUpForm.controls.email.setValue('');
      },
    });
  }

  resolved(captchaResponse: string) {
    // console.log(`Resolved captcha with response: ${captchaResponse}`);
  }

  onOpenedChange(opened: boolean) {
    if (opened) {
      this.countrySelect.focus();
    }
  }

  onCountryChange(event: any): void {
    this.selectedCountry = this.getCountryByIso(event.value);
  }

  navigateToHome(): void {
    this._router.navigate(['/home']); // '/home' est l'URL de votre page d'accueil
  }
}
