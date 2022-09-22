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
import { CollectionManageWishlistComponent } from './collection-manage-wishlist/collection-manage-wishlist.component';
import { CollectionManageTradelistComponent } from './collection-manage-tradelist/collection-manage-tradelist.component';
import { CollectionManageItemsComponent } from './collection-manage-items/collection-manage-items.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { AdsModule } from 'src/app/shared/ads.module';

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
    CollectionManageWishlistComponent,
    CollectionManageTradelistComponent,
    CollectionManageItemsComponent,
  ],
  imports: [
    SharedModule,
    MaterialModule,
    AdsModule,
    CollectionRoutingModule,
  ]
})
export class CollectionModule { }
