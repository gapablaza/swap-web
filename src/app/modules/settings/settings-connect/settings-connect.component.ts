import { Component, OnDestroy, OnInit } from '@angular/core';
import { GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AsyncPipe } from '@angular/common';
import { Store } from '@ngrx/store';

import { authFeature } from '../../auth/store/auth.state';
import { settingsFeature } from '../store/settings.state';
import { settingsActions } from '../store/settings.actions';
import { authActions } from '../../auth/store/auth.actions';

@Component({
  selector: 'app-settings-connect',
  templateUrl: './settings-connect.component.html',
  standalone: true,
  imports: [
    AsyncPipe,

    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatProgressSpinnerModule,
    GoogleSigninButtonModule,
  ],
})
export class SettingsConnectComponent implements OnInit, OnDestroy {
  authUser$ = this.store.select(authFeature.selectUser);
  isLoaded$ = this.store.select(settingsFeature.selectIsConnectedLoaded);
  isProcessing$ = this.store.select(authFeature.selectIsProcessing);

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(settingsActions.loadConnect());
    this.store.dispatch(authActions.connectPageOpened());
  }

  onLinkFacebook() {
    this.store.dispatch(authActions.linkFacebook());
  }

  onUnlink(network: 'facebook' | 'google') {
    this.store.dispatch(authActions.unlinkNetwork({ network }));
  }

  ngOnDestroy(): void {
    this.store.dispatch(authActions.connectPageDestroyed());
  }
}
