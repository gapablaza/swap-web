import { Component, OnInit } from '@angular/core';
import { AuthService, DEFAULT_USER_PROFILE_IMG, User } from 'src/app/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  authUser: User = {} as User;
  defaultUserImage = DEFAULT_USER_PROFILE_IMG;
  isLoaded = false;

  constructor(
    private authSrv: AuthService,
  ) { }

  ngOnInit(): void {
    console.log('SettingsComponent');
    this.authSrv.authUser.subscribe(user => {
      this.authUser = user;
      this.isLoaded = true;
    });
  }

}
