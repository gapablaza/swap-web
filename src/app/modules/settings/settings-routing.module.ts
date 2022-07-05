import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from 'src/app/core';
import { SettingsComponent } from './settings.component';
import { SettingsProfileComponent } from './settings-profile/settings-profile.component';
import { SettingsConnectComponent } from './settings-connect/settings-connect.component';
import { SettingsNotificationsComponent } from './settings-notifications/settings-notifications.component';

const routes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: SettingsProfileComponent,
      },
      {
        path: 'connect',
        component: SettingsConnectComponent,
      },
      {
        path: 'notifications',
        component: SettingsNotificationsComponent,
      },
      // {
      //   path: '**',
      //   redirectTo: '',
      // }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
