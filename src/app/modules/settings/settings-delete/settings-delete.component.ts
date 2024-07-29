import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { take } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Store } from '@ngrx/store';

import { UIService } from 'src/app/shared';
import { AuthService } from 'src/app/core';
import { authFeature } from '../../auth/store/auth.state';
import { settingsFeature } from '../store/settings.state';
import { settingsActions } from '../store/settings.actions';

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

  // authUser = this.authSrv.getCurrentUser();
  isDeleting = false;
  // isLoaded = false;

  constructor(
    private store: Store,
    private dialog: MatDialog,
    private authSrv: AuthService,
    private uiSrv: UIService
  ) {}

  ngOnInit(): void {
    this.store.dispatch(settingsActions.loadDelete());
  }

  onDelete() {
    this.dialog.open(this.deleteDialog, { disableClose: true });
  }

  onConfirmDelete() {
    this.isDeleting = true;

    this.authSrv
      .delete()
      .pipe(take(1))
      .subscribe({
        next: (resp) => {
          this.authSrv.logout();
          this.dialog.closeAll();
          this.uiSrv.showSuccess(resp);
        },
        error: (error) => {
          console.log('delete error: ', error);
          this.uiSrv.showError(error.error.message);
          this.dialog.closeAll();
          this.isDeleting = false;
        },
      });
  }
}
