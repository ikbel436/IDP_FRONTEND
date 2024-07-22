import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProfileService {
    private apiUrl = 'https://backend.idp.insparkconnect.com/project';
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {
    }
    get accessToken(): string {
        return localStorage.getItem('accessToken') ?? '';
    }
    createProject(name: string, description: string, provider: string,
        lien: string): Observable<any> {
        const token = this.accessToken; // Récupérez le token JWT de localStorage ou d'où vous le stockez
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        const body = { name, description, provider, lien };

        return this._httpClient.post<any>(`${this.apiUrl}/project`, body, { headers });
    }
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
        return this._httpClient.get('api/dashboards/project').pipe(
            tap((response: any) => {
                this._data.next(response);
            }),
        );
    }
}
