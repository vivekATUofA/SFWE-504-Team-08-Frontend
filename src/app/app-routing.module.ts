import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
// Import the DashboardComponent to use it in the static route
import { DashboardComponent } from './features/dashboard/dashboard/dashboard.component'; 

const routes: Routes = [
  // Lazy-loaded Authentication Module (Login & Register)
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },
  
  // Dashboard Route (Protected - Must be defined before redirect)
  {
    path: 'dashboard',
    component: DashboardComponent, 
    canActivate: [authGuard]
  },

  // Lazy-loaded Scholarships Module (Protected by AuthGuard)
  {
    path: 'scholarships',
    loadChildren: () => import('./features/scholarships/scholarships.module').then(m => m.ScholarshipsModule),
    canActivate: [authGuard] 
  },

  // Lazy-loaded Applicants Module (Protected by AuthGuard, typically for Admin/Faculty)
  {
    path: 'applicants',
    loadChildren: () => import('./features/applicants/applicants.module').then(m => m.ApplicantsModule),
    canActivate: [authGuard] 
  },

  // Default path redirects to 'dashboard'
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, 

  // Fallback route (redirects any unknown path back to dashboard)
  { path: '**', redirectTo: 'dashboard' } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }