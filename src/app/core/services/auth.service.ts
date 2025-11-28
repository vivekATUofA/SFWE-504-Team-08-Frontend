import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../src/environment';
import { tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = `${environment.apiBaseUrl}/auth`;
  private TOKEN_KEY = 'token';
  private USER_KEY = 'user';

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  // CRITICAL HELPER: Prevents crashing on the server
  private isStorageAvailable(): boolean {
    return typeof localStorage !== 'undefined';
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, credentials).pipe(
      tap(res => {
        if (this.isStorageAvailable() && res && res.token) {
          localStorage.setItem(this.TOKEN_KEY, res.token);
          localStorage.setItem(this.USER_KEY, JSON.stringify(res.user || null));
        }
      })
    );
  }

  register(payload: { fullName: string; email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/register`, payload);
  }

  logout(): void {
    if (this.isStorageAvailable()) {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    }
    this.router.navigate(['/auth/login']);
  }

  // THIS METHOD CAUSES THE CRASH IF NOT PROTECTED
  getToken(): string | null {
    if (this.isStorageAvailable()) {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  isLoggedIn(): boolean {
    if (this.isStorageAvailable()) {
      return !!this.getToken();
    }
    return false;
  }

  getCurrentUser(): any | null {
    if (this.isStorageAvailable()) {
      const u = localStorage.getItem(this.USER_KEY);
      return u ? JSON.parse(u) : null;
    }
    return null;
  }
}