import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { User } from 'app/core/user/user.types';
import { map, Observable, ReplaySubject, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
    private apiUrl = 'http://localhost:3000/auth';
    private _user: ReplaySubject<User> = new ReplaySubject<User>(1);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {}
    // getImage(imageName: string ): Observable<Blob> {
    //   const userId = this.getUserID();
    //   //const imageName = this.getImageid();
    //   return new Observable<Blob>(observer => {
    //     fetch(`${this.apiUrl}/image/${userId}/${imageName}`)
    //       .then(response => {
    //         if (!response.ok) {
    //           throw new Error('Network response was not ok');
    //         }
    //         return response.blob();
    //       })
    //       .then(blob => {
    //         observer.next(blob);
    //         observer.complete();
    //       })
    //       .catch(error => {
    //         observer.error(error);
    //       });
    //   });
    // }
    // getImage1(): Observable<Blob> {
    //   const userId = this.getUserID();
    //  const imageName = this.getImageid();
    //   return this._httpClient.get(`${this.apiUrl}/image/${userId}/${imageName}`, { responseType: 'blob' });
    // }
    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------
    updateUserStatus(status: string): Observable<any> {
        const userId = this.getUserID();
        return this._httpClient.put<any>(`${this.apiUrl}/profile/${userId}`, {
            status,
        });
    }
    /**
     * Setter & getter for user
     *
     * @param value
     */
    set user(value: User) {
        // Store the value
        this._user.next(value);
    }

    get user$(): Observable<User> {
        return this._user.asObservable();
    }
    getUserID(): string {
        const token = localStorage.getItem('accessToken');
        if (token) {
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            return decodedToken.id;
        } else {
            console.error('Token not found in local storage.');
            return null;
        }
    }
    getImageid(): string {
        const token = localStorage.getItem('accessToken');
        if (token) {
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            return decodedToken.image;
        } else {
            console.error('Token not found in local storage.');
            return null;
        }
    }
    get accessToken(): string {
        return localStorage.getItem('accessToken') ?? '';
    }

    token = this.accessToken;

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get the current logged in user data
     */
    get(): Observable<User> {
        const url = `${this.apiUrl}/current`;
        const headers = new HttpHeaders({
            Authorization: `Bearer ${this.token}`, // Remplacez `votreToken` par votre véritable token
        });
        return this._httpClient.get<User>(url, { headers: headers }).pipe(
            tap((user) => {
                this._user.next(user);
            })
        );
    }
    post(): Observable<User> {
        const url = `${this.apiUrl}/user`;
        const headers = new HttpHeaders({
            Authorization: `Bearer ${this.token}`, // Remplacez `votreToken` par votre véritable token
        });
        return this._httpClient.get<User>(url, { headers: headers }).pipe(
            tap((user) => {
                this._user.next(user);
            })
        );
    }

    update(user: any): Observable<any> {
        const userId = this.getUserID();
        return this._httpClient
            .put<User>(`${this.apiUrl}/profile/${userId}`, user)
            .pipe(
                map((response) => {
                    this._user.next(response);
                })
            );
    }

    uploadImage(image: File): Observable<any> {
        // Extract user ID from token
        const userId = this.getUserID();

        const formData = new FormData();
        formData.append('image', image); // Make sure 'image' matches the field name expected by the backend

        return this._httpClient.put<any>(
            `${this.apiUrl}/upload/${userId}`,
            formData
        );
    }
}
