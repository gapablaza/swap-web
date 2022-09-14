import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared';
import { ItemComponent } from './item.component';
import { ItemRoutingModule } from './item-routing.module';
import { MaterialModule } from 'src/app/shared/material.module';

@NgModule({
  declarations: [
    ItemComponent
  ],
  imports: [
    SharedModule,
    MaterialModule,
    ItemRoutingModule,
  ]
})
export class ItemModule { }
