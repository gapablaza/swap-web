import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
// import { provideAuth, getAuth } from '@angular/fire/auth';

import { AuthRoutingModule } from './auth-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { MaterialModule } from 'src/app/shared/material.module';

@NgModule({
  declarations: [
    SignupComponent,
    LoginComponent
  ],
  imports: [
    ReactiveFormsModule,
    // provideAuth(() => getAuth()),
    SharedModule,
    MaterialModule,
    AuthRoutingModule,
  ]
})
export class AuthModule { }
