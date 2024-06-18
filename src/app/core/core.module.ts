import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  ApiService,
  AuthenticationService,
  AuthService,
  CollectionService,
  ItemService,
  JwtService,
  MediaService,
  MessageService,
  NewCollectionService,
  PublisherService,
  ReportService,
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
    AuthenticationService,
    JwtService,
    SEOService,

    CollectionService,
    ItemService,
    MediaService,
    MessageService,
    NewCollectionService,
    PublisherService,
    ReportService,
    SearchService,
    UserService,
  ],
})
export class CoreModule {}
