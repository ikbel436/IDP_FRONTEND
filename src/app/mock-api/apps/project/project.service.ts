import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { InventoryProject } from './project.types';
import { catchError } from 'rxjs/operators';
import {
    BehaviorSubject,
    filter,
    map,
    Observable,
    of,
    switchMap,
    take,
    tap,
    throwError,
} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProjectService {
    // Private
    private _project: BehaviorSubject<InventoryProject | null> =
        new BehaviorSubject(null);
    private _projects: BehaviorSubject<InventoryProject[] | null> =
        new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {}

    /**
     * Api Base URL
     */
    private apiUrl = 'https://backend.idp.insparkconnect.com';
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for product
     */
    get project$(): Observable<InventoryProject> {
        return this._project.asObservable();
    }

    /**
     * Getter for products
     */
    get projects$(): Observable<InventoryProject[]> {
        return this._httpClient.get<any>(`${this.apiUrl}/get`);
    }

    /**
     * Getter for token
     */
    get accessToken(): string {
        return localStorage.getItem('accessToken') ?? '';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Update product
     *
     * @param projectId
     * @param updatedProject
     */
    updateProject1(projectId: string, updatedProject: any): Observable<any> {
        return this._httpClient.put(
            `${this.apiUrl}/project/${projectId}`,
            updatedProject
        );
    }

    /**
     * Delete the product
     *
     * @param id
     */
    deleteProduct(projectId: string): Observable<any> {
        return this._httpClient.delete(`${this.apiUrl}/projects/${projectId}`);
    }

    /**
     * Get
     * Project
     * */

    getProjects(): Observable<InventoryProject[]> {
        const token = this.accessToken;
        const headers = new HttpHeaders().set(
            'Authorization',
            `Bearer ${token}`
        );
        return this._httpClient.get<InventoryProject[]>(`${this.apiUrl}/get`, {
            headers,
        });
    }

    /**
     * Get product by id
     */
    getProjectsByIds(id: string) {
        return this._httpClient.get<InventoryProject>(
            `${this.apiUrl}/get/${id}`
        );
    }
    /**
     * Create product
     */
    createProject(project: InventoryProject): Observable<InventoryProject> {
        const token = this.accessToken;
        const headers = new HttpHeaders().set(
            'Authorization',
            `Bearer ${token}`
        );

        return this._httpClient.post<InventoryProject>(
            `${this.apiUrl}/project`,
            project,
            { headers }
        );
    }
}
