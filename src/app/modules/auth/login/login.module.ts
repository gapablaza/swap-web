import { NgModule } from '@angular/core';

import { LoginRoutingModule } from './login-routing.module';
import { MaterialModule } from 'src/app/shared/material.module';
import { SharedModule, SocialModule } from 'src/app/shared';
import { LoginComponent } from './login.component';

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    SharedModule,
    SocialModule,
    MaterialModule,
    LoginRoutingModule,
  ]
})
export class LoginModule { }
