import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

const routes: Routes = [
  {
    path: 'signup',
    component: SignupComponent,
    title: 'Regístrate - Intercambia Láminas',
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Ingresar - Intercambia Láminas',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
