import { Routes } from '@angular/router';

import { UserComponent } from './user.component';
import { UserResolver } from './user-resolver.service';
import { userFeature } from './store/user.state';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { UserEffects } from './store/user.effects';
import { userGuard } from './user.guard';

export const USER_ROUTES: Routes = [
  {
    path: ':id',
    providers: [
      UserResolver,
      provideState(userFeature),
      provideEffects(UserEffects),
    ],
    component: UserComponent,
    resolve: {
      userData: UserResolver,
    },
    children: [
      {
        path: '',
        title: 'Perfil de Usuario - Intercambia Láminas',
        loadComponent: () =>
          import('./user-profile/user-profile.component').then(
            (c) => c.UserProfileComponent
          ),
      },
      {
        path: 'collection',
        title: 'Perfil de Usuario - Colecciones - Intercambia Láminas',
        loadComponent: () =>
          import('./user-collections/user-collections.component').then(
            (c) => c.UserCollectionsComponent
          ),
      },
      {
        path: 'evaluation',
        title: 'Perfil de Usuario - Evaluaciones - Intercambia Láminas',
        loadComponent: () =>
          import('./user-evaluations/user-evaluations.component').then(
            (c) => c.UserEvaluationsComponent
          ),
        // canActivate: [userGuard],
        // providers: [UserResolver],
        // resolve: {
        //   userData: UserResolver,
        // },
      },
      {
        path: 'media',
        title: 'Perfil de Usuario - Multimedia - Intercambia Láminas',
        loadComponent: () =>
          import('./user-media/user-media.component').then(
            (c) => c.UserMediaComponent
          ),
      },
      {
        path: '**',
        redirectTo: '',
      },
    ],
  },
];
