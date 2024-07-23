import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgOtpInputModule } from 'ng-otp-input';
import { AuthService } from 'app/core/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeviceDetectorService } from 'ngx-device-detector';

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
export class OTPVerificationComponent implements AfterViewInit {
  otpValue: string = '';
  isLoading = false;
  countdownTime: string = ''; 
  inputFieldsValid: boolean[] = Array(6).fill(false);
  sentToEmail: string | null = null;
  deviceId: string | null = null; 

  @ViewChild('timerRef') timerElement: ElementRef;

  constructor(
    private authService: AuthService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private _deviceService: DeviceDetectorService,
    private route: ActivatedRoute 
  ) {
    this.route.queryParams.subscribe(params => {
      this.sentToEmail = params['email'] || null;
      console.log('Email:', this.sentToEmail);
    });
    this.deviceId = localStorage.getItem('deviceId');
  }

  ngAfterViewInit() {
    this.startCountdown();
  }

  ngOnInit(): void {
    this.generateOtp();
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

  async verifyOtp(): Promise<void> {
    if (!this.allInputFieldsValid()) {
      return; // Early exit if any input field is invalid
    }

    this.isLoading = true;
    const userEmail = this.sentToEmail;
    const deviceInfo = this._deviceService.getDeviceInfo();

    this.authService.verifyOtp(userEmail, this.otpValue, this.deviceId, deviceInfo).subscribe(
      (response) => {
        this.isLoading = false;
        console.log(response);
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

  generateOtp(): void {
    const userEmail = this.sentToEmail;
    this.authService.generateOtp(userEmail).subscribe(
      (response) => {
        console.log(response);
        this.deviceId = response.deviceId; 
        localStorage.setItem('deviceId', this.deviceId);
        console.log('OTP generated and sent to email. Device ID:', this.deviceId);
      },
      (error) => {
        console.error('Failed to generate OTP', error);
      }
    );
  }
}