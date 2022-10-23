import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared';
import { MaterialModule } from 'src/app/shared/material.module';
import { ModRoutingModule } from './mod-routing.module';

import { ModComponent } from './mod.component';
import { ModMediaComponent } from './mod-media/mod-media.component';

@NgModule({
  declarations: [
    ModComponent,
    ModMediaComponent
  ],
  imports: [
    SharedModule,
    MaterialModule,
    ModRoutingModule,
  ]
})
export class ModModule { }
