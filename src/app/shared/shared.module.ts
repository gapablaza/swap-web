import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';

import { MaterialModule } from './material.module';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { SanitizeHtmlPipe, SlugifyPipe } from './pipes';
import { DaysSinceLoginDirective } from './directives';
import { ShareUrlComponent } from './components/share-url/share-url.component';

@NgModule({
  declarations: [
    SanitizeHtmlPipe,
    SlugifyPipe,
    DaysSinceLoginDirective,
    ShareUrlComponent,
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
    ShareUrlComponent,
  ]
})
export class SharedModule { }
