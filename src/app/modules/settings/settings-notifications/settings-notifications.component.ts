import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AsyncPipe } from '@angular/common';
import { Store } from '@ngrx/store';

import { authFeature } from '../../auth/store/auth.state';
import { settingsFeature } from '../store/settings.state';
import { settingsActions } from '../store/settings.actions';
import { authActions } from '../../auth/store/auth.actions';

@Component({
  selector: 'app-settings-notifications',
  templateUrl: './settings-notifications.component.html',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    AsyncPipe,

    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
})
export class SettingsNotificationsComponent implements OnInit {
  authUser$ = this.store.select(authFeature.selectUser);
  isLoaded$ = this.store.select(settingsFeature.selectIsNotificationsLoaded);
  isProcessing$ = this.store.select(authFeature.selectIsProcessing);

  isUpdateRequested$ = this.store.select(
    settingsFeature.selectUpdateEmailRequested
  );
  isUpdateProcessing$ = this.store.select(settingsFeature.selectIsProcessing);

  emailForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
  });

  constructor(private store: Store, private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.store.dispatch(settingsActions.loadNotifications());
  }

  onChange(checked: boolean) {
    this.store.dispatch(
      authActions.unreadNotification({ notifyUnreads: checked })
    );
  }

  get form() {
    return this.emailForm.controls;
  }

  onUpdate() {
    if (this.emailForm.value.email) {
      this.store.dispatch(
        settingsActions.updateEmail({ email: this.emailForm.value.email })
      );
    }
  }
}
