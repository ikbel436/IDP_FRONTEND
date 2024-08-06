import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeploymentsService {
  private apiUrl = 'https://backend.idp.insparkconnect.com/depl'; 
  constructor(private http: HttpClient) { }
  getAllDeployments(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/deploymentsUser`);
  }
  getDeploymentStats(timeframe: string): Observable<any> {
    const params = new HttpParams().set('timeframe', timeframe);
    return this.http.get(`${this.apiUrl}/deployment-stats`, { params });
}
getDeploymentSuccessRate(timeframe: string): Observable<any> {
  return this.http.get(`${this.apiUrl}/stat-namespace?timeframe=${timeframe}`);
}
getDeploymentFrequency(timeframe: string): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/stat-avg-user`, { params: { timeframe } });
}
deleteDeployment(deploymentId: string): Observable<any> {
  return this.http.delete(`${this.apiUrl}/delete-depl/${deploymentId}`);
}
}
