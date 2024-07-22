import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CloudService } from 'app/models/cloud-service.types';

@Injectable({
  providedIn: 'root'
})

export class CloudServiceService {
  private apiUrl = 'https://backend.idp.insparkconnect.com/api/cloudservices';

  constructor(private http: HttpClient) { }

  addCloudService(service: CloudService): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, service);
  }

  getCloudServices(): Observable<CloudService[]> {
    return this.http.get<CloudService[]>(`${this.apiUrl}/list`);
  }

  updateServiceAvailability(service: CloudService): Observable<any> {
    return this.http.patch(`${this.apiUrl}/update-availability`, service);
  }
}
