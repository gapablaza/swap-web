import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
// import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Subscription, take } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

import { AuthService, User } from 'src/app/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-message',
    templateUrl: './message.component.html',
    styleUrls: ['./message.component.scss'],
    standalone: true,
    imports: [
        RouterOutlet,
        MatDialogModule,
        MatButtonModule,
    ],
})
export class MessageComponent implements OnInit, OnDestroy {
  @ViewChild('customRequest') customRequest!: TemplateRef<any>;
  authUser: User = this.authSrv.getCurrentUser();
  subs: Subscription = new Subscription();

  constructor(
    private authSrv: AuthService,
    // private afMessaging: AngularFireMessaging,
    private dialog: MatDialog,
    private cookieSrv: CookieService
  ) {}

  ngOnInit(): void {
    // let getTokenSub = this.afMessaging.getToken.subscribe((token) => {
    //   if (!token && !this.cookieSrv.check('waitForPermission')) {
    //     this.showCustomRequest();
    //   }
    // });
    // this.subs.add(getTokenSub);
  }

  showCustomRequest() {
    let dialogRef = this.dialog.open(this.customRequest, {
      width: '360px',
      autoFocus: true,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.requestPermission();
      } else {
        this.cookieSrv.set('waitForPermission', 'true', { expires: 7 });
      }
    });
  }

  requestPermission() {
    // this.afMessaging.requestToken.pipe(take(1)).subscribe({
    //   next: (token) => {
    //     this.authSrv.saveFirebaseToken();
    //   },
    //   error: (error) => {
    //     console.error(error);
    //   },
    // });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
