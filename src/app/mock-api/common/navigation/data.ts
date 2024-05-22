/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id: 'exemple',
        title: 'Your projects',
        type: 'group',
        icon: 'heroicons_outline:home',
        children: [

            {
                id: 'dashboards.project',
                title: 'Create Project',
                type: 'basic',
                icon: 'heroicons_outline:square-3-stack-3d',
                link: '/createProject',
            },




            // {
            //     id: 'dashboards.finance',
            //     title: 'Projects',
            //     type: 'basic',
            //     icon: 'heroicons_outline:banknotes',
            //     link: '/project',
            // },


            ],
        },
        {
            id: 'User',
            title: 'Personal Informations',
            type: 'group',
            icon: 'heroicons_outline:home',
            children: [
                {
                    id: 'user.profile',
                    title: 'Profile',
                    type: 'basic',
                    icon: 'heroicons_outline:user-circle',
                    link: '/profile',
                },
                {
                    id: 'user.profile',
                    title: 'Settings',
                    type: 'basic',
                    icon: 'heroicons_outline:user-circle',
                    link: '/settings',
                },
            ]
        },
        {
            id: 'apps',
            title: 'Services',
            subtitle: 'Developers Self-Service',
            type: 'group',
            icon: 'heroicons_outline:home',
            children: [
                {
                    id: 'user-interface.cards',
                    title: 'Configure Infrastructure',
                    type: 'basic',
                    icon: 'heroicons_outline:cloud',
                    link: 'configInfrastructure',
                },
                {
                    id: 'user-interface.cards',
                    title: 'Cloud Infrastructure Templates',
                    type: 'basic',
                    icon: 'heroicons_outline:cloud',
                    link: 'templateTerraform',
                },
                {
                    id: 'user-interface.cards',
                    title: 'Download Terrafrom Templates',
                    type: 'basic',
                    icon: 'heroicons_outline:cloud',
                    link: '/ui/cards',
                },
                {
                    id: 'user-interface.cards',
                    title: 'Gitlab CI Templates',
                    type: 'basic',
                    icon: 'heroicons_outline:cloud',
                    link: '/ui/cards',
                },
                {
                    id: 'user-interface.cards',
                    title: 'Create your infrastructure',
                    type: 'basic',
                    icon: 'heroicons_outline:cloud',
                    link: '/ui/forms/layouts',
                },

        ],
    },
];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id: 'example',
        title: 'Example',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/example'
    }
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id: 'example',
        title: 'Example',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/example'
    }
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id: 'example',
        title: 'Example',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/example'
    }
];
