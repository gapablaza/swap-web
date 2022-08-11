import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { CollectionRoutingModule } from './collection-routing.module';

import { CollectionComponent } from './collection.component';
import { CollectionSummaryComponent } from './collection-summary/collection-summary.component';
import { CollectionProfileComponent } from './collection-profile/collection-profile.component';
import { CollectionItemsComponent } from './collection-items/collection-items.component';
import { CollectionUsersComponent } from './collection-users/collection-users.component';
import { CollectionMediaComponent } from './collection-media/collection-media.component';
import { CollectionTopsComponent } from './collection-tops/collection-tops.component';
import { CollectionManageComponent } from './collection-manage/collection-manage.component';

@NgModule({
  declarations: [
    CollectionComponent,
    CollectionSummaryComponent,
    CollectionProfileComponent,
    CollectionItemsComponent,
    CollectionUsersComponent,
    CollectionMediaComponent,
    CollectionTopsComponent,
    CollectionManageComponent,
  ],
  imports: [
    SharedModule,
    CollectionRoutingModule,
  ]
})
export class CollectionModule { }
