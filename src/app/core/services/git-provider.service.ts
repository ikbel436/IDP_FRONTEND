import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class GitProviderService {
    private apiUrl = 'https://backend.idp.insparkconnect.com/connect/connect_bitbucket';
    private accessToken: string | null = null;
    private workspace: string | null = null;

    constructor(private http: HttpClient) {}

    setCredentials(
        accessToken: string,
        workspace: string,
    ): void {
        this.accessToken = accessToken;
        this.workspace = workspace;
    }

    getRepositoriesBitbucket(): Observable<any> {
        return this.http.post<any>(this.apiUrl, {
            accessToken: this.accessToken,
            workspace: this.workspace,
        });
    }

    getRepositoriesGit(): Observable<any> {
        return this.http.post<any>('https://backend.idp.insparkconnect.com/OAuth/github', {
            token: this.accessToken,
        });
    }

    

    

}
