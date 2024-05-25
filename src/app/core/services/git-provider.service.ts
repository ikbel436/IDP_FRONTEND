import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class GitProviderService {
    private apiUrl = 'http://localhost:3000/connect/bitbucket';
    private accessToken: string | null = null;
    private workspace: string | null = null;
    private _token: string | null = null;

    constructor(private http: HttpClient) {}

    setCredentials(
        accessToken: string,
        workspace: string,
        _token: string
    ): void {
        this.accessToken = accessToken;
        this.workspace = workspace;
        this._token = _token;
    }

    getRepositoriesBitbucket(): Observable<any> {
        return this.http.post<any>(this.apiUrl, {
            accessToken: this.accessToken,
            workspace: this.workspace,
        });
    }

    getRepositoriesGit(): Observable<any> {
        return this.http.post<any>('http://localhost:3000/OAuth/github', {
            token: this.accessToken,
        });
    }
}
