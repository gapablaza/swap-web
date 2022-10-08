import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard, FBAuthGuard } from 'src/app/core';
import { MessageListComponent } from './message-list/message-list.component';
import { MessageResolver } from './message-resolver.service';
import { MessageWithUserComponent } from './message-with-user/message-with-user.component';
import { MessageComponent } from './message.component';

const routes: Routes = [
  {
    path: '',
    component: MessageComponent,
    canActivate: [AuthGuard, FBAuthGuard],
    children: [
      {
        path: '',
        component: MessageListComponent,
        title: 'Listado de Conversaciones - Intercambia Láminas',
        // children: [
        //   {
        //     path: ':userId',
        //     component: MessageWithUserComponent
        //   }
        // ]
      },
      {
        path: ':userId',
        component: MessageWithUserComponent,
        title: 'Detalle de la conversación - Intercambia Láminas',
        resolve: {
          userData: MessageResolver
        }
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MessageRoutingModule {}
