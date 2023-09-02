import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from 'src/app/core';

import { NewCollectionComponent } from './new-collection.component';
import { NewCollectionAddComponent } from './new-collection-add/new-collection-add.component';
import { NewCollectionProfileComponent } from './new-collection-profile/new-collection-profile.component';
import { NewCollectionListComponent } from './new-collection-list/new-collection-list.component';
import { NewChecklistComponent } from './new-checklist/new-checklist.component';

const routes: Routes = [
  {
    path: '',
    component: NewCollectionComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: NewCollectionListComponent,
        title: 'Solicitudes para agregar nuevas colecciones - Intercambia Láminas',
      },
      {
        path: 'add',
        component: NewCollectionAddComponent,
        title: 'Agregar solicitud de nueva colección - Intercambia Láminas',
      },
      {
        path: ':id',
        component: NewCollectionProfileComponent,
        title: 'Detalles solicitud de nueva colección - Intercambia Láminas',
      },
      {
        path: ':id/edit',
        component: NewCollectionAddComponent,
        title: 'Editar detalles solicitud de nueva colección - Intercambia Láminas',
      },
      {
        path: ':id/add-checklist',
        component: NewChecklistComponent,
        title: 'Proponer itemizado a solicitud de nueva colección - Intercambia Láminas',
      },
      {
        path: '**',
        redirectTo: '',
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewCollectionRoutingModule {}
