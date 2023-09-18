import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { NgIf, NgClass, NgFor, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  AngularFireDatabase,
  AngularFireList,
} from '@angular/fire/compat/database';
import { combineLatest, map, Subscription } from 'rxjs';
import { LazyLoadImageModule } from 'ng-lazyload-image';

import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService, DEFAULT_USER_PROFILE_IMG, Message } from 'src/app/core';
import { AdsModule } from 'src/app/shared/ads.module';
import { UIService } from 'src/app/shared';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    MatProgressSpinnerModule,
    AdsModule,
    NgClass,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule,
    NgFor,
    RouterLink,
    LazyLoadImageModule,
    DatePipe,
  ],
})
export class MessageListComponent implements OnInit, OnDestroy {
  authUser = this.authSrv.getCurrentUser();
  defaultUserImage = DEFAULT_USER_PROFILE_IMG;
  messagesRef!: AngularFireList<any>;
  messages: any[] = [];
  showedMessages: any[] = [];
  unreadUserIds: number[] = [];

  searchText = '';
  typeSelected = '1';

  showFilters = true;
  isAdsLoaded = false;
  isLoaded = false;
  subs: Subscription = new Subscription();

  constructor(
    private afDB: AngularFireDatabase,
    private authSrv: AuthService,
    private uiSrv: UIService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const usersBL$ = this.afDB
      .list(`userBlacklist/userId_${this.authUser.id}`)
      .snapshotChanges()
      .pipe(
        map((users) =>
          // users.map((user) => Number(user.key?.split('_')[1]))
          users.map((user) => user.key)
        )
      );

    const resume$ = this.afDB
      .list(`userResume/userId_${this.authUser.id}`, (ref) =>
        ref.orderByChild('timestamp')
      )
      .snapshotChanges();

    let blacklistSub = combineLatest([usersBL$, resume$])
      .pipe(
        map(([users, resume]) => {
          return resume.filter((mess) => !users.includes(mess.key));
        }),
        map((messages) => {
          return messages.map((mess) => {
            let payload = mess.payload.val() as Message;
            return {
              withUserId:
                payload.toUserId == this.authUser.id
                  ? payload.fromUserId
                  : payload.toUserId,
              withUserName:
                payload.toUserId == this.authUser.id
                  ? payload.fromUserName
                  : payload.toUserName,
              withUserImage:
                payload.toUserId == this.authUser.id
                  ? payload.fromUserImage
                  : payload.toUserImage,
              withUserText: payload.body,
              withUserTime: payload.timestamp,
              fromAuthUser:
                payload.fromUserId == this.authUser.id ? true : false,
              unread: payload.unread === false ? false : true,
              archived: payload.archived === true ? true : false,
            };
          });
        })
      )
      .subscribe((list) => {
        this.messages = list;
        this.filterShowedMessages();
        this.isLoaded = true;
        this.cdr.markForCheck();
      });
    this.subs.add(blacklistSub);

    // this.messagesRef = this.afDB.list(
    //   `userResume/userId_${this.authUser.id}`,
    //   (ref) => ref.orderByChild('timestamp')
    // );

    // let messagesSub = this.messagesRef
    //   .snapshotChanges()
    //   .pipe(
    //     map((messages) => {
    //       return messages.map((mess) => {
    //         let payload = mess.payload.val() as Message;
    //         return {
    //           withUserId:
    //             payload.toUserId == this.authUser.id
    //               ? payload.fromUserId
    //               : payload.toUserId,
    //           withUserName:
    //             payload.toUserId == this.authUser.id
    //               ? payload.fromUserName
    //               : payload.toUserName,
    //           withUserImage:
    //             payload.toUserId == this.authUser.id
    //               ? payload.fromUserImage
    //               : payload.toUserImage,
    //           withUserText: payload.body,
    //           withUserTime: payload.timestamp,
    //           fromAuthUser:
    //             payload.fromUserId == this.authUser.id ? true : false,
    //           unread: payload.unread === false ? false : true,
    //           archived: payload.archived === true ? true : false,
    //         };
    //       });
    //     })
    //   )
    //   .subscribe((list) => {
    //     this.messages = list;
    //     this.filterShowedMessages();
    //     this.isLoaded = true;
    //     this.cdr.markForCheck();
    //   });
    // this.subs.add(messagesSub);

    if (this.authUser.accountTypeId == 1) {
      this.loadAds();
    }
  }

  loadAds() {
    this.uiSrv.loadAds().then(() => {
      this.isAdsLoaded = true;
    });
  }

  trackByUsers(index: number, item: any): number {
    return item.withUserId;
  }

  onFilter() {
    this.filterShowedMessages();
  }

  onClearFilter() {
    this.searchText = '';
    this.filterShowedMessages();
  }

  filterShowedMessages() {
    let tempMessages = this.messages;
    let type = parseInt(this.typeSelected);

    // 1.- check filter by text
    // check at least 2 chars for search
    if (this.searchText.length > 1) {
      tempMessages = [
        ...this.messages.filter((elem: any) => {
          return (
            elem.withUserName
              .toLocaleLowerCase()
              .indexOf(this.searchText.toLocaleLowerCase()) !== -1 ||
            elem.withUserId
              .toString()
              .indexOf(this.searchText.toLocaleLowerCase()) !== -1 ||
            elem.withUserText
              .toLocaleLowerCase()
              .indexOf(this.searchText.toLocaleLowerCase()) !== -1
          );
        }),
      ];
    }

    // 2.- check filter by evaluation type
    if (type) {
      tempMessages = [
        ...tempMessages.filter((elem) => {
          return type == 1 ? !elem.archived : elem.archived;
        }),
      ];
    }

    this.showedMessages = [...tempMessages.reverse()];
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
