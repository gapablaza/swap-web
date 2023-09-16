import { Routes } from '@angular/router';

import { ExploreComponent } from './explore.component';

export const EXPLORE_ROUTES: Routes = [
  {
    path: '',
    component: ExploreComponent,
    children: [
      {
        path: 'collections',
        title: 'Explorar Colecciones - Intercambia Láminas',
        loadComponent: () =>
          import('./explore-collections/explore-collections.component').then(
            (c) => c.ExploreCollectionsComponent
          ),
      },
      //   {
      //     path: 'users',
      //     component: CollectionItemsComponent,
      //   },
      //   {
      //     path: 'publishers',
      //     component: CollectionMediaComponent,
      //   },
    ],
  },
];

export default EXPLORE_ROUTES;
