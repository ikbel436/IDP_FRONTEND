import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class WorkflowService {
    private baseUrl = 'http://localhost:3000/pipCI';

    constructor(private http: HttpClient) { }

    // Example method to update YAML file
    updateYaml(owner: string, token: string, repo: string, platform: string, yamlData: any): Observable<any> {
        return this.http.put<any>(`${this.baseUrl}/yaml`, { owner, token, repo, platform, yamlData });
    }

    // Example method to push workflow file to GitHub
    pushWorkflowToGitHub(owner: string, token: string, repo: string, platform: string): Observable<any> {
        return this.http.put<any>(`${this.baseUrl}/create-workflow`, { owner, token, repo, platform });
    }

    // Example method to read YAML file from server
    readYaml(platform: string): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/yaml/${platform}`);
    }
}
