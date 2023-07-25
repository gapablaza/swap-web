import { NgModule } from '@angular/core';

import { MaterialModule } from 'src/app/shared/material.module';
import { SignupRoutingModule } from './signup-routing.module';
import { SharedModule, SocialModule } from 'src/app/shared';
import { SignupComponent } from './signup.component';
import { GoogleSigninButtonModule } from '@abacritt/angularx-social-login';

@NgModule({
  declarations: [
    SignupComponent,
  ],
  imports: [
    SharedModule,
    SocialModule,
    GoogleSigninButtonModule,
    MaterialModule,
    SignupRoutingModule,
  ]
})
export class SignupModule { }
