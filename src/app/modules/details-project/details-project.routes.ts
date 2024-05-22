import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { DetailsProjectComponent } from './details-project.component';
import { ProjectService } from 'app/mock-api/apps/project/project.service';

export default [
    {
        path     : '',
        component: DetailsProjectComponent,
        resolve  : {
            data: () => inject(ProjectService).getProjects(),
        },
    },
] as Routes;
