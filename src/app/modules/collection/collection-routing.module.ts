import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from 'src/app/core';
import { CollectionComponent } from './collection.component';
import { CollectionProfileComponent } from './collection-profile/collection-profile.component';
import { CollectionItemsComponent } from './collection-items/collection-items.component';
import { CollectionUsersComponent } from './collection-users/collection-users.component';
import { CollectionMediaComponent } from './collection-media/collection-media.component';
import { CollectionTopsComponent } from './collection-tops/collection-tops.component';
import { CollectionManageComponent } from './collection-manage/collection-manage.component';

const routes: Routes = [
  {
    path: ':name/:id',
    component: CollectionComponent,
    children: [
      {
        path: '',
        component: CollectionProfileComponent,
        title: 'Resumen Colección - Intercambia Láminas',
      },
      {
        path: 'items',
        component: CollectionItemsComponent,
        title: 'Detalle Colección - Itemizado - Intercambia Láminas',
      },
      {
        path: 'media',
        component: CollectionMediaComponent,
        title: 'Detalle Colección - Multimedia - Intercambia Láminas',
      },
      {
        path: 'users',
        component: CollectionUsersComponent,
        title: 'Detalle Colección - Usuarios - Intercambia Láminas',
      },
      {
        path: 'tops',
        component: CollectionTopsComponent,
        canActivate: [AuthGuard],
        title: 'Detalle Colección - TOPs - Intercambia Láminas',
      },
      {
        path: 'manage',
        component: CollectionManageComponent,
        canActivate: [AuthGuard],
        title: 'Gestionar Colección - Intercambia Láminas',
      },
      {
        path: '**',
        redirectTo: '',
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CollectionRoutingModule { }
