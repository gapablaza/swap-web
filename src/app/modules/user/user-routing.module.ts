import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserCollectionsComponent } from './user-collections/user-collections.component';
import { UserEvaluationsComponent } from './user-evaluations/user-evaluations.component';
import { UserMediaComponent } from './user-media/user-media.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserResolver } from './user-resolver.service';
import { UserComponent } from './user.component';

const routes: Routes = [
  {
    path: ':id',
    component: UserComponent,
    resolve: {
      userData: UserResolver
    },
    children: [
      {
        path: '',
        component: UserProfileComponent,
        title: 'Perfil de Usuario - Intercambia Láminas'
      },
      {
        path: 'collection',
        component: UserCollectionsComponent,
        title: 'Perfil de Usuario - Colecciones - Intercambia Láminas'
      },
      {
        path: 'evaluation',
        component: UserEvaluationsComponent,
        title: 'Perfil de Usuario - Evaluaciones - Intercambia Láminas'
      },
      {
        path: 'media',
        component: UserMediaComponent,
        title: 'Perfil de Usuario - Multimedia - Intercambia Láminas'
      },
      {
        path: '**',
        redirectTo: '',
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
