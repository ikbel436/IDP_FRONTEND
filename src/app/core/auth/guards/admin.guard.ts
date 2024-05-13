import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    const userRole = this.authService.getUserRole();
    if (userRole === 'admin') {
      return of(true); // Allow access for clients
    } else {
        this.router.navigate(['/pages/error/404']); // Redirect non-client users
        return of(false);
      }
  }
}