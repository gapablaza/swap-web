import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ItemComponent } from './item.component';
import { ItemResolver } from './item-resolver.service';

const routes: Routes = [
    {
      path: ':id',
      component: ItemComponent,
      title: 'Detalle ítem - Intercambia Láminas',
      resolve: {
          itemData: ItemResolver
      }
    },
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class ItemRoutingModule { }