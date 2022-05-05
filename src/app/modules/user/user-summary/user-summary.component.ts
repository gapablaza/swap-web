import { Component, Input, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

import { DEFAULT_USER_PROFILE_IMG, User } from 'src/app/core';
import { UserOnlyService } from '../user-only.service';
import { ShareUrlComponent } from 'src/app/shared/components/share-url/share-url.component';

@Component({
  selector: 'app-user-summary',
  templateUrl: './user-summary.component.html',
  styleUrls: ['./user-summary.component.scss']
})
export class UserSummaryComponent implements OnInit {
  @Input() showBackButton = false;
  user: User = {} as User;
  defaultUserImage = DEFAULT_USER_PROFILE_IMG;
  isLoaded = false;

  constructor(
    private userOnlySrv: UserOnlyService,
    private bottomSheet: MatBottomSheet,
  ) { }

  ngOnInit(): void {
    this.userOnlySrv.user$
      .subscribe(user => {
        if (user.id) {
          this.user = user;
          this.isLoaded = true;
        }
      });
    console.log('from UserSummaryComponent', this.user);
  }

  onShare(): void {
    this.bottomSheet.open(ShareUrlComponent);
  }
}
