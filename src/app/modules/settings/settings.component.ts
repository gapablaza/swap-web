import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { toSignal } from '@angular/core/rxjs-interop';

import { DEFAULT_USER_PROFILE_IMG } from 'src/app/core';
import { authFeature } from '../auth/store/auth.state';
import { settingsFeature } from './store/settings.state';
import { settingsActions } from './store/settings.actions';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styles: `@import './src/styles/pages/_settings.scss';`,
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    AsyncPipe,

    MatProgressSpinnerModule,
  ],
})
export class SettingsComponent implements OnInit {
  authUser$ = this.store.select(authFeature.selectUser);
  title = toSignal(this.store.select(settingsFeature.selectTitle));
  subtitle = toSignal(this.store.select(settingsFeature.selectSubtitle));
  isLoaded$ = this.store.select(settingsFeature.selectIsLoaded);
  defaultUserImage = DEFAULT_USER_PROFILE_IMG;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(settingsActions.loadSettings());
  }
}
