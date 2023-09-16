import { Routes } from '@angular/router';
import { UserComponent } from './user.component';
import { UserResolver } from './user-resolver.service';

export const USER_ROUTES: Routes = [
  {
    path: ':id',
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
        //   component: UserProfileComponent,
      },
      {
        path: 'collection',
        title: 'Perfil de Usuario - Colecciones - Intercambia Láminas',
        loadComponent: () =>
          import('./user-collections/user-collections.component').then(
            (c) => c.UserCollectionsComponent
          ),
        //   component: UserCollectionsComponent,
      },
      {
        path: 'evaluation',
        title: 'Perfil de Usuario - Evaluaciones - Intercambia Láminas',
        loadComponent: () =>
          import('./user-evaluations/user-evaluations.component').then(
            (c) => c.UserEvaluationsComponent
          ),
        //   component: UserEvaluationsComponent,
      },
      {
        path: 'media',
        title: 'Perfil de Usuario - Multimedia - Intercambia Láminas',
        loadComponent: () =>
          import('./user-media/user-media.component').then(
            (c) => c.UserMediaComponent
          ),
        //   component: UserMediaComponent,
      },
      {
        path: '**',
        redirectTo: '',
      },
    ],
  },
];
