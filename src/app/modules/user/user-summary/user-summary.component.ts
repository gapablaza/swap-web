import { Component, Input, OnInit } from '@angular/core';

import { AuthService, DEFAULT_USER_PROFILE_IMG, User } from 'src/app/core';
import { UserOnlyService } from '../user-only.service';
import { filter } from 'rxjs';
import { UIService } from 'src/app/shared';

@Component({
  selector: 'app-user-summary',
  templateUrl: './user-summary.component.html',
  styleUrls: ['./user-summary.component.scss'],
})
export class UserSummaryComponent implements OnInit {
  @Input() showBackButton = false;
  user: User = {} as User;
  authUser: User = {} as User;
  defaultUserImage = DEFAULT_USER_PROFILE_IMG;
  isLoaded = false;

  constructor(
    private userOnlySrv: UserOnlyService,
    private authSrv: AuthService,
    private uiSrv: UIService,
  ) {}

  ngOnInit(): void {
    // get possible auth User
    this.authSrv.authUser
      .pipe(filter((user) => user.id != null))
      .subscribe((user) => {
        this.authUser = user;
      });

    // obtiene los datos del usuario consultado
    this.userOnlySrv.user$
      .pipe(filter((user) => user.id != null))
      .subscribe((user) => {
        this.user = user;
        this.isLoaded = true;
      });
    console.log('from UserSummaryComponent', this.user);
  }

  onShare(): void {
    this.uiSrv.shareUrl();
  }
}
