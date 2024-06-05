import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { InventoryProject } from 'app/mock-api/apps/project/project.types';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FinanceService {
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);
    private apiUrl = 'http://localhost:3000/Repos';
    

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for data
     */
    get data$(): Observable<any> {
        return this._data.asObservable();
    }

    get accessToken(): string {
        return localStorage.getItem('accessToken') ?? '';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get data
     */
    getData(): Observable<any> {
        return this._httpClient.get('api/dashboards/finance').pipe(
            tap((response: any) => {
                this._data.next(response);
            })
        );
    }

    /**
     * Update a repository
     * @param id
     * @param updatedData
     */
    updateRepository(id: string, updatedData: any): Observable<any> {
        const url = `${this.apiUrl}/repositories`;
        return this._httpClient.put(`${url}/${id}`, updatedData).pipe(
            tap(() => {
                this.getData().subscribe();
            })
        );
    }

    /**
     * Get a repository by ID
     * @param id The ID of the repository to fetch
     * @returns An Observable of the repository data
     */
    getRepositoryById(id: string): Observable<any> {
        const url = `${this.apiUrl}/repositories/${id}`;
        return this._httpClient.get(url).pipe(
            tap((response: any) => {
                this._data.next(response);
            })
        );
    }

    /**
     * Create a new repo
     * @param repo The repo to create
     * @returns An Observable of the created repo
     */
    createRepo(repo: InventoryProject): Observable<any> {
        const token = this.accessToken // Retrieve the token from local storage
    
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        });
    
        return this._httpClient.post(`${this.apiUrl}/RepoTouser`, repo, { headers });
      }

        /**
         * Get all repos
         * @returns An Observable of all repos
         */
      getRepos(): Observable<{ repos: InventoryProject[] }> {
        return this._httpClient.get<{ repos: InventoryProject[] }>(`${this.apiUrl}/get`);
      }

    
}
