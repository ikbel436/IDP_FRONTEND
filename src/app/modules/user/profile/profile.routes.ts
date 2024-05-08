import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { ProfileService } from 'app/core/user/profile.service';
import { ProfileComponent } from 'app/modules/user/profile/profile.component';

export default [
    {
        path: '',
        component: ProfileComponent,
        resolve: {
            data: () => inject(ProfileService).getData(),
        },
    },
] as Routes;