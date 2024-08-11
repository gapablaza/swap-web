import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';

import { enabledUserGuard } from 'src/app/core';
import { NewCollectionComponent } from './new-collection.component';
import { newCollectionFeature } from './store/new-collection.state';
import { NewCollectionEffects } from './store/new-collection.effects';

export const NEW_COLLECTION_ROUTES: Routes = [
  {
    path: '',
    providers: [
      provideState(newCollectionFeature),
      provideEffects(NewCollectionEffects),
    ],
    component: NewCollectionComponent,
    canActivate: [enabledUserGuard],
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
