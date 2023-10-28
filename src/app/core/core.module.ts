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
  PublisherService,
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
    PublisherService,
    SearchService,
    UserService,
  ],
})
export class CoreModule {}
