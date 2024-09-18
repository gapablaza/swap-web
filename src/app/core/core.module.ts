import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  ApiService,
  AuthenticationService,
  CollectionService,
  ConnectionService,
  ItemService,
  JwtService,
  MediaService,
  MessageService,
  NewCollectionService,
  OfflineService,
  PublisherService,
  ReportService,
  SearchService,
  SEOService,
  UserPersistenceService,
  UserService,
} from './services';
import { UIService } from '../shared';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [
    ApiService,
    AuthenticationService,
    ConnectionService,
    JwtService,
    OfflineService,
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
    UserPersistenceService,
    UserService,
  ],
})
export class CoreModule {}
