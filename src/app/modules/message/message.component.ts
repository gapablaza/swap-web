import {
  AfterViewInit,
  Component,
  OnDestroy,
  TemplateRef,
  ViewChild,
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

import { AuthService, User } from 'src/app/core';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
  standalone: true,
  imports: [RouterOutlet, MatDialogModule, MatButtonModule],
})
export class MessageComponent implements AfterViewInit, OnDestroy {
  @ViewChild('customRequest') customRequest!: TemplateRef<any>;
  authUser: User = this.authSrv.getCurrentUser();
  subs: Subscription = new Subscription();

  constructor(
    private authSrv: AuthService,
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
        this.authSrv.saveFirebaseToken();
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
