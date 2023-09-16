import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { combineLatest, map, Subscription } from 'rxjs';

import {
  AuthService,
  DEFAULT_USER_PROFILE_IMG,
  User,
} from 'src/app/core';
import { MatIconModule } from '@angular/material/icon';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-sidenav-list',
    templateUrl: './sidenav-list.component.html',
    styleUrls: ['./sidenav-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        NgIf,
        RouterLink,
        LazyLoadImageModule,
        MatIconModule,
    ],
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
      .subscribe((state) => {

        if (state) {
          const usersBL$ = this.afDB
            .list(`userBlacklist/userId_${this.authUser.id}`)
            .snapshotChanges()
            .pipe(map((users) => users.map((user) => user.key)));

          const unreads$ = this.afDB
            .list(`unreadUserMessages/userId_${this.authUser.id}`)
            .snapshotChanges();

          this.unreadCountSub = combineLatest([usersBL$, unreads$])
            .pipe(
              map(([users, unreads]) => {
                return unreads.filter((mess) => !users.includes(mess.key));
              }),
              map((unreads) => unreads.length)
            )
            .subscribe((unreadQ) => {
              this.unreadCount = unreadQ;
              this.cdr.markForCheck();
            });

          // this.unreadCountSub = this.afDB
          //   .list(`unreadUserMessages/userId_${this.authUser.id}`)
          //   .valueChanges()
          //   .pipe(
          //     map((unreads) => unreads.length)
          //   )
          //   .subscribe((unreadQ) => {
          //     this.unreadCount = unreadQ;
          //     this.cdr.markForCheck();
          //   });
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
