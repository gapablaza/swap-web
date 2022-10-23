import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  ApiService,
  AuthService,
  CollectionService,
  ItemService,
  JwtService,
  MediaService,
  SearchService,
  UserService
} from './services';
import { AuthGuard, FBAuthGuard, ModGuard, NoAuthGuard } from './guards';
import { ErrorInterceptor, HttpTokenInterceptor } from './interceptors';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpTokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    AuthGuard,
    ApiService,
    AuthService,
    CollectionService,
    FBAuthGuard,
    ItemService,
    JwtService,
    MediaService,
    ModGuard,
    NoAuthGuard,
    SearchService,
    UserService,
  ]
})
export class CoreModule { }
