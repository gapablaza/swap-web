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
  UserService
} from './services';
// import { AuthGuard, FBAuthGuard, ModGuard, NoAuthGuard } from './guards';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    // { provide: HTTP_INTERCEPTORS, useClass: HttpTokenInterceptor, multi: true },
    // { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    
    // AuthGuard,
    // FBAuthGuard,
    // ModGuard,
    // NoAuthGuard,
    
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
  ]
})
export class CoreModule { }
