import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared';
import { MaterialModule } from 'src/app/shared/material.module';

import { NewPasswordRoutingModule } from './new-password-routing.module';
import { NewPasswordComponent } from './new-password.component';

@NgModule({
  declarations: [
    NewPasswordComponent
  ],
  imports: [
    SharedModule,
    MaterialModule,
    NewPasswordRoutingModule,
  ]
})
export class NewPasswordModule { }
