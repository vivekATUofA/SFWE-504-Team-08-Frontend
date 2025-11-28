import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

@NgModule({
  // the declarations array is removed. We import them directly.
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    LoginComponent,    // Imported as a standalone component
    RegisterComponent  // Imported as a standalone component
  ]
})
export class AuthModule { }