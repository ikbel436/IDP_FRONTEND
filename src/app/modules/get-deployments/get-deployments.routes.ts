import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { GetDeploymentsComponent } from './get-deployments.component';



export default [
    {
        path     : '',
        component: GetDeploymentsComponent,
        resolve  : {
          
        },
    },
] as Routes;
