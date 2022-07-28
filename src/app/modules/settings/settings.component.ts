import { Component, OnInit } from '@angular/core';
import { AuthService, DEFAULT_USER_PROFILE_IMG, User } from 'src/app/core';

import { SettingsOnlyService } from './settings-only.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  providers: [SettingsOnlyService],
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  authUser: User = {} as User;
  defaultUserImage = DEFAULT_USER_PROFILE_IMG;
  title = '';
  subtitle = '';
  isLoaded = false;

  constructor(
    private authSrv: AuthService,
    private setOnlySrv: SettingsOnlyService
  ) {}

  ngOnInit(): void {
    // console.log('SettingsComponent');
    this.setOnlySrv.titles$.subscribe((titles) => {
      setTimeout(() => {
        this.title = titles.title;
        this.subtitle = titles.subtitle;
      });
    });

    this.authSrv.authUser.subscribe((user) => {
      this.authUser = user;
      this.isLoaded = true;
    });
  }
}
