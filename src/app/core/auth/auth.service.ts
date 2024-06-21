import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import {
    catchError,
    Observable,
    of,
    switchMap,
    throwError,
    ReplaySubject,
} from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';
import { User } from '../user/user.types';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private _authenticated: boolean = false;
    private apiUrl = 'http://localhost:3000/auth';
    private _user: ReplaySubject<User> = new ReplaySubject<User>(1);
    private _jwtHelper: JwtHelperService;
    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _userService: UserService
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------
    getUserRole(): string {
        return localStorage.getItem('userRole');
    }
    getUserProjects(): string {
        return localStorage.getItem('myProjects');
    }
    getUserRepos(): string {
        return localStorage.getItem('myRepos');
    }
    /**
     * Setter & getter for access token
     */
    set accessToken(token: string) {
        localStorage.setItem('accessToken', token);
    }

    get accessToken(): string {
        return localStorage.getItem('accessToken') ?? '';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Forgot password
     *
     * @param email
     */
    forgotPassword(email: string): Observable<any> {
        const url = `${this.apiUrl}/forgot`;
        return this._httpClient.post(url, { email });
    }

    /**
     * Reset password
     *
     * @param password
     */
    set resetPasswordToken(token: string) {
        localStorage.setItem('resetLink', token);
    }
    get resetPasswordToken(): string {
        return localStorage.getItem('resetLink') ?? '';
    }
    resetPassword(password: string): Observable<any> {
        const token = this.resetPasswordToken;

        const url = `${this.apiUrl}/reset`;
        const requestBody = {
            newPass: password,
            resetLink: token,
        };

        return this._httpClient.post(url, requestBody).pipe(
            tap(() => {
                localStorage.removeItem('resetLink');
            })
        );
    }

    /**
     * Change password
     *
     * @param credentials
     */
    changePassword(credentials: {
        currentPassword: string;
        newPassword: string;
    }): Observable<any> {
        const url = `${this.apiUrl}/changepassword`;
        return this._httpClient.put(url, credentials).pipe(
            switchMap((response: any) => {
                if (
                    response &&
                    response.msg === 'Password successfully changed'
                ) {
                    return of(response);
                } else {
                    // Handle error case
                    return throwError('Failed to change password.');
                }
            }),
            catchError((error) => {
                // Handle network errors or unexpected server responses
                console.error('Error changing password:', error);
                return throwError(error);
            })
        );
    }

    /**
     * Sign in
     *
     * @param credentials
     */
    signIn(credentials: { email: string; password: string }): Observable<any> {
        // Throw error, if the user is already logged in
        if (this._authenticated) {
            return throwError('User is already logged in.');
        }
        const url = `${this.apiUrl}/login`;
        return this._httpClient.post<any>(url, credentials).pipe(
            switchMap((response: any) => {
                this.accessToken = response.token;

                localStorage.setItem('userRole', response.user.Role);
                localStorage.setItem('myProjects', response.user.myProject);
                localStorage.setItem('myRepos', response.user.myRepo);
                this._authenticated = true;

                this._userService.user = response.user;

                // Return a new observable with the response
                return this._userService.get();
            }),
            tap((user: User) => {
                // Update the user in UserService
                this._userService.user = user;
            })
        );
    }

    /**
     * Sign in using the access token
     */
    signInUsingToken(): Observable<any> {
        // Sign in using the token
        return this._httpClient
            .post('api/auth/sign-in-with-token', {
                accessToken: this.accessToken,
            })
            .pipe(
                catchError(() =>
                    // Return false
                    of(false)
                ),
                switchMap((response: any) => {
                    // Replace the access token with the new one if it's available on
                    // the response object.
                    //
                    // This is an added optional step for better security. Once you sign
                    // in using the token, you should generate a new one on the server
                    // side and attach it to the response object. Then the following
                    // piece of code can replace the token with the refreshed one.
                    if (response.accessToken) {
                        this.accessToken = response.accessToken;
                    }

                    // Set the authenticated flag to true
                    this._authenticated = true;

                    // Store the user on the user service
                    this._userService.user = response.user;

                    // Return true
                    return of(true);
                })
            );
    }

    /**
     * Sign out
     */
    signOut(): Observable<any> {
        // Remove the access token from the local storage
        localStorage.removeItem('accessToken');
        this._user.next(null);

        // Set the authenticated flag to false
        this._authenticated = false;

        // Return the observable
        return of(true);
    }

    /**
     * Sign up
     *
     * @param user
     */
    signUp(user: {
        name: string;
        email: string;
        password: string;
        phoneNumber: number;
    }): Observable<any> {
        const url = `${this.apiUrl}/register`;
        return this._httpClient.post(url, user);
    }

    /**
     * Unlock session
     *
     * @param credentials
     */
    unlockSession(credentials: {
        email: string;
        password: string;
    }): Observable<any> {
        return this._httpClient.post('api/auth/unlock-session', credentials);
    }

    /**
     * Check the authentication status
     */
    check(): Observable<boolean> {
        //  return of(true);
        // Check if the user is logged in
        if (this._authenticated) {
            return of(true);
        }

        if (!this.accessToken) {
            return of(false);
        }

     
        this._authenticated = true;
        this.accessToken = localStorage.getItem('accessToken');
        return of(true);
    }
    getCurrentUser(): Observable<any> {
        return this._httpClient.get<any>(`${this.apiUrl}/current`);
    }
}
