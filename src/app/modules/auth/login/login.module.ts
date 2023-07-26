import { NgModule } from '@angular/core';

import { LoginRoutingModule } from './login-routing.module';
import { MaterialModule } from 'src/app/shared/material.module';
import { SharedModule, SocialModule } from 'src/app/shared';
import { LoginComponent } from './login.component';
import { GoogleSigninButtonModule } from '@abacritt/angularx-social-login';

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    SharedModule,
    SocialModule,
    GoogleSigninButtonModule,
    MaterialModule,
    LoginRoutingModule,
  ]
})
export class LoginModule { }
