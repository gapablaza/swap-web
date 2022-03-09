import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared';
import { UserRoutingModule } from './user-routing.module';

import { UserComponent } from './user.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserEvaluationsComponent } from './user-evaluations/user-evaluations.component';
import { UserMediaComponent } from './user-media/user-media.component';
import { UserCollectionsComponent } from './user-collections/user-collections.component';
import { UserTradesComponent } from './user-trades/user-trades.component';
import { UserCollectionDetailsComponent } from './user-collection-details/user-collection-details.component';

@NgModule({
  declarations: [
    UserProfileComponent,
    UserEvaluationsComponent,
    UserMediaComponent,
    UserCollectionsComponent,
    UserTradesComponent,
    UserCollectionDetailsComponent,
    UserComponent
  ],
  imports: [
    SharedModule,
    UserRoutingModule,
  ]
})
export class UserModule { }
