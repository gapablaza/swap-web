import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserCollectionsComponent } from './user-collections/user-collections.component';
import { UserEvaluationsComponent } from './user-evaluations/user-evaluations.component';
import { UserMediaComponent } from './user-media/user-media.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserComponent } from './user.component';

const routes: Routes = [
  {
    path: ':id',
    component: UserComponent,
    children: [
      {
        path: '',
        component: UserProfileComponent,
      },
      {
        path: 'collection',
        component: UserCollectionsComponent,
      },
      {
        path: 'evaluation',
        component: UserEvaluationsComponent,
      },
      {
        path: 'media',
        component: UserMediaComponent,
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
