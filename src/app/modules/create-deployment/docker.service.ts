import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DockerService {

  private baseUrl = 'http://localhost:3000/api/docker-tags'; // Update to your backend URL

  constructor(private http: HttpClient) { }
  getDockerImageTags(namespace: string, repository: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${namespace}/${repository}`)
      .pipe(
        map((response: any) => response.results.map(tag => tag.name)), // Extract the tags array
        catchError(this.handleError)
      );
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError('Something went wrong; please try again later.');
  }
}
