import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeploymentService {

  constructor(private http: HttpClient) { }

  private apiUrl = 'http://localhost:3000';
 
  private getHeaders(token: string) {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  generateDatabaseDeployment(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/generate-database-deployment`, data);
  }

  generateDeployment(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/generate-deployment`, data);
  }

  
  applyK8sFiles(data: any): Observable<any> {
   
    return this.http.post(`${this.apiUrl}/apply-generated-k8s-files`, data);
  }
}
