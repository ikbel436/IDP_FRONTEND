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
                title: 'Projects',
                type: 'basic',
                icon: 'heroicons_outline:clipboard-document-check',
                link: '',
            },
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
                link: '/auth/profile',
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
                icon: 'heroicons_outline:cog-6-tooth',
                link: 'apps/academy',
            },
            {
                id: 'user-interface.cards',
                title: 'Cloud Infrastructure Templates',
                type: 'basic',
                icon: 'heroicons_outline:cloud',
                link: '/ui/cards',
            },
            {
                id: 'user-interface.cards',
                title: 'Download Terrafrom Templates',
                type: 'basic',
                icon: 'heroicons_outline:folder-arrow-down',
                link: '/ui/cards',
            },
            {
                id: 'user-interface.cards',
                title: 'Gitlab CI Templates',
                type: 'basic',
                icon: 'heroicons_outline:document-arrow-down',
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
