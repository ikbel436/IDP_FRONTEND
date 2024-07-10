import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgOtpInputModule } from 'ng-otp-input';
import { AuthService } from 'app/core/auth/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

interface OtpChangeEvent {
    value: string;
}

@Component({
    selector: 'app-otp-verification',
    standalone: true,
    imports: [CommonModule, NgOtpInputModule],
    templateUrl: './otp-verification.component.html',
    styleUrls: ['./otp-verification.component.scss'],
})
export class OTPVerificationComponent {
    otpValue: string = '';
    isLoading = false;
    countdownTime: string = ''; // Changed type to string to hold HH:mm:ss format
    inputFieldsValid: boolean[] = Array(6).fill(false);
    sentToEmail: string | null = null;

    @ViewChild('timerRef') timerElement: ElementRef;

    constructor(
        private authService: AuthService,
        private router: Router,
        private _snackBar: MatSnackBar
    ) {
        this.sentToEmail = localStorage.getItem('email');
    }

    ngAfterViewInit() {
        this.startCountdown();
    }

    startCountdown(): void {
        let countdown = 5 * 60; // Initial countdown in seconds
        setInterval(() => {
            if (countdown > 0) {
                const hours = Math.floor(countdown / 3600);
                const minutes = Math.floor((countdown % 3600) / 60);
                const seconds = countdown % 60;
                this.countdownTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
                countdown--;
            } else {
                clearInterval(countdown);
                this.router.navigate(['/signup']);
            }
        }, 1000);
    }

    onOtpChange(event: any): void {
        this.otpValue = event;
        console.log(event);

        // Update the validity of each input field
        for (let i = 0; i < this.otpValue.length; i++) {
            this.inputFieldsValid[i] = !!this.otpValue[i];
        }
    }

    verifyOtp(): void {
        if (!this.allInputFieldsValid()) {
            return; // Early exit if any input field is invalid
        }

        this.isLoading = true;
        const userEmail = localStorage.getItem('email');

        this.authService.verifyOtp(userEmail, this.otpValue).subscribe(
            (response) => {
                this.isLoading = false;
                this.router.navigate(['/signin']);
            },
            (error) => {
                this.isLoading = false;
                this._snackBar.open('Wrong code', 'Close', {
                  duration: 2000,
              });
            }
        );
    }

    allInputFieldsValid(): boolean {
        return this.inputFieldsValid.every((fieldIsValid) => fieldIsValid);
    }
}
