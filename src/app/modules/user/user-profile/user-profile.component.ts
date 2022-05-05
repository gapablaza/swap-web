import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { Component, OnInit } from '@angular/core';
// import { MatBottomSheet } from '@angular/material/bottom-sheet';

import { DEFAULT_USER_PROFILE_IMG, User, UserService } from 'src/app/core';
import { UserOnlyService } from '../user-only.service';
// import { ShareUrlComponent } from 'src/app/shared/components/share-url/share-url.component';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  user: User = {} as User;
  defaultUserImage = DEFAULT_USER_PROFILE_IMG;
  isLoaded = false;

  constructor(
    // private userSrv: UserService,
    private userOnlySrv: UserOnlyService,
    // private bottomSheet: MatBottomSheet
  ) { }

  ngOnInit(): void {
    registerLocaleData( es );
    this.userOnlySrv.user$
      .subscribe(user => {
        if (user.id) {
          this.user = user;
          this.isLoaded = true;
        }
      });
    console.log('from UserProfileComponent', this.user);
  }

  // onShare(): void {
  //   this.bottomSheet.open(ShareUrlComponent);
  // }
}
