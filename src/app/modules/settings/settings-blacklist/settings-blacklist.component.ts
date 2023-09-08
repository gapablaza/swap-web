import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, take } from 'rxjs';

import { AuthService, User } from 'src/app/core';
import { SettingsOnlyService } from '../settings-only.service';
import { UIService } from 'src/app/shared';

@Component({
  selector: 'app-settings-blacklist',
  templateUrl: './settings-blacklist.component.html',
  styleUrls: ['./settings-blacklist.component.scss'],
})
export class SettingsBlacklistComponent implements OnInit, OnDestroy {
  authUser = this.authSrv.getCurrentUser();
  blacklist: User[] = [];

  isSaving = false;
  isLoaded = false;
  subs: Subscription = new Subscription();

  constructor(
    private authSrv: AuthService,
    private setOnlySrv: SettingsOnlyService,
    private uiSrv: UIService
  ) {}

  ngOnInit(): void {
    this.setOnlySrv.setTitles({
      title: 'Bloqueados',
      subtitle: 'Lista de usuarios bloqueados',
    });

    this.authSrv
      .getBlacklist()
      .pipe(take(1))
      .subscribe({
        next: (users) => {
          this.blacklist = users;
          this.isLoaded = true;
        },
        error: (err) => {
          console.log('getBlacklist', err);
          this.isLoaded = true;
        },
      });
  }

  onRemove(userId: number): void {
    this.isSaving = true;

    this.authSrv
      .removeFromBlacklist(userId)
      .pipe(take(1))
      .subscribe({
        next: (resp) => {
          this.blacklist = [...this.blacklist.filter((user) => {
            return user.id !== userId;
          })];
          this.uiSrv.showSuccess(resp);
          this.isSaving = false;
        },
        error: (err) => {
          console.log('removeFromBlacklist', err);
          this.isSaving = false;
        },
      });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
