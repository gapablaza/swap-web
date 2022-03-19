import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { Component, OnInit } from '@angular/core';

import { User, UserService } from 'src/app/core';
import { UserOnlyService } from '../user-only.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  user: User = {} as User;
  isLoaded = false;

  constructor(
    private userSrv: UserService,
    private userOnlySrv: UserOnlyService,
  ) { }

  ngOnInit(): void {
    registerLocaleData( es );
    this.userOnlySrv.user$
      .subscribe(user => {
        this.user = user;
        this.isLoaded = true;
      });
    console.log('from UserProfileComponent', this.user);
  }

}
