import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router,  RouterModule} from '@angular/router';
import { CommonModule } from '@angular/common'; // Provides *ngIf and NgClass
import { AuthService } from '../../../../../src/app/core/services/auth.service';
import { FooterComponent } from '../../../shared/components/footer/footer.component';


@Component({
  selector: 'app-login',
  standalone: true, 
  templateUrl: './login.component.html',
  // Removed 'styleUrls' to resolve the file not found error.
  imports: [
    CommonModule,        
    ReactiveFormsModule,
    RouterModule ,
    FooterComponent  
  ]
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  loading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/scholarships']);
    }

    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void { }

  login(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = null;

    this.authService.login(this.form.value).subscribe({
      next: () => {
        this.router.navigate(['/scholarships']);
      },
      error: (err: any) => { 
        this.loading = false;
        this.errorMessage = err.error?.message || 'Login failed. Check your credentials.';
        console.error('Login Error:', err);
      }
    });
  }
}