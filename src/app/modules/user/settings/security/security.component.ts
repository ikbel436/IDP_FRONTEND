import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    ViewEncapsulation,
    inject,
} from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Router } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { OtpDialogComponent } from 'app/modules/otp-dialog/otp-dialog.component';
import { OTPVerificationComponent } from 'app/modules/otp-verification/otp-verification.component';
import otpVerificationRoutes from 'app/modules/otp-verification/otp-verification.routes';




@Component({
    selector: 'settings-security',
    templateUrl: './security.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSlideToggleModule,
        MatButtonModule,
        CommonModule,
        OTPVerificationComponent,
    ],
})
export class SettingsSecurityComponent implements OnInit {
    securityForm: UntypedFormGroup;
    isLoadingOTP: boolean = false;
    /**
     * Constructor
     */
    constructor(private _formBuilder: UntypedFormBuilder, private authservice: AuthService, private _router: Router, private dialog: MatDialog) { }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the form
        this.securityForm = this._formBuilder.group({
            currentPassword: [''],
            newPassword: [''],
            twoStep: [true],
            askPasswordChange: [false],
        });



    }





    async changePassword() {
        if (this.securityForm.invalid) {
            return;
        }
    
        this.isLoadingOTP = true;
        const currentPassword = this.securityForm.controls.currentPassword.value;
        const newPassword = this.securityForm.controls.newPassword.value;
    
        try {
            const response = await this.authservice.changePassword({ currentPassword, newPassword }).toPromise();
            if (response) {
                const userEmail = this.authservice.getUserEmail();
                await this.authservice.generateOtp(userEmail).toPromise();
    
                const dialogRef = this.dialog.open(OtpDialogComponent, {
                    width: '8&00px', 
                    data: { email: userEmail }
                });
    
                dialogRef.afterClosed().subscribe(async (otpVerified) => {
                    this.isLoadingOTP = false;
                    if (otpVerified) {
                        console.log("Password change and OTP verification successful.");
                    } else {
                        alert('OTP verification failed. Password change was not completed.');
                    }
                });
            } else {
                this.isLoadingOTP = false;
                alert('Failed to change password.');
            }
        } catch (error) {
            this.isLoadingOTP = false;
            console.error('Error changing password:', error);
            alert('An error occurred while changing the password.');
        }
    }
}
