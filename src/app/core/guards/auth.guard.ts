import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // 1. Check if the user is logged in (has token in localStorage)
  if (authService.isLoggedIn()) {
    return true; // Allow access
  }

  // 2. If not, redirect to Login page
  return router.createUrlTree(['/auth/login']);
};