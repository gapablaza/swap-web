import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';

import { MaterialModule } from './material.module';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { SanitizeHtmlPipe, SlugifyPipe } from './pipes';
import { DaysSinceLoginDirective } from './directives/days-since-login.directive';

@NgModule({
  declarations: [
    SanitizeHtmlPipe,
    SlugifyPipe,
    DaysSinceLoginDirective,
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    MaterialModule,
    FlexLayoutModule,
    LazyLoadImageModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    MaterialModule,
    FlexLayoutModule,
    LazyLoadImageModule,
    SanitizeHtmlPipe,
    SlugifyPipe,
    DaysSinceLoginDirective,
  ]
})
export class SharedModule { }
