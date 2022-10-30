import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared';
import { MaterialModule } from 'src/app/shared/material.module';

import { ResetPasswordRoutingModule } from './reset-password-routing.module';
import { ResetPasswordComponent } from './reset-password.component';

@NgModule({
  declarations: [
    ResetPasswordComponent
  ],
  imports: [
    SharedModule,
    MaterialModule,
    ResetPasswordRoutingModule,
  ]
})
export class ResetPasswordModule { }
