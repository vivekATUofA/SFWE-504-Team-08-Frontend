import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; // Provides *ngIf and NgClass
import { AuthService } from '../../../../../src/app/core/services/auth.service';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  // Removed 'styleUrls' to resolve the file not found error.
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    FooterComponent
  ]
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  loading = false;
  errorMessage: string | null = null;
  message: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void { }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  register(): void {
    this.errorMessage = null;
    this.message = null;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    this.authService.register(this.form.value).subscribe({
      next: () => {
        this.loading = false;
        this.message = 'Registration successful! You can now log in.';
        this.form.reset();
        setTimeout(() => this.router.navigate(['/auth/login']), 2000);
      },
      error: (err: any) => { 
        this.loading = false;
        this.errorMessage = err.error?.message || 'Registration failed. The email may already be in use.';
        console.error('Registration Error:', err);
      }
    });
  }
}