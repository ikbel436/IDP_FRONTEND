import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { OTPVerificationComponent } from './otp-verification.component';



export default [
    {
        path     : '',
        component: OTPVerificationComponent,
        resolve  : {
          
        },
    },
] as Routes;
