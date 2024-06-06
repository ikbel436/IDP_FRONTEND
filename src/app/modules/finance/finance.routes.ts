import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { FinanceComponent } from './finance.component';


export default [
    {
        path     : '',
        component: FinanceComponent,
        resolve  : {
            // data: () => inject(FinanceService).getData(),
        },
    },
] as Routes;
