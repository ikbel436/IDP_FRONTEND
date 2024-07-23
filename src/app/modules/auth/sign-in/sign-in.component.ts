
import { NgIf } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { LanguagesComponent } from 'app/layout/common/languages/languages.component';
import { TranslocoModule } from '@ngneat/transloco';
import { User } from 'app/core/user/user.types';
import { MatSnackBar } from '@angular/material/snack-bar';
import { switchMap } from 'rxjs/operators';


@Component({
    selector: 'auth-sign-in',
    templateUrl: './sign-in.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    standalone: true,
    imports: [RouterLink, FuseAlertComponent, TranslocoModule, LanguagesComponent, NgIf, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatCheckboxModule, MatProgressSpinnerModule],
})
export class AuthSignInComponent implements OnInit {
    
    @ViewChild('signInNgForm') signInNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
      type: 'success',
      message: '',
    };
    signInForm: FormGroup;
    showAlert: boolean = false;
    loading: boolean = false;
  
    constructor(
      private _activatedRoute: ActivatedRoute,
      private _authService: AuthService,
      private _formBuilder: FormBuilder,
      private _router: Router,
      private _snackBar: MatSnackBar
    ) {}
  
    ngOnInit(): void {
      this.signInForm = this._formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
        rememberMe: [''],
      });
    }
  
    signIn(): void {
        if (this.signInForm.invalid) {
          console.log('Invalid form');
          return;
        }
    
        const credentials = this.signInForm.value;
        this.signInForm.disable();
        this.showAlert = false;
        this.loading = true;
    
        this._authService.signIn(credentials).pipe(
          switchMap((response) => {
            if (response.untrustedDevice) {
              return this._authService.generateOtp(credentials.email);
            } else {
              this.navigateToHome();
              return [];
            }
          })
        ).subscribe({
          next: () => {},
          error: (error) => {
            this.signInForm.enable();
            this.signInNgForm.resetForm();
            if (error.error.untrustedDevice) {
              this.handleUntrustedDevice(credentials.email);
            } else {
              this.alert = { type: 'error', message: 'Wrong email or password' };
              this.showAlert = true;
            }
            this.loading = false;
          }
        });
      }
  
  
  
    handleUntrustedDevice(email: string): void {
      this._snackBar.open('Untrusted device. You will be logged out.', 'Close', {
        duration: 4000,
      });
  
      setTimeout(() => {
        this._authService.signOut();
        this._router.navigate(['/confirmation-required'], { queryParams: { email } });
      }, 4000);
    }
  
    navigateToHome(): void {
      const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/userHome';
      // Navigate to the redirect url
      this._router.navigateByUrl(redirectURL);
      this.loading = false;
    }
    
  }