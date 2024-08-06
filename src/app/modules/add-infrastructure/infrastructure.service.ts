import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InfrastructureService {
  private apiUrl = 'https://backend.idp.insparkconnect.com/infra';
  constructor(private http: HttpClient) { }
  addInfra(formData: FormData): Observable<any> {
    const token = localStorage.getItem('accessToken');  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.apiUrl}/addInfra`, formData, { headers });
  }

  getInfras(): Observable<any> {
  
    return this.http.get(`${this.apiUrl}/getInfras`);
  }
  deleteInfra(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteInfra/${id}`);
  }
}
