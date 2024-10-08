import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';

import { authorizedGuard, unauthorizedGuard } from './core';
import { locatedGuard } from './modules/trades/located.guard';
import { ItemResolver } from './modules/item/item-resolver.service';
import { TradesResolver } from './modules/trades/trades-resolver.service';
import { itemFeature } from './modules/item/store/item.state';
import { ItemEffects } from './modules/item/store/item.effect';
import { OfflineComponent } from './modules/offline/offline.component';

export const APP_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./modules/home/home.component').then((c) => c.HomeComponent),
  },
  {
    path: 'login',
    title: 'Ingresar - Intercambia Láminas',
    canActivate: [unauthorizedGuard],
    loadComponent: () =>
      import('./modules/auth/login/login.component').then(
        (c) => c.LoginComponent
      ),
  },
  {
    path: 'signup',
    title: 'Regístrate - Intercambia Láminas',
    canActivate: [unauthorizedGuard],
    loadComponent: () =>
      import('./modules/auth/signup/signup.component').then(
        (c) => c.SignupComponent
      ),
  },
  {
    path: 'forgot-password',
    title: 'Resetear contraseña - Intercambia Láminas',
    canActivate: [unauthorizedGuard],
    loadComponent: () =>
      import('./modules/auth/reset-password/reset-password.component').then(
        (c) => c.ResetPasswordComponent
      ),
  },
  {
    path: 'new-password',
    title: 'Configura una nueva contraseña - Intercambia Láminas',
    canActivate: [unauthorizedGuard],
    loadComponent: () =>
      import('./modules/auth/new-password/new-password.component').then(
        (c) => c.NewPasswordComponent
      ),
  },
  {
    path: 'collections',
    title: 'Explorar Colecciones - Intercambia Láminas',
    loadComponent: () =>
      import(
        './modules/explore/explore-collections/explore-collections.component'
      ).then((c) => c.ExploreCollectionsComponent),
  },
  {
    path: 'c',
    loadChildren: () =>
      import('./modules/collection/').then((m) => m.COLLECTION_ROUTES),
  },
  {
    path: 'item/:id',
    providers: [
      ItemResolver,
      provideState(itemFeature),
      provideEffects(ItemEffects),
    ],
    title: 'Detalle ítem - Intercambia Láminas',
    loadComponent: () =>
      import('./modules/item/item.component').then((c) => c.ItemComponent),
    resolve: {
      itemData: ItemResolver,
    },
  },
  {
    path: 'user',
    loadChildren: () => import('./modules/user/').then((m) => m.USER_ROUTES),
  },
  {
    path: 'publishers',
    loadChildren: () =>
      import('./modules/publisher/').then((m) => m.PUBLISHER_ROUTES),
  },
  {
    path: 'search',
    title: 'Búsqueda - Intercambia Láminas',
    loadComponent: () =>
      import('./modules/search/search.component').then(
        (c) => c.SearchComponent
      ),
  },
  // {
  //   path: 'offline',
  //   title: 'Contenido sin conexión - Intercambia Láminas',
  //   canActivate: [authorizedGuard],
  //   loadComponent: () =>
  //     import('./modules/offline/offline.component').then(
  //       (c) => c.OfflineComponent
  //     ),
  // },
  {
    path: 'offline',
    title: 'Contenido sin conexión - Intercambia Láminas',
    canActivate: [authorizedGuard],
    component: OfflineComponent
  },
  {
    path: 'trades',
    title: 'Posibles Cambios - Intercambia Láminas',
    canActivate: [authorizedGuard, locatedGuard],
    loadComponent: () =>
      import('./modules/trades/trades.component').then(
        (c) => c.TradesComponent
      ),
    resolve: {
      incompleteCollections: TradesResolver,
    },
    providers: [TradesResolver],
  },
  {
    path: 'message',
    loadChildren: () =>
      import('./modules/message/').then((m) => m.MESSAGE_ROUTES),
  },
  {
    path: 'settings',
    loadChildren: () =>
      import('./modules/settings/').then((m) => m.SETTINGS_ROUTE),
  },
  {
    path: 'p',
    loadChildren: () => import('./modules/pages/').then((m) => m.PAGES_ROUTES),
  },
  {
    path: 'mod',
    loadChildren: () => import('./modules/mod/').then((m) => m.MOD_ROUTES),
  },
  {
    path: 'collaborate',
    title: 'Colabora - Intercambia Láminas',
    canActivate: [authorizedGuard],
    loadComponent: () =>
      import('./modules/collaborate/collaborate.component').then(
        (c) => c.CollaborateComponent
      ),
  },
  {
    path: 'new-collection',
    loadChildren: () =>
      import('./modules/new-collection/').then((m) => m.NEW_COLLECTION_ROUTES),
  },
  {
    path: '**',
    pathMatch: 'full',
    title: 'Página no encontrada - Error 404 - Intercambia Láminas',
    loadComponent: () =>
      import('./modules/navigation/custom-error/custom-error.component').then(
        (c) => c.CustomErrorComponent
      ),
  },
];

export default APP_ROUTES;
