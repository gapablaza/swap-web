import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NoAuthGuard } from 'src/app/core';
import { NewPasswordComponent } from './new-password.component';

const routes: Routes = [
  {
    path: '',
    component: NewPasswordComponent,
    canActivate: [NoAuthGuard],
    title: 'Configura una nueva contraseña - Intercambia Láminas',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewPasswordRoutingModule {}
