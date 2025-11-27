import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Role Guard
 * Protects routes based on user roles
 */
@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const currentUser = this.authService.currentUserValue;

    if (!currentUser) {
      // Not logged in, redirect to login
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }

    // Check if route requires specific roles
    if (route.data && route.data['roles']) {
      const requiredRoles: string[] = route.data['roles'];
      const userRoles = currentUser.roles || [];

      // Check if user has any of the required roles
      const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));

      if (hasRequiredRole) {
        return true;
      } else {
        // User doesn't have required role, redirect to unauthorized page
        this.router.navigate(['/unauthorized']);
        return false;
      }
    }

    // No specific roles required, allow access
    return true;
  }
}
