import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CollectionItemsComponent } from './collection-items/collection-items.component';
import { CollectionMediaComponent } from './collection-media/collection-media.component';
import { CollectionProfileComponent } from './collection-profile/collection-profile.component';
import { CollectionTopsComponent } from './collection-tops/collection-tops.component';
import { CollectionUsersComponent } from './collection-users/collection-users.component';

import { CollectionComponent } from './collection.component';

const routes: Routes = [
  {
    path: ':name/:id',
    component: CollectionComponent,
    // component: CollectionProfileComponent,
    children: [
      {
        path: '',
        component: CollectionProfileComponent,
      },
      {
        path: 'items',
        component: CollectionItemsComponent,
      },
      {
        path: 'media',
        component: CollectionMediaComponent,
      },
      {
        path: 'users',
        component: CollectionUsersComponent,
      },
      {
        path: 'tops',
        component: CollectionTopsComponent,
      },
      // {
      //   path: '**',
      //   redirectTo: '',
      // }
    ]
  },
  // {
  //   path: ':name/:id/items',
  //   component: CollectionItemsComponent,
  // },
  // {
  //   path: ':name/:id/media',
  //   component: CollectionMediaComponent,
  // },
  // {
  //   path: ':name/:id/users',
  //   component: CollectionUsersComponent,
  // },
  // {
  //   path: ':name/:id/tops',
  //   component: CollectionTopsComponent,
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CollectionRoutingModule { }
