import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared';
import { UserRoutingModule } from './user-routing.module';

import { UserComponent } from './user.component';
import { UserSummaryComponent } from './user-summary/user-summary.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserEvaluationsComponent } from './user-evaluations/user-evaluations.component';
import { UserCollectionsComponent } from './user-collections/user-collections.component';
import { UserCollectionDetailsComponent } from './user-collection-details/user-collection-details.component';
import { UserMediaComponent } from './user-media/user-media.component';
import { UserTradesComponent } from './user-trades/user-trades.component';

@NgModule({
  declarations: [
    UserComponent,
    UserSummaryComponent,
    UserProfileComponent,
    UserEvaluationsComponent,
    UserCollectionsComponent,
    UserCollectionDetailsComponent,
    UserMediaComponent,
    UserTradesComponent,
  ],
  imports: [
    SharedModule,
    UserRoutingModule,
  ],
  entryComponents: [
    UserCollectionDetailsComponent,
  ],
})
export class UserModule { }
