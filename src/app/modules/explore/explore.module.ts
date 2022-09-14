import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared';
import { ExploreRoutingModule } from './explore-routing.module';

import { ExploreComponent } from './explore.component';
import { ExploreCollectionsComponent } from './explore-collections/explore-collections.component';
import { MaterialModule } from 'src/app/shared/material.module';

@NgModule({
  declarations: [
    ExploreComponent,
    ExploreCollectionsComponent
  ],
  imports: [
    SharedModule,
    MaterialModule,
    ExploreRoutingModule,
  ]
})
export class ExploreModule { }
