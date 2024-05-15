import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  getProjectById(id: string): Observable<InventoryProject> {
    return this._httpClient.get<InventoryProject>(`${this.apiUrl}/projects/${id}`);
  }
}