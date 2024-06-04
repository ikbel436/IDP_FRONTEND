import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
}
