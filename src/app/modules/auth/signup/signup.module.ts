import { NgModule } from '@angular/core';

import { MaterialModule } from 'src/app/shared/material.module';
import { SignupRoutingModule } from './signup-routing.module';
import { SharedModule, SocialModule } from 'src/app/shared';
import { SignupComponent } from './signup.component';

@NgModule({
  declarations: [
    SignupComponent,
  ],
  imports: [
    SharedModule,
    SocialModule,
    MaterialModule,
    SignupRoutingModule,
  ]
})
export class SignupModule { }
