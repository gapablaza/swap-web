import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared';
import { MaterialModule } from 'src/app/shared/material.module';
import { MessageRoutingModule } from './message-routing.module';

import { MessageComponent } from './message.component';
import { MessageListComponent } from './message-list/message-list.component';
import { MessageWithUserComponent } from './message-with-user/message-with-user.component';

@NgModule({
  declarations: [
    MessageComponent,
    MessageListComponent,
    MessageWithUserComponent
  ],
  imports: [
    SharedModule,
    MaterialModule,
    MessageRoutingModule,
  ]
})
export class MessageModule { }
