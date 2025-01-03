import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class TerraformService {
  private apiUrl = 'https://backend.idp.insparkconnect.com/terraform'; 
  constructor(private http: HttpClient) { }
  generateTerraform(configs: any): Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/generate-terraform`, configs);
  }
}
