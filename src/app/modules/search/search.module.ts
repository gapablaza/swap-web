import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared';
import { SearchRoutingModule } from './search-routing.module';

import { SearchComponent } from './search.component';
import { SearchCollectionComponent } from './search-collection/search-collection.component';
import { SearchUserComponent } from './search-user/search-user.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { AdsModule } from 'src/app/shared/ads.module';

@NgModule({
  declarations: [
    SearchComponent,
    SearchCollectionComponent,
    SearchUserComponent
  ],
  imports: [
    SharedModule,
    MaterialModule,
    AdsModule,
    SearchRoutingModule,
  ]
})
export class SearchModule { }
