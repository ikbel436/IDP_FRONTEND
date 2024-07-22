import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgOtpInputModule } from 'ng-otp-input';
import { AuthService } from 'app/core/auth/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-otp-dialog',
  standalone: true,
  imports: [CommonModule, NgOtpInputModule],
  templateUrl: './otp-dialog.component.html',
  styleUrl: './otp-dialog.component.scss'
})
export class OtpDialogComponent {
  otpValue: string = '';
  isLoading = false;
  countdownTime: string = ''; // Changed type to string to hold HH:mm:ss format
  inputFieldsValid: boolean[] = Array(6).fill(false);
  sentToEmail: string | null = null;

  @ViewChild('timerRef') timerElement: ElementRef;

  constructor(
      private authService: AuthService,
      private router: Router,
      private _snackBar: MatSnackBar,
      private dialogRef: MatDialogRef<OtpDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: { email: string }
  
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

//   verifyOtp(): void {
//       if (!this.allInputFieldsValid()) {
//           return; // Early exit if any input field is invalid
//       }

//       this.isLoading = true;
//       const userEmail = localStorage.getItem('email');

//       this.authService.verifyOtp(userEmail, this.otpValue).subscribe(
//           (response) => {
//               this.isLoading = false;
             
//               this.dialogRef.close(true);
//               localStorage.removeItem('accessToken');
//              localStorage.removeItem('email');
//              localStorage.removeItem('userRole');
//              localStorage.removeItem('myRepos');
//              localStorage.removeItem('myProjects');
//               this.router.navigate(['/sign-in']).then(() => {
//                 window.location.reload(); // Refresh the sign-in page
//             });
             
//           },
//           (error) => {
//               this.isLoading = false;
//               this._snackBar.open('Wrong code', 'Close', {
//                 duration: 2000,
//             });
//             this.dialogRef.close(false);
//           }
//       );
//   }

  allInputFieldsValid(): boolean {
      return this.inputFieldsValid.every((fieldIsValid) => fieldIsValid);
  }
}
