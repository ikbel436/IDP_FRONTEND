import { inject } from '@angular/core';
import { Routes } from '@angular/router';

import { GetInfraComponent } from './get-infra.component';



export default [
    {
        path     : '',
        component: GetInfraComponent,
        resolve  : {
          
        },
    },
] as Routes;
