import { Routes } from '@angular/router';
import { SettingsComponent } from './settings.component';

export default [
    {
        path: '',
        component: SettingsComponent,
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'account',
            },
            {
                path: 'account',
                loadChildren: () =>
                    import('app/modules/user/settings/account/account.routes'),
            },
            {
                path: 'notifications',
                loadChildren: () =>
                    import(
                        'app/modules/user/settings/notifications/notifications.routes'
                    ),
            },
            {
                path: 'plan-billing',
                loadChildren: () =>
                    import(
                        'app/modules/user/settings/plan-billing/plan-billing.routes'
                    ),
            },
            {
                path: 'security',
                loadChildren: () =>
                    import(
                        'app/modules/user/settings/security/security.routes'
                    ),
            },
            {
                path: 'team',
                loadChildren: () =>
                    import('app/modules/user/settings/team/team.routes'),
            },
        ],
    },
] as Routes;
