import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared';
import { ItemComponent } from './item.component';
import { ItemRoutingModule } from './item-routing.module';

@NgModule({
  declarations: [
    ItemComponent
  ],
  imports: [
    SharedModule,
    ItemRoutingModule,
  ]
})
export class ItemModule { }
