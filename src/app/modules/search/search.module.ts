import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared';
import { SearchRoutingModule } from './search-routing.module';

import { SearchComponent } from './search.component';
import { SearchCollectionComponent } from './search-collection/search-collection.component';
import { SearchUserComponent } from './search-user/search-user.component';

@NgModule({
  declarations: [
    SearchComponent,
    SearchCollectionComponent,
    SearchUserComponent
  ],
  imports: [
    SharedModule,
    SearchRoutingModule,
  ]
})
export class SearchModule { }
