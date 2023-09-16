import { Routes } from '@angular/router';

import { authorizedGuard, fbAuthorizedGuard } from 'src/app/core';
import { MessageComponent } from './message.component';
import { MessageResolver } from './message-resolver.service';

export const MESSAGE_ROUTES: Routes = [
  {
    path: '',
    component: MessageComponent,
    canActivate: [authorizedGuard, fbAuthorizedGuard],
    children: [
      {
        path: '',
        title: 'Listado de Conversaciones - Intercambia Láminas',
        loadComponent: () =>
          import('./message-list/message-list.component').then(
            (c) => c.MessageListComponent
          ),
      },
      {
        path: ':userId',
        title: 'Detalle de la conversación - Intercambia Láminas',
        loadComponent: () =>
          import('./message-with-user/message-with-user.component').then(
            (c) => c.MessageWithUserComponent
          ),
        resolve: {
          userData: MessageResolver,
        },
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];

export default MESSAGE_ROUTES;
