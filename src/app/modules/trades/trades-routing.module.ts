import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from 'src/app/core';
import { LocationGuard } from './location.guard';
import { TradesResolver } from './trades-resolver.service';
import { TradesComponent } from './trades.component';

const routes: Routes = [
    {
      path: '',
      component: TradesComponent,
      canActivate: [AuthGuard, LocationGuard],
      resolve: {
        incompleteCollections: TradesResolver
      },
      title: 'Posibles Cambios - Intercambia Láminas'
    },
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class TradesRoutingModule { }