import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  ApiService,
  AuthService,
  CollectionService,
  ItemService,
  JwtService,
  MediaService,
  NewCollectionService,
  SearchService,
  SEOService,
  UserService,
} from './services';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [
    ApiService,
    AuthService,
    JwtService,
    SEOService,

    CollectionService,
    ItemService,
    MediaService,
    NewCollectionService,
    SearchService,
    UserService,
  ],
})
export class CoreModule {}
