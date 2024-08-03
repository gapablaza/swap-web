import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Store } from '@ngrx/store';

import { authFeature } from '../../auth/store/auth.state';
import { settingsFeature } from '../store/settings.state';
import { settingsActions } from '../store/settings.actions';
import { authActions } from '../../auth/store/auth.actions';

@Component({
  selector: 'app-settings-delete',
  templateUrl: './settings-delete.component.html',
  standalone: true,
  imports: [
    RouterLink,
    AsyncPipe,

    MatProgressSpinnerModule,
    MatButtonModule,
    MatDialogModule,
  ],
})
export class SettingsDeleteComponent implements OnInit {
  authUser$ = this.store.select(authFeature.selectUser);
  isLoaded$ = this.store.select(settingsFeature.selectIsDeleteLoaded);
  isProcessing$ = this.store.select(authFeature.selectIsProcessing);

  @ViewChild('confirmDeleteDialog') deleteDialog!: TemplateRef<any>;

  constructor(private store: Store, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.store.dispatch(settingsActions.loadDelete());
  }

  onDelete() {
    this.dialog.open(this.deleteDialog, { disableClose: true });
  }

  onConfirmDelete() {
    this.store.dispatch(authActions.deleteAccount());
  }
}
