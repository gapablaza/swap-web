import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared';
import { AdsModule } from 'src/app/shared/ads.module';
import { MaterialModule } from 'src/app/shared/material.module';
import { LocationGuard } from './location.guard';
import { TradesRoutingModule } from './trades-routing.module';
import { TradesComponent } from './trades.component';

@NgModule({
  declarations: [
    TradesComponent
  ],
  imports: [
    SharedModule,
    MaterialModule,
    AdsModule,
    TradesRoutingModule,
  ],
  providers: [
    LocationGuard
  ]
})
export class TradesModule { }
