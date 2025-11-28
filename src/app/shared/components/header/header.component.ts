import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';  // ✅ needed for ngStyle
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  template: `
    <nav class="navbar navbar-expand-lg" [ngStyle]="{'background-color': headerColor, color: 'white'}">
      <div class="container-fluid">
        <a class="navbar-brand text-white font-weight-bold" routerLink="/">Scholarship Portal</a>
        <div class="ms-auto">
          <button *ngIf="isLoggedIn()" class="btn btn-outline-light" (click)="logout()">Logout</button>
          <a *ngIf="!isLoggedIn()" class="btn btn-outline-light" routerLink="/auth/login">Login</a>
        </div>
      </div>
    </nav>
  `,
  imports: [CommonModule, RouterModule]
})
export class HeaderComponent {
  headerColor = '#ab0520';

  constructor(private router: Router) {}

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/auth/login']);
  }
}
