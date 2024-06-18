import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  NgZone,
  OnInit,
  Output,
} from '@angular/core';
import { Database, ref, list } from '@angular/fire/database';
import { combineLatest, filter, map, Subscription } from 'rxjs';

import { DEFAULT_USER_PROFILE_IMG, User } from 'src/app/core';
import { MatIconModule } from '@angular/material/icon';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { RouterLink } from '@angular/router';
import { AsyncPipe, NgIf } from '@angular/common';
import { Store } from '@ngrx/store';

// import * as fromApp from '../../../core/store/app.reducer';
import { authFeature } from '../../auth/store/auth.state';
import { authActions } from '../../auth/store/auth.actions'

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgIf, RouterLink, LazyLoadImageModule, MatIconModule, AsyncPipe],
})
export class SidenavListComponent implements OnInit {
  @Output() closeSidenav = new EventEmitter<void>();
  authUser: User = {} as User;
  defaultUserImage = DEFAULT_USER_PROFILE_IMG;
  // unreadCount = 0;
  unreadCount$ = this.store.select(authFeature.selectUnreads);
  unreadCountSub: Subscription = new Subscription();
  subs: Subscription = new Subscription();

  // authUser = this.store.select((state) => state.auth.user);
  // .subscribe((user) => {
  //   if (user.id) {
  //     this.authUser = user;
  //     this.isAuth = true;
  //   } else {
  //     this.authUser = {} as User;
  //     this.isAuth = false;
  //   }
  // });
  isAuth$ = this.store.select(authFeature.selectIsAuth);

  constructor(
    // private authSrv: AuthService,
    // private firebaseDB: Database,
    private store: Store,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) {}

  ngOnInit(): void {
    let authUserSub = this.store
      .select(authFeature.selectUser)
      .subscribe((user) => {
        if (user === null) {
          this.authUser = {} as User;
        } else {
          this.authUser = user;
        }
      });

    // this.authSrv.authUser.subscribe((user) => {
    //   if (user.id) {
    //     this.authUser = user;
    //     this.isAuth = true;
    //   } else {
    //     this.authUser = {} as User;
    //     this.isAuth = false;
    //   }
    //   this.cdr.markForCheck();
    // });
    // this.authSrv.isFBAuth.subscribe((state) => {
    //   if (state) {
    //     const usersBL$ = list(
    //       ref(this.firebaseDB, `userBlacklist/userId_${this.authUser.id}`)
    //     ).pipe(map((snapshot) => snapshot.map((mess) => mess.snapshot.key)));
    //     const unreads$ = list(
    //       ref(this.firebaseDB, `unreadUserMessages/userId_${this.authUser.id}`)
    //     ).pipe(map((snapshot) => snapshot.map((mess) => mess.snapshot)));
    //     this.unreadCountSub = combineLatest([usersBL$, unreads$])
    //       .pipe(
    //         map(([users, unreads]) => {
    //           return unreads.filter((mess) => !users.includes(mess.key));
    //         }),
    //         map((unreads) => unreads.length)
    //       )
    //       .subscribe((unreadQ) => {
    //         this.zone.run(() => {
    //           this.unreadCount = unreadQ;
    //           this.cdr.markForCheck();
    //         });
    //       });
    //   } else {
    //     if (this.unreadCountSub) {
    //       this.unreadCountSub.unsubscribe();
    //     }
    //   }
    // });
  }

  onClose() {
    this.closeSidenav.emit();
  }

  onLogout() {
    this.store.dispatch(authActions.logout());
    // this.authSrv.logout();
  }
}
