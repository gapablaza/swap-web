import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { HomeComponent } from './home.component';
import { ListCollectionsComponent } from './list-collections/list-collections.component';
import { ListResaltedCollectionsComponent } from './list-resalted-collections/list-resalted-collections.component';
import { ListUsersComponent } from './list-users/list-users.component';

@NgModule({
  declarations: [
    HomeComponent,
    ListCollectionsComponent,
    ListResaltedCollectionsComponent,
    ListUsersComponent,
  ],
  imports: [
    SharedModule,
  ]
})
export class HomeModule { }
