import { Route } from '@angular/router';
import { initialDataResolver } from 'app/app.resolvers';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { AdminGuard } from './core/auth/guards/admin.guard';
import { ClientGuard } from './core/auth/guards/client.guard';

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [

    // Redirect empty path to '/dashboards/project'
    { path: '', pathMatch: 'full', redirectTo: '/userHome' },

    // Redirect signed-in user to the '/dashboards/project'
    //
    // After the user signs in, the sign-in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file.
    { path: 'signed-in-redirect', pathMatch: 'full', redirectTo: '/gitProvider' },
    {
        path: 'settings',
        canActivate: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver,
        },

        loadChildren: () => import('app/modules/user/settings/settings.routes'),
    },

    // Auth routes for guests
    {
        path: '',

        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            { path: 'confirmation-required', loadChildren: () => import('app/modules/auth/confirmation-required/confirmation-required.routes') },
            { path: 'forgot-password', loadChildren: () => import('app/modules/auth/forgot-password/forgot-password.routes') },
            { path: 'reset-password/:token', loadChildren: () => import('app/modules/auth/reset-password/reset-password.routes') },
            { path: 'sign-in', loadChildren: () => import('app/modules/auth/sign-in/sign-in.routes') },
            { path: 'sign-up', loadChildren: () => import('app/modules/auth/sign-up/sign-up.routes') }
        ]
    },

    // Auth routes for authenticated users
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            { path: 'sign-out', loadChildren: () => import('app/modules/auth/sign-out/sign-out.routes') },
            { path: 'unlock-session', loadChildren: () => import('app/modules/auth/unlock-session/unlock-session.routes') },


        ]
    },

    // Landing routes
    {
        path: '',
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            { path: 'home', loadChildren: () => import('app/modules/landing/home/home.routes') },
        ]
    },

    // Admin routes
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver
        },
        children: [

            // Dashboards
            { path: 'userHome', loadChildren: () => import('app/modules/landing/logged-in-home/logged-in-home.routes') },
            { path: 'createProject', loadChildren: () => import('app/mock-api/apps/project/project.routes') },
            { path: 'profile', loadChildren: () => import('app/modules/profile/profile.routes') },
            { path: 'configInfrastructure', loadChildren: () => import('app/modules/config-infra/config-infra.routes') },
            { path: 'templateTerraform', loadChildren: () => import('app/modules/template-terraform/template-terraform.routes') },
            { path: 'project', loadChildren: () => import('app/modules/details-project/details-project.routes') },
            { path: 'gitProvider', loadChildren: () => import('app/modules/git-provider/get-projects/get-project.routes') },
            { path: 'cloudProviderServices', loadChildren: () => import('app/modules/cloud-provider-services/cloud-provider-services.routes') },
            { path: 'addCloudService', loadChildren: () => import('app/modules/cloud-services/add-cloud-service/add-cloud-services.routes') },
            { path: 'listCloudServices', loadChildren: () => import('app/modules/cloud-services/list-cloud-services/list-cloud-services.routes') },
            { path: 'services', loadChildren: () => import('app/modules/finance/finance.routes') },

            // Apps


            // Pages


            // 404 & Catch all
            { path: '404-not-found', pathMatch: 'full', loadChildren: () => import('app/modules/error-404/error-404.routes') },
            { path: '**', redirectTo: '404-not-found' }
        ]
    }
];
