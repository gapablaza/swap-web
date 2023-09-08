import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FacebookLoginProvider,
  SocialAuthService,
} from '@abacritt/angularx-social-login';
import { filter, from, Subscription, switchMap, take } from 'rxjs';

import { AuthService, User } from 'src/app/core';
import { UIService } from 'src/app/shared';
import { SettingsOnlyService } from '../settings-only.service';

@Component({
  selector: 'app-settings-connect',
  templateUrl: './settings-connect.component.html',
  styleUrls: ['./settings-connect.component.scss'],
})
export class SettingsConnectComponent implements OnInit, OnDestroy {
  authUser: User = {} as User;

  isSaving = false;
  isLoaded = false;
  subs: Subscription = new Subscription();

  constructor(
    private authSrv: AuthService,
    private socialSrv: SocialAuthService,
    private setOnlySrv: SettingsOnlyService,
    private uiSrv: UIService
  ) {}

  ngOnInit(): void {
    console.log('SettingsConnectComponent');

    this.setOnlySrv.setTitles({
      title: 'Conéctate',
      subtitle: 'Métodos adicionales de inicio',
    });

    let authSub = this.authSrv.authUser.subscribe((user) => {
      this.authUser = user;
    });
    this.subs.add(authSub);

    let socialSub = this.socialSrv.authState
      .pipe(
        filter(() => this.isLoaded == true && this.authUser.google == null),
        filter((user) => user != null && user.provider == 'GOOGLE'),
        switchMap((user) =>
          this.authSrv.linkGoogle({
            id: user.id,
            email: user.email,
            image: user.photoUrl,
          })
        )
      )
      .subscribe((resp) => {
        if (resp) {
          this.uiSrv.showSuccess('Cuenta vinculada exitosamente');
        }
      });
    this.subs.add(socialSub);

    this.isLoaded = true;
  }

  onLinkFacebook() {
    this.isSaving = true;

    from(this.socialSrv.signIn(FacebookLoginProvider.PROVIDER_ID))
      .pipe(
        take(1),
        filter((user) => user != null),
        switchMap((user) =>
          this.authSrv.linkFacebook({ id: user.id, email: user.email })
        )
      )
      .subscribe((res) => {
        if (res) {
          this.uiSrv.showSuccess('Cuenta vinculada exitosamente');
        }
        this.isSaving = false;
      });
  }

  onUnlink(network: 'facebook' | 'google') {
    this.isSaving = true;

    this.authSrv
      .unlink(network)
      .pipe(take(1))
      .subscribe((res) => {
        if (res) {
          this.uiSrv.showSuccess(`${network} fue removido exitosamente`);
        } else {
          this.uiSrv.showError(`No se pudo remover ${network} de tu perfil`);
        }
        this.isSaving = false;
      });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
