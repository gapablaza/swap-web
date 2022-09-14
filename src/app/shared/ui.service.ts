import { Injectable } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';

import { ShareUrlComponent } from './components/share-url/share-url.component';

@Injectable()
export class UIService {
  loadingStateChanged = new Subject<boolean>();
  defaultSnackbarDuration = 3000;
  private _isGoogleMapsLoaded = false;

  constructor(
    private snackbar: MatSnackBar,
    private bottomSheet: MatBottomSheet
  ) {}

  showSnackbar(
    message: string,
    action?: string | undefined,
    duration?: number
  ) {
    this.snackbar.open(message, action, {
      duration: duration || this.defaultSnackbarDuration,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }

  showError(message: string) {
    return this.snackbar.open(message, undefined, {
      panelClass: ['snackbar-error'],
      duration: this.defaultSnackbarDuration,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }

  showSuccess(message: string) {
    return this.snackbar.open(message, undefined, {
      panelClass: ['snackbar-success'],
      duration: this.defaultSnackbarDuration,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }

  showInfo(message: string) {
    return this.snackbar.open(message, undefined, {
      panelClass: ['snackbar-info'],
      duration: this.defaultSnackbarDuration,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }

  shareUrl() {
    this.bottomSheet.open(ShareUrlComponent);
  }

  isGMapsLoaded() {
    return this._isGoogleMapsLoaded;
  }

  setGMapStatus(status: boolean) {
    this._isGoogleMapsLoaded = status;
  }


}
