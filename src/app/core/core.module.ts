import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  ApiService,
  AuthenticationService,
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
import { UIService } from '../shared';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [
    ApiService,
    AuthenticationService,
    JwtService,
    SEOService,
    UIService,

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
