import { Component, OnInit } from '@angular/core';

import { AuthService } from 'src/app/core';
import { SettingsOnlyService } from '../settings-only.service';

@Component({
  selector: 'app-settings-connect',
  templateUrl: './settings-connect.component.html',
  styleUrls: ['./settings-connect.component.scss']
})
export class SettingsConnectComponent implements OnInit {

  constructor(
    private authSrv: AuthService,
    private setOnlySrv: SettingsOnlyService,
  ) { }

  ngOnInit(): void {
    console.log('SettingsConnectComponent');
    this.setOnlySrv.setTitles({
      title: 'Conéctate',
      subtitle: 'Métodos adicionales de inicio'
    });
  }

}
