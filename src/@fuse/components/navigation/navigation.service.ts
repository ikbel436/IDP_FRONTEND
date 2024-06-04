import { Injectable } from '@angular/core';
import { FuseNavigationItem } from '@fuse/components/navigation/navigation.types';

@Injectable({ providedIn: 'root' })
export class FuseNavigationService {
    private _componentRegistry: Map<string, any> = new Map<string, any>();
    private _navigationStore: Map<string, FuseNavigationItem[]> = new Map<string, any>();

    /**
     * Constructor
     */
    constructor() {
    }
    getUserRole(): string {
        return localStorage.getItem('userRole') ?? '';
    }

    isAdmin(): boolean {
        return this.getUserRole() === 'admin';
    }

    isUser(): boolean {
        return this.getUserRole() === 'User';
    }

    getAdminNavigation(): any[] {
        return [

            { type: 'basic', title: 'Profile', icon: 'heroicons_outline:user-circle', link: '/profile' },
            { type: 'basic', title: 'Settings', icon: 'heroicons_outline:cog-8-tooth', link: '/settings' },
            { type: 'basic', title: 'Cloud Providers Services', icon: 'heroicons_outline:cloud', link: '/cloudProviderServices' },



        ];
    }

    getUserNavigation(): any[] {
        return [
            {
                id: 'Home',
                title: 'Home',
                icon: 'heroicons_outline:home',
                type: 'basic',
                link: '/createProject/inventory'
            },
            {
                id: 'Project',
                title: 'Project',
                icon: 'heroicons_outline:clipboard-document-list',
                type: 'group', children: [
                    { type: 'basic', title: 'Create Project', icon: 'heroicons_outline:square-3-stack-3d', link: '/createProject' },
                    { type: 'basic', title: 'Git Provider', icon: 'heroicons_outline:code-bracket-square', link: '/gitProvider' },
                ]
            },

            {
                id: 'Cloud',
                title: 'Self-Service',
                icon: 'heroicons_outline:bolt',
                type: 'group', children: [
                    { type: 'basic', title: 'Configure Infrastructure', icon: 'heroicons_outline:cloud', link: '/configInfrastructure' },
                    { type: 'basic', title: 'Cloud Infrastructure Templates', icon: 'heroicons_outline:cloud', link: '/templateTerraform' },
                ]
            },


            // {
            //     id: 'User',
            //     title: 'Personal Informations',
            //     type: 'group',
            //     icon: 'heroicons_outline:home', children: [
            //         { type: 'basic', title: 'Profile', icon: 'heroicons_outline:user-circle', link: '/profile' },
            //       { type: 'basic', title: 'Settings', icon: 'heroicons_outline:cog-8-tooth', link: '/settings' },]
            // },



        ];
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Register navigation component
     *
     * @param name
     * @param component
     */
    registerComponent(name: string, component: any): void {
        this._componentRegistry.set(name, component);
    }

    /**
     * Deregister navigation component
     *
     * @param name
     */
    deregisterComponent(name: string): void {
        this._componentRegistry.delete(name);
    }

    /**
     * Get navigation component from the registry
     *
     * @param name
     */
    getComponent<T>(name: string): T {
        return this._componentRegistry.get(name);
    }

    /**
     * Store the given navigation with the given key
     *
     * @param key
     * @param navigation
     */
    storeNavigation(key: string, navigation: FuseNavigationItem[]): void {
        // Add to the store
        this._navigationStore.set(key, navigation);
    }

    /**
     * Get navigation from storage by key
     *
     * @param key
     */
    getNavigation(key: string): FuseNavigationItem[] {
        return this._navigationStore.get(key) ?? [];
    }

    /**
     * Delete the navigation from the storage
     *
     * @param key
     */
    deleteNavigation(key: string): void {
        // Check if the navigation exists
        if (!this._navigationStore.has(key)) {
            console.warn(`Navigation with the key '${key}' does not exist in the store.`);
        }

        // Delete from the storage
        this._navigationStore.delete(key);
    }

    /**
     * Utility function that returns a flattened
     * version of the given navigation array
     *
     * @param navigation
     * @param flatNavigation
     */
    getFlatNavigation(navigation: FuseNavigationItem[], flatNavigation: FuseNavigationItem[] = []): FuseNavigationItem[] {
        for (const item of navigation) {
            if (item.type === 'basic') {
                flatNavigation.push(item);
                continue;
            }

            if (item.type === 'aside' || item.type === 'collapsable' || item.type === 'group') {
                if (item.children) {
                    this.getFlatNavigation(item.children, flatNavigation);
                }
            }
        }

        return flatNavigation;
    }

    /**
     * Utility function that returns the item
     * with the given id from given navigation
     *
     * @param id
     * @param navigation
     */
    getItem(id: string, navigation: FuseNavigationItem[]): FuseNavigationItem | null {
        for (const item of navigation) {
            if (item.id === id) {
                return item;
            }

            if (item.children) {
                const childItem = this.getItem(id, item.children);

                if (childItem) {
                    return childItem;
                }
            }
        }

        return null;
    }

    /**
     * Utility function that returns the item's parent
     * with the given id from given navigation
     *
     * @param id
     * @param navigation
     * @param parent
     */
    getItemParent(
        id: string,
        navigation: FuseNavigationItem[],
        parent: FuseNavigationItem[] | FuseNavigationItem,
    ): FuseNavigationItem[] | FuseNavigationItem | null {
        for (const item of navigation) {
            if (item.id === id) {
                return parent;
            }

            if (item.children) {
                const childItem = this.getItemParent(id, item.children, item);

                if (childItem) {
                    return childItem;
                }
            }
        }

        return null;
    }
}
