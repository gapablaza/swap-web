import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core';
import { SettingsOnlyService } from '../settings-only.service';

@Component({
  selector: 'app-settings-notifications',
  templateUrl: './settings-notifications.component.html',
  styleUrls: ['./settings-notifications.component.scss']
})
export class SettingsNotificationsComponent implements OnInit {

  constructor(
    private authSrv: AuthService,
    private setOnlySrv: SettingsOnlyService,
  ) { }

  ngOnInit(): void {
    console.log('SettingsNotificationsComponent');
    this.setOnlySrv.setTitles({
      title: 'Notificaciones',
      subtitle: 'Recibe información directo a tu email'
    });
  }

}
