import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { GetDeployementsUserComponent } from './get-deployements-user.component';



export default [
    {
        path     : '',
        component: GetDeployementsUserComponent,
        resolve  : {
          
        },
    },
] as Routes;
