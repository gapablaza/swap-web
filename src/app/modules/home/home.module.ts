import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { HomeComponent } from './home.component';
import { ListCollectionsComponent } from './list-collections/list-collections.component';
import { ListResaltedCollectionsComponent } from './list-resalted-collections/list-resalted-collections.component';

@NgModule({
  declarations: [
    HomeComponent,
    ListCollectionsComponent,
    ListResaltedCollectionsComponent
  ],
  imports: [
    SharedModule,
  ]
})
export class HomeModule { }
