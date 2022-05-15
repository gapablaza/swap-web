import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ExploreCollectionsComponent } from './explore-collections/explore-collections.component';
import { ExploreComponent } from './explore.component';

const routes: Routes = [
  {
    path: '',
    component: ExploreComponent,
    children: [
      {
        path: 'collections',
        component: ExploreCollectionsComponent,
      },
    //   {
    //     path: 'users',
    //     component: CollectionItemsComponent,
    //   },
    //   {
    //     path: 'publishers',
    //     component: CollectionMediaComponent,
    //   },
      // {
      //   path: '**',
      //   redirectTo: '',
      // }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExploreRoutingModule { }
