import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard'; // Will use this later

const routes: Routes = [
  // Default path redirects to the Scholarship list if logged in
  { path: '', redirectTo: 'scholarships', pathMatch: 'full' },

  // Lazy-loaded Authentication Module (Login & Register)
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },

  // Lazy-loaded Scholarships Module (Protected by AuthGuard)
  {
    path: 'scholarships',
    loadChildren: () => import('./features/scholarships/scholarships.module').then(m => m.ScholarshipsModule),
    canActivate: [authGuard] // Route protection placeholder
  },

  // Lazy-loaded Applicants Module (Protected by AuthGuard, typically for Admin/Faculty)
  {
    path: 'applicants',
    loadChildren: () => import('./features/applicants/applicants.module').then(m => m.ApplicantsModule),
    canActivate: [authGuard] // Route protection placeholder
  },

  // Fallback route (e.g., a Not Found page)
  { path: '**', redirectTo: 'scholarships' } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }