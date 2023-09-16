import { Routes } from '@angular/router';

import { authorizedGuard } from 'src/app/core';
import { SettingsComponent } from './settings.component';

export const SETTINGS_ROUTE: Routes = [
  {
    path: '',
    component: SettingsComponent,
    canActivate: [authorizedGuard],
    children: [
      {
        path: '',
        title: 'Configuración - Editar Perfil - Intercambia Láminas',
        loadComponent: () =>
          import('./settings-profile/settings-profile.component').then(
            (c) => c.SettingsProfileComponent
          ),
      },
      {
        path: 'connect',
        title: 'Configuración - Conectar Redes Sociales - Intercambia Láminas',
        loadComponent: () =>
          import('./settings-connect/settings-connect.component').then(
            (c) => c.SettingsConnectComponent
          ),
      },
      {
        path: 'notifications',
        title: 'Configuración - Notificaciones - Intercambia Láminas',
        loadComponent: () =>
          import(
            './settings-notifications/settings-notifications.component'
          ).then((c) => c.SettingsNotificationsComponent),
      },
      {
        path: 'delete',
        title: 'Configuración - Eliminar Cuenta - Intercambia Láminas',
        loadComponent: () =>
          import('./settings-delete/settings-delete.component').then(
            (c) => c.SettingsDeleteComponent
          ),
      },
      {
        path: 'blacklist',
        title: 'Configuración - Usuarios Bloqueados - Intercambia Láminas',
        loadComponent: () =>
          import('./settings-blacklist/settings-blacklist.component').then(
            (c) => c.SettingsBlacklistComponent
          ),
      },
      {
        path: '**',
        redirectTo: '',
      },
    ],
  },
];

export default SETTINGS_ROUTE;
