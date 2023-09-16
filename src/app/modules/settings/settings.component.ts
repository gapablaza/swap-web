import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService, DEFAULT_USER_PROFILE_IMG, User } from 'src/app/core';

import { SettingsOnlyService } from './settings-only.service';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
    providers: [SettingsOnlyService],
    standalone: true,
    imports: [
        NgIf,
        MatProgressSpinnerModule,
        LazyLoadImageModule,
        RouterLink,
        RouterLinkActive,
        RouterOutlet,
    ],
})
export class SettingsComponent implements OnInit, OnDestroy {
  authUser: User = {} as User;
  defaultUserImage = DEFAULT_USER_PROFILE_IMG;
  title = '';
  subtitle = '';
  isLoaded = false;
  subs: Subscription = new Subscription();

  constructor(
    private authSrv: AuthService,
    private setOnlySrv: SettingsOnlyService,
  ) {}

  ngOnInit(): void {
    // console.log('SettingsComponent');
    let setSub = this.setOnlySrv.titles$.subscribe((titles) => {
      setTimeout(() => {
        this.title = titles.title;
        this.subtitle = titles.subtitle;
      });
    });
    this.subs.add(setSub);

    let authSub = this.authSrv.authUser.subscribe((user) => {
      this.authUser = user;
      this.isLoaded = true;
    });
    this.subs.add(authSub);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
