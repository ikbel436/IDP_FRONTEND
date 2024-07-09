import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgOtpInputModule } from 'ng-otp-input';
import { AuthService } from 'app/core/auth/auth.service';

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
    isLoading = false; // Flag to indicate loading state

    constructor(private authService: AuthService) {}

    onOtpChange(event: any): void {
        this.otpValue = event;
        console.log(event);
    }

    verifyOtp(): void {
        this.isLoading = true; 
        const userEmail = localStorage.getItem('email'); 

        this.authService.verifyOtp(userEmail, this.otpValue).subscribe(
            (response) => {
                this.isLoading = false; // Enable the button and hide the loader
                console.log(response);
                // Navigate to another page or show a success message
            },
            (error) => {
                this.isLoading = false; // Always reset the loading state on failure
                console.error(error);
                // Show an error message to the user
            }
        );
    }
}
