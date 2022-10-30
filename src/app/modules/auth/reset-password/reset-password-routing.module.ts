import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NoAuthGuard } from 'src/app/core';

import { ResetPasswordComponent } from './reset-password.component';

const routes: Routes = [
  {
    path: '',
    component: ResetPasswordComponent,
    canActivate: [NoAuthGuard],
    title: 'Resetear contraseña - Intercambia Láminas',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResetPasswordRoutingModule {}
