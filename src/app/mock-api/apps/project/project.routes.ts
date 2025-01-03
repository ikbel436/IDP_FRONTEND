import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { ProjectComponent } from './project.component';
import { ProjectService } from './project.service';

export default [
    {
        path      : '',
        pathMatch : 'full',
        redirectTo: 'inventory',
    },
    {
        path     : 'inventory',
        component: ProjectComponent,
        children : [
            {
                path     : '',
                component: ProjectComponent,
                resolve  : {
                   
                     products  : () => inject(ProjectService).getProjects(),
                   
                },
            },
        ],
    },
] as Routes;
