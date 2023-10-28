import { Routes } from '@angular/router';

import { PublisherComponent } from './publisher.component';

export const PUBLISHER_ROUTES: Routes = [
  {
    path: '',
    component: PublisherComponent,
    children: [
      {
        path: '',
        title: 'Listado de Editoriales - Intercambia Láminas',
        loadComponent: () =>
          import('./publisher-list/publisher-list.component').then(
            (c) => c.PublisherListComponent
          ),
      },
      {
        path: ':publisherId/:publisherName',
        title: 'Detalle de la editorial - Intercambia Láminas',
        loadComponent: () =>
          import('./publisher-profile/publisher-profile.component').then(
            (c) => c.PublisherProfileComponent
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];

export default PUBLISHER_ROUTES;
