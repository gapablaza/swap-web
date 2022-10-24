import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core';

import { CollaborateComponent } from './collaborate.component';

const routes: Routes = [
  {
    path: '',
    component: CollaborateComponent,
    canActivate: [AuthGuard],
    title: 'Colabora - Intercambia Láminas',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CollaborateRoutingModule {}
