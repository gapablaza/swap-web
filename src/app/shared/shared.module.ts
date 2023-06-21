import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

// import { AdsenseModule } from 'ng2-adsense';
// import { MaterialModule } from './material.module';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { LightboxModule } from 'ng-gallery/lightbox';

import { SanitizeHtmlPipe, SlugifyPipe } from './pipes';
import {
  DaysSinceLoginDirective,
  GoogleButtonDirective,
  LongPressDirective,
  OldLongPressDirective,
} from './directives';
import { ShareUrlComponent } from './components/share-url/share-url.component';
import { CollectionItemComponent } from './components/collection-item/collection-item.component';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    SanitizeHtmlPipe,
    SlugifyPipe,
    DaysSinceLoginDirective,
    GoogleButtonDirective,
    LongPressDirective,
    OldLongPressDirective,
    ShareUrlComponent,
    CollectionItemComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    // MaterialModule,
    MatListModule,
    MatIconModule,
    LazyLoadImageModule,
    LightboxModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    // MaterialModule,
    LazyLoadImageModule,
    LightboxModule,
    SanitizeHtmlPipe,
    SlugifyPipe,
    DaysSinceLoginDirective,
    GoogleButtonDirective,
    LongPressDirective,
    OldLongPressDirective,
    CollectionItemComponent,
    ShareUrlComponent,
  ],
})
export class SharedModule {}
