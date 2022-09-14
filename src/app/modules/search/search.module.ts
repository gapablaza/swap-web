import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared';
import { SearchRoutingModule } from './search-routing.module';

import { SearchComponent } from './search.component';
import { SearchCollectionComponent } from './search-collection/search-collection.component';
import { SearchUserComponent } from './search-user/search-user.component';
import { MaterialModule } from 'src/app/shared/material.module';

@NgModule({
  declarations: [
    SearchComponent,
    SearchCollectionComponent,
    SearchUserComponent
  ],
  imports: [
    SharedModule,
    MaterialModule,
    SearchRoutingModule,
  ]
})
export class SearchModule { }
