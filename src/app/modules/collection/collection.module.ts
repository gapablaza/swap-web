import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { CollectionRoutingModule } from './collection-routing.module';

import { CollectionComponent } from './collection.component';
import { CollectionItemsComponent } from './collection-items/collection-items.component';
import { CollectionMediaComponent } from './collection-media/collection-media.component';
import { CollectionProfileComponent } from './collection-profile/collection-profile.component';
import { CollectionTopsComponent } from './collection-tops/collection-tops.component';
import { CollectionUsersComponent } from './collection-users/collection-users.component';

@NgModule({
  declarations: [
    CollectionComponent,
    CollectionItemsComponent,
    CollectionMediaComponent,
    CollectionProfileComponent,
    CollectionTopsComponent,
    CollectionUsersComponent
  ],
  imports: [
    SharedModule,
    CollectionRoutingModule,
  ]
})
export class CollectionModule { }
