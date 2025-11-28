import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

@NgModule({
  // Standalone components cannot be declared.
  // declarations: [ 
  //   LoginComponent, 
  //   RegisterComponent 
  // ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    
    // CRITICAL FIX: Standalone components must be imported
    LoginComponent, 
    RegisterComponent,

    // Routing and general module imports
    AuthRoutingModule,
    RouterModule 
  ]
})
export class AuthModule { }