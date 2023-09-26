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
  private _isAdsSenseLoaded = false;

  constructor(
    private snackbar: MatSnackBar,
    private bottomSheet: MatBottomSheet,
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

  isAdsLoaded() {
    return this._isAdsSenseLoaded;
  }

  setAdsStatus(status: boolean) {
    this._isAdsSenseLoaded = status;
  }

  loadAds() {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        reject(false);
      }

      if (this._isAdsSenseLoaded) {
        resolve(true);
      } else {
        const element = document.createElement('script');
        // element.type = 'text/javascript';
        element.id = 'google_ads_dynamic_script';
        element.src = `//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js`;
        element.onload = () => {
          this._isAdsSenseLoaded = true;
          resolve(true);
        }
        element.onerror = () => {
          reject(false);
        }
        
        document.getElementsByTagName('head')[0].appendChild(element);
      }
    });
  }
}
