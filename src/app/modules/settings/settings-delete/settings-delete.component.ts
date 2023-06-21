import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { take } from 'rxjs';

import { AuthService } from 'src/app/core';
import { UIService } from 'src/app/shared';
import { SettingsOnlyService } from '../settings-only.service';

@Component({
  selector: 'app-settings-delete',
  templateUrl: './settings-delete.component.html',
  styleUrls: ['./settings-delete.component.scss'],
})
export class SettingsDeleteComponent implements OnInit {
  @ViewChild('confirmDeleteDialog') deleteDialog!: TemplateRef<any>;
  authUser = this.authSrv.getCurrentUser();
  isDeleting = false;
  isLoaded = false;

  constructor(
    private dialog: MatDialog,
    private authSrv: AuthService,
    private uiSrv: UIService,
    private setOnlySrv: SettingsOnlyService
  ) {}

  ngOnInit(): void {
    this.setOnlySrv.setTitles({
      title: 'Eliminar cuenta',
      subtitle: 'Eliminina de manera definitiva tus datos',
    });

    this.isLoaded = true;
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
