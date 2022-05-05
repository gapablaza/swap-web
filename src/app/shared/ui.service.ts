import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';

@Injectable()
export class UIService {
  loadingStateChanged = new Subject<boolean>();
  defaultSnackbarDuration = 3000;

  constructor(private snackbar: MatSnackBar) {}

  showSnackbar(message:string, action?: string | undefined, duration?: number) {
    this.snackbar.open(message, action, {
      duration: duration || this.defaultSnackbarDuration,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  showError(message: string) {
    return this.snackbar.open(message, undefined, { 
      panelClass: ['snackbar-error'],
      duration: this.defaultSnackbarDuration,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  showSuccess(message: string) {
    return this.snackbar.open(message, undefined, { 
      panelClass: ['snackbar-success'],
      duration: this.defaultSnackbarDuration,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  showInfo(message: string) {
    return this.snackbar.open(message, undefined, { 
      panelClass: ['snackbar-info'],
      duration: this.defaultSnackbarDuration,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }
}
