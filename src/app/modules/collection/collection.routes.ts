import { Routes } from '@angular/router';

import { authorizedGuard } from 'src/app/core';
import { CollectionComponent } from './collection.component';
import { CollectionResolver } from './collection-resolver.service';

export const COLLECTION_ROUTES: Routes = [
  {
    path: ':name/:id',
    component: CollectionComponent,
    resolve: {
      collectionData: CollectionResolver,
    },
    children: [
      {
        path: '',
        title: 'Resumen Colección - Intercambia Láminas',
        loadComponent: () =>
          import('./collection-profile/collection-profile.component').then(
            (c) => c.CollectionProfileComponent
          ),
      },
      {
        path: 'items',
        title: 'Detalle Colección - Itemizado - Intercambia Láminas',
        loadComponent: () =>
          import('./collection-items/collection-items.component').then(
            (c) => c.CollectionItemsComponent
          ),
      },
      {
        path: 'media',
        title: 'Detalle Colección - Multimedia - Intercambia Láminas',
        loadComponent: () =>
          import('./collection-media/collection-media.component').then(
            (c) => c.CollectionMediaComponent
          ),
      },
      {
        path: 'users',
        title: 'Detalle Colección - Usuarios - Intercambia Láminas',
        loadComponent: () =>
          import('./collection-users/collection-users.component').then(
            (c) => c.CollectionUsersComponent
          ),
      },
      {
        path: 'tops',
        canActivate: [authorizedGuard],
        title: 'Detalle Colección - TOPs - Intercambia Láminas',
        loadComponent: () =>
          import('./collection-tops/collection-tops.component').then(
            (c) => c.CollectionTopsComponent
          ),
      },
      {
        path: 'manage',
        canActivate: [authorizedGuard],
        title: 'Gestionar Colección - Intercambia Láminas',
        loadComponent: () =>
          import('./collection-manage/collection-manage.component').then(
            (c) => c.CollectionManageComponent
          ),
        children: [
          {
            path: '',
            title: 'Gestionar Colección - Listado - Intercambia Láminas',
            loadComponent: () =>
              import(
                './collection-manage-items/collection-manage-items.component'
              ).then((c) => c.CollectionManageItemsComponent),
          },
          {
            path: 'wishlist',
            title: 'Gestionar Colección - Buscadas - Intercambia Láminas',
            loadComponent: () =>
              import(
                './collection-manage-wishlist/collection-manage-wishlist.component'
              ).then((c) => c.CollectionManageWishlistComponent),
          },
          {
            path: 'tradelist',
            title: 'Gestionar Colección - Cambiando - Intercambia Láminas',
            loadComponent: () =>
              import(
                './collection-manage-tradelist/collection-manage-tradelist.component'
              ).then((c) => c.CollectionManageTradelistComponent),
          },
        ],
      },
      {
        path: '**',
        redirectTo: '',
      },
    ],
  },
];

export default COLLECTION_ROUTES;
