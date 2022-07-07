import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AuthService, DEFAULT_USER_PROFILE_IMG, User } from 'src/app/core';
import { SettingsProfileImageComponent } from '../settings-profile-image/settings-profile-image.component';

export interface IProfile {
  displayName: string,
  image?: string,
  bio?: string,
  location?: string,
}

@Component({
  selector: 'app-settings-profile',
  templateUrl: './settings-profile.component.html',
  styleUrls: ['./settings-profile.component.scss'],
})
export class SettingsProfileComponent implements OnInit {
  authUser: User = {} as User;
  profile: IProfile = {} as IProfile;
  defaultUserImage = DEFAULT_USER_PROFILE_IMG;
  isLoaded = false;

  constructor(
    private authSrv: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    console.log('SettingsProfileComponent');
    this.authSrv.authUser.subscribe((user) => {
      this.authUser = user;
      this.profile = {
        displayName: user.displayName,
        image: user.image ? user.image : '',
        bio: user.bio ? user.bio : '',
        location: user.location ? user.location : '',
      }

      this.isLoaded = true;
    });
  }

  onNewImage() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = ['profile-image'];
    dialogConfig.width = '375px';
    // dialogConfig.maxWidth = '1280px';
    // dialogConfig.height = '470px';
    // dialogConfig.minHeight = '300px';
    

    // dialogConfig.data = {
    //   user: this.user,
    //   collection: col,
    // }

    this.dialog.open(
      SettingsProfileImageComponent, dialogConfig
    );
  }

  onDeleteImage() {
    this.profile.image = '';
  }
}
