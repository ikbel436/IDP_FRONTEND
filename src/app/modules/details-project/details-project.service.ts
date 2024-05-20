import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InventoryProject } from 'app/mock-api/apps/project/project.types'; // Update with the correct path to your model

@Injectable({
  providedIn: 'root'
})
export class DetailsProjectService {
    private apiUrl = 'http://localhost:3000/project'; // Replace with your API URL

  constructor(private _httpClient: HttpClient) {}

  getProjects(): Observable<{ projects: InventoryProject[] }> {
    return this._httpClient.get<{ projects: InventoryProject[] }>(`${this.apiUrl}/get`);
  }
  get accessToken(): string {
    return localStorage.getItem('accessToken') ?? '';
}
  getProjectById(id: string): Observable<InventoryProject> {
    return this._httpClient.get<InventoryProject>(`${this.apiUrl}/projects/${id}`);
  }
  createProject(project: InventoryProject): Observable<any> {
    const token = this.accessToken // Retrieve the token from local storage

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this._httpClient.post(`${this.apiUrl}/project`, project, { headers });
  }
}