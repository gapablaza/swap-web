import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { AdsenseModule } from 'ng2-adsense';
import { MaterialModule } from './material.module';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { SanitizeHtmlPipe, SlugifyPipe } from './pipes';
import { DaysSinceLoginDirective, LongPressDirective } from './directives';
import { ShareUrlComponent } from './components/share-url/share-url.component';
import { CollectionItemComponent } from './components/collection-item/collection-item.component';

@NgModule({
  declarations: [
    SanitizeHtmlPipe,
    SlugifyPipe,
    DaysSinceLoginDirective,
    LongPressDirective,
    ShareUrlComponent,
    CollectionItemComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    MaterialModule,
    LazyLoadImageModule,
    AdsenseModule.forRoot({
      adClient: 'ca-pub-6782496264167512',
    }),
  ],
  exports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    MaterialModule,
    LazyLoadImageModule,
    AdsenseModule,
    SanitizeHtmlPipe,
    SlugifyPipe,
    DaysSinceLoginDirective,
    LongPressDirective,
    CollectionItemComponent,
    ShareUrlComponent,
  ]
})
export class SharedModule { }
