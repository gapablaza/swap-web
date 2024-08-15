import { Injectable } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Subject } from 'rxjs';

import { environment } from 'src/environments/environment';
import { ShareUrlComponent } from './components/share-url/share-url.component';

@Injectable()
export class UIService {
  loadingStateChanged = new Subject<boolean>();
  defaultSnackbarDuration = 3000;
  errorSnackbarDuration = 5000;
  private _isGoogleMapsLoaded = false;
  private _isAdsSenseLoaded = false;

  private _adsSenseLoadedSubject = new BehaviorSubject<boolean>(false);
  isAdsSenseLoaded$ = this._adsSenseLoadedSubject.asObservable();

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
      duration: this.errorSnackbarDuration,
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
    return this._adsSenseLoadedSubject.getValue();
  }

  setAdsStatus(status: boolean) {
    this._isAdsSenseLoaded = status;
  }

  loadScript(id: string, src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (document.getElementById(id)) {
        resolve(); // El script ya está cargado
        return;
      }

      const element = document.createElement('script');
      element.id = id;
      element.src = src;
      element.onload = () => resolve();
      element.onerror = () => reject();
      document.head.appendChild(element);
    });
  }

  loadGoogleMaps() {
    if (this._isGoogleMapsLoaded) {
      return Promise.resolve();
    }

    const src = `https://maps.googleapis.com/maps/api/js?key=${environment.google.apiKey}&libraries=places&language=en&loading=async`;
    return this.loadScript('google-maps-script', src).then(() => {
      this._isGoogleMapsLoaded = true;
    });
  }

  loadAds() {
    if (this._isAdsSenseLoaded) {
      return Promise.resolve();
    }

    const src = `//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js`;
    return this.loadScript('google-ads-script', src).then(() => {
      this._isAdsSenseLoaded = true;
      this._adsSenseLoadedSubject.next(true);
    });
  }
}
