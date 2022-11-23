import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from 'src/app/core';
import { SettingsComponent } from './settings.component';
import { SettingsProfileComponent } from './settings-profile/settings-profile.component';
import { SettingsConnectComponent } from './settings-connect/settings-connect.component';
import { SettingsNotificationsComponent } from './settings-notifications/settings-notifications.component';
import { SettingsDeleteComponent } from './settings-delete/settings-delete.component';

const routes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: SettingsProfileComponent,
        title: 'Configuración - Editar Perfil - Intercambia Láminas'
      },
      {
        path: 'connect',
        component: SettingsConnectComponent,
        title: 'Configuración - Conectar Redes Sociales - Intercambia Láminas'
      },
      {
        path: 'notifications',
        component: SettingsNotificationsComponent,
        title: 'Configuración - Notificaciones - Intercambia Láminas'
      },
      {
        path: 'delete',
        component: SettingsDeleteComponent,
        title: 'Configuración - Eliminar Cuenta - Intercambia Láminas'
      },
      {
        path: '**',
        redirectTo: '',
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
