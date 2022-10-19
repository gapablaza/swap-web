import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared';
import { MaterialModule } from 'src/app/shared/material.module';
import { PagesRoutingModule } from './pages-routing.module';

import { TosComponent } from './tos/tos.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { AboutComponent } from './about/about.component';
import { FaqsComponent } from './faqs/faqs.component';
import { GuideComponent } from './guide/guide.component';

@NgModule({
  declarations: [
    TosComponent,
    PrivacyComponent,
    AboutComponent,
    FaqsComponent,
    GuideComponent
  ],
  imports: [
    SharedModule,
    MaterialModule,
    PagesRoutingModule,
  ]
})
export class PagesModule { }
