import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { Component, OnInit } from '@angular/core';
import { combineLatest, filter, switchMap, tap } from 'rxjs';

import {
  AuthService,
  DEFAULT_COLLECTION_IMG,
  DEFAULT_USER_PROFILE_IMG,
  TradesWithUserCollection,
  User,
  UserService,
} from 'src/app/core';
import { UserOnlyService } from '../user-only.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  user: User = {} as User;
  authUser: User = {} as User;
  defaultUserImage = DEFAULT_USER_PROFILE_IMG;
  defaultCollectionImage = DEFAULT_COLLECTION_IMG;
  trades: TradesWithUserCollection[] = [];
  possibleTrades = 0;
  showTrades = false;
  isLoaded = false;

  constructor(
    private userOnlySrv: UserOnlyService,
    private userSrv: UserService,
    private authSrv: AuthService
  ) {}

  ngOnInit(): void {
    registerLocaleData(es);
    this.user = this.userOnlySrv.getCurrentUser();

    combineLatest([this.authSrv.authUser, this.userSrv.getMedia(this.user.id)])
      .pipe(
        tap(([authUser, media]) => {
          console.log(authUser, media);

          this.authUser = authUser;
          this.user.contributions = media.filter((m) => {
            return m.mediaTypeId == 1 && m.mediaStatusId == 2;
          }).length;

          this.showTrades = false;

          if (
            authUser.id &&
            authUser.accountTypeId == 2 &&
            authUser.id != this.user.id
          ) {
            this.isLoaded = false;
          } else {
            this.isLoaded = true;
          }
        }),
        // Se buscan los posibles cambios con el usuario consultado, si:
        // 1.- Está autenticado
        // 2.- Es PRO
        // 3.- No es el usuario que se está consultando
        filter(
          ([authUser, media]) =>
            authUser.accountTypeId == 2 && authUser.id != this.user.id
        ),
        switchMap(() => this.userSrv.getTradesWithAuthUser(this.user.id))
      )
      .subscribe((trades) => {
        if (trades.showTrades) {
          this.trades = trades.collections.sort((a, b) =>
            a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase() ? 1 : -1
          );
          this.possibleTrades = trades.total;
          this.showTrades = true;
        }
        this.isLoaded = true;
      });

    console.log('from UserProfileComponent');
  }
}
