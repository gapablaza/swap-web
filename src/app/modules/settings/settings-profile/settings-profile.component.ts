import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AuthService, DEFAULT_USER_PROFILE_IMG, User } from 'src/app/core';
import { UIService } from 'src/app/shared';

import { SettingsOnlyService } from '../settings-only.service';
import { SettingsProfileImageComponent } from '../settings-profile-image/settings-profile-image.component';

export interface IProfile {
  displayName: string;
  image?: string;
  bio?: string;
  location?: string;
}

@Component({
  selector: 'app-settings-profile',
  templateUrl: './settings-profile.component.html',
  styleUrls: ['./settings-profile.component.scss'],
})
export class SettingsProfileComponent implements OnInit {
  @ViewChild('confirmDeleteDialog') deleteDialog!: TemplateRef<any>;
  authUser: User = {} as User;
  profile: IProfile = {} as IProfile;
  defaultUserImage = DEFAULT_USER_PROFILE_IMG;
  isDeleting = false;
  isLoaded = false;

  constructor(
    private dialog: MatDialog,
    private authSrv: AuthService,
    private uiSrv: UIService,
    private setOnlySrv: SettingsOnlyService
  ) {}

  ngOnInit(): void {
    console.log('SettingsProfileComponent');
    this.setOnlySrv.setTitles({
      title: 'Editar perfil',
      subtitle: 'Define tus datos de acceso público',
    });

    this.authSrv.authUser.subscribe((user) => {
      this.authUser = user;
      this.profile = {
        displayName: user.displayName,
        image: user.image ? user.image : '',
        bio: user.bio ? user.bio : '',
        location: user.location ? user.location : '',
      };

      this.isLoaded = true;
    });
  }

  onNewImage() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = ['profile-image'];
    dialogConfig.width = '375px';
    // dialogConfig.maxWidth = '500px';

    this.dialog.open(SettingsProfileImageComponent, dialogConfig);
  }

  onDeleteImage() {
    this.dialog.open(this.deleteDialog, { disableClose: true });
  }

  onConfirmDelete() {
    this.isDeleting = true;

    this.authSrv.removeAvatar().subscribe((res) => {
      if (res) {
        this.uiSrv.showSuccess('Imagen removida exitosamente');
        this.dialog.closeAll();
        this.isDeleting = false;
      } else {
        this.uiSrv.showError('No se pudo remover tu imagen de perfil');
        this.dialog.closeAll();
        this.isDeleting = false;
      }
    });
  }
}
