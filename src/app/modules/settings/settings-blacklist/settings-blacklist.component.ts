import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AsyncPipe } from '@angular/common';
import { Store } from '@ngrx/store';

import { settingsActions } from '../store/settings.actions';
import { settingsFeature } from '../store/settings.state';

@Component({
  selector: 'app-settings-blacklist',
  templateUrl: './settings-blacklist.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    RouterLink,

    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatProgressSpinnerModule,
  ],
})
export class SettingsBlacklistComponent implements OnInit {
  blacklist$ = this.store.select(settingsFeature.selectBlacklist);
  isLoaded$ = this.store.select(settingsFeature.selectIsBlacklistLoaded);
  isProcessing$ = this.store.select(settingsFeature.selectIsProcessing);

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(settingsActions.loadBlacklist());
  }

  onRemove(userId: number): void {
    this.store.dispatch(settingsActions.removeBlacklist({ userId }));
  }
}
