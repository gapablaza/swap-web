import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';

import { authorizedGuard, moderatorGuard } from 'src/app/core';
import { ModComponent } from './mod.component';
import { modFeature } from './store/mod.state';
import { ModEffects } from './store/mod.effects';

export const MOD_ROUTES: Routes = [
  {
    path: '',
    providers: [provideState(modFeature), provideEffects(ModEffects)],
    component: ModComponent,
    canActivate: [authorizedGuard, moderatorGuard],
    children: [
      {
        path: 'media',
        title: 'Moderar elementos multimedia - Intercambia Láminas',
        loadComponent: () =>
          import('./mod-media/mod-media.component').then(
            (c) => c.ModMediaComponent
          ),
      },
      {
        path: 'publish',
        title: 'Publicar nuevas colecciones - Intercambia Láminas',
        loadComponent: () =>
          import('./mod-publish/mod-publish.component').then(
            (c) => c.ModPublishComponent
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];

export default MOD_ROUTES;
