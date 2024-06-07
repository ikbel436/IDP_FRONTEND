import { Routes } from '@angular/router';
import { LoggedInHomeComponent } from 'app/modules/landing/logged-in-home/logged-in-home.component';

export default [
    {
        path: '',
        component: LoggedInHomeComponent,
    },
] as Routes;
