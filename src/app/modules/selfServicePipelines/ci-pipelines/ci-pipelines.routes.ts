import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { CIPipelinesComponent } from './ci-pipelines.component';


export default [
    {
        path: '',
        component: CIPipelinesComponent,
        resolve: {
            // data: () => inject(FinanceService).getData(),
        },
    },
] as Routes;