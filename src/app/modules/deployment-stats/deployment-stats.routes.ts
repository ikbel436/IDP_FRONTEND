import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { DeploymentStatsComponent } from './deployment-stats.component';


export default [
    {
        path     : '',
        component: DeploymentStatsComponent,
        resolve  : {
           
        },
    },
] as Routes;
