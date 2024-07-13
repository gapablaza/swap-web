import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';

import { PublisherComponent } from './publisher.component';
import { publisherFeature } from './store/publisher.state';
import { PublisherEffects } from './store/publisher.effect';

export const PUBLISHER_ROUTES: Routes = [
  {
    path: '',
    providers: [
      provideState(publisherFeature),
      provideEffects(PublisherEffects),
    ],
    component: PublisherComponent,
    children: [
      {
        path: '',
        title: 'Listado de Editoriales - Intercambia Láminas',
        loadComponent: () =>
          import('./publisher-all/publisher-all.component').then(
            (c) => c.PublisherAllComponent
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
