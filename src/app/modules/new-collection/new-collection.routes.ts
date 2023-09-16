import { Routes } from '@angular/router';

import { authorizedGuard } from 'src/app/core';
import { NewCollectionComponent } from './new-collection.component';

export const NEW_COLLECTION_ROUTES: Routes = [
  {
    path: '',
    component: NewCollectionComponent,
    canActivate: [authorizedGuard],
    children: [
      {
        path: '',
        title:
          'Solicitudes para agregar nuevas colecciones - Intercambia Láminas',
        loadComponent: () =>
          import('./new-collection-list/new-collection-list.component').then(
            (c) => c.NewCollectionListComponent
          ),
      },
      {
        path: 'add',
        title: 'Agregar solicitud de nueva colección - Intercambia Láminas',
        loadComponent: () =>
          import('./new-collection-add/new-collection-add.component').then(
            (c) => c.NewCollectionAddComponent
          ),
      },
      {
        path: ':id',
        title: 'Detalles solicitud de nueva colección - Intercambia Láminas',
        loadComponent: () =>
          import(
            './new-collection-profile/new-collection-profile.component'
          ).then((c) => c.NewCollectionProfileComponent),
      },
      {
        path: ':id/edit',
        title:
          'Editar detalles solicitud de nueva colección - Intercambia Láminas',
        loadComponent: () =>
          import('./new-collection-add/new-collection-add.component').then(
            (c) => c.NewCollectionAddComponent
          ),
      },
      {
        path: ':id/add-checklist',
        title:
          'Proponer itemizado a solicitud de nueva colección - Intercambia Láminas',
        loadComponent: () =>
          import('./new-checklist/new-checklist.component').then(
            (c) => c.NewChecklistComponent
          ),
      },
      {
        path: '**',
        redirectTo: '',
      },
    ],
  },
];

export default NEW_COLLECTION_ROUTES;
