import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';

import { AuthService, DEFAULT_USER_PROFILE_IMG, User } from 'src/app/core';
import { UserOnlyService } from '../user-only.service';
import { filter, Subscription, tap } from 'rxjs';
import { UIService } from 'src/app/shared';

@Component({
  selector: 'app-user-summary',
  templateUrl: './user-summary.component.html',
  styleUrls: ['./user-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserSummaryComponent implements OnInit, OnDestroy {
  @Input() showBackButton = false;
  user: User = {} as User;
  authUser: User = {} as User;
  defaultUserImage = DEFAULT_USER_PROFILE_IMG;
  isAdsLoaded = false;
  isLoaded = false;
  subs: Subscription = new Subscription();

  constructor(
    private userOnlySrv: UserOnlyService,
    private authSrv: AuthService,
    private uiSrv: UIService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    // get possible auth User
    let authSub = this.authSrv.authUser
      .pipe(
        tap((user) => {
          if(!user.id || (user.accountTypeId == 1)) {
            this.loadAds();
          }
        }),
        filter((user) => user.id != null)
      )
      .subscribe((user) => {
        this.authUser = user;
      });
    this.subs.add(authSub);

    // obtiene los datos del usuario consultado
    let userSub = this.userOnlySrv.user$
      .pipe(filter((user) => user.id != null))
      .subscribe((user) => {
        this.user = user;
        this.isLoaded = true;
      });
    this.subs.add(userSub);
  }

  loadAds() {
    this.uiSrv.loadAds().then(() => {
      this.isAdsLoaded = true;
      this.cdr.markForCheck();
    })
  }

  onShare(): void {
    this.uiSrv.shareUrl();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
