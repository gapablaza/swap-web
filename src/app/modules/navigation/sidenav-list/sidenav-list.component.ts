import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { filter, map, Subscription } from 'rxjs';

import {
  AuthService,
  DEFAULT_USER_PROFILE_IMG,
  Message,
  User,
} from 'src/app/core';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidenavListComponent implements OnInit {
  @Output() closeSidenav = new EventEmitter<void>();
  authUser: User = {} as User;
  defaultUserImage = DEFAULT_USER_PROFILE_IMG;
  unreadCount = 0;
  unreadCountSub: Subscription = new Subscription();
  isAuth = false;

  constructor(
    private authSrv: AuthService,
    private afDB: AngularFireDatabase,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.authSrv.authUser.subscribe((user) => {
      if (user.id) {
        this.authUser = user;
        this.isAuth = true;
      } else {
        this.authUser = {} as User;
        this.isAuth = false;
      }
      this.cdr.markForCheck();
    });

    this.authSrv.isFBAuth
      // .pipe(filter((FBState) => FBState))
      .subscribe((state) => {
        // this.afDB
        //   // .list(`userResume/userId_${this.authUser.id}`, (ref) =>
        //   //   ref.orderByChild('toUserId').equalTo(this.authUser.id)
        //   // )
        //   .list(`userResume/userId_${this.authUser.id}`)
        //   .valueChanges()
        //   .pipe(
        //     map((resp: any) => {
        //       return resp.filter((mess: Message) => {
        //         return (
        //           (mess.unread === false ? false : true) &&
        //           mess.toUserId == this.authUser.id
        //         );
        //       });
        //     })
        //   )
        //   .subscribe((resp: any) => {
        //     this.unreadCount = resp.length;
        //     this.cdr.markForCheck();
        //   });

        if (state) {
          this.unreadCountSub = this.afDB
            .list(`unreadUserMessages/userId_${this.authUser.id}`)
            .valueChanges()
            .pipe(map((unreads) => unreads.length))
            .subscribe((unreadQ) => {
              this.unreadCount = unreadQ;
              this.cdr.markForCheck();
            });
        } else {
          if (this.unreadCountSub) {
            this.unreadCountSub.unsubscribe();
          }
        }
      });
  }

  onClose() {
    this.closeSidenav.emit();
  }

  onLogout() {
    this.authSrv.logout();
  }
}
