import {
  AfterViewInit,
  Component,
  OnDestroy,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Store } from '@ngrx/store';

import { messagesActions } from './store/message.actions';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styles: `@import './src/styles/pages/_message.scss';`,
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [RouterOutlet, MatDialogModule, MatButtonModule],
})
export class MessageComponent implements AfterViewInit, OnDestroy {
  @ViewChild('customRequest') customRequest!: TemplateRef<any>;
  subs: Subscription = new Subscription();

  constructor(
    private store: Store,
    private dialog: MatDialog,
    private cookieSrv: CookieService
  ) {}

  ngAfterViewInit(): void {
    if (
      Notification.permission !== 'granted' &&
      !this.cookieSrv.check('waitForPermission')
    ) {
      this.showCustomRequest();
    }
  }

  showCustomRequest() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '360px';
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;

    let dialogRef = this.dialog.open(this.customRequest, dialogConfig);
    let dialogSub = dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.store.dispatch(messagesActions.saveMessagingToken());
      } else {
        this.cookieSrv.set('waitForPermission', 'true', { expires: 7 });
      }
    });
    this.subs.add(dialogSub);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
