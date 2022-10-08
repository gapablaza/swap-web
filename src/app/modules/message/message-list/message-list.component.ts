import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';

import {
  AngularFireDatabase,
  AngularFireList,
} from '@angular/fire/compat/database';
import { map, Subscription } from 'rxjs';
import {
  AuthService,
  DEFAULT_USER_PROFILE_IMG,
  Message,
  User,
} from 'src/app/core';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageListComponent implements OnInit, OnDestroy {
  authUser: User = {} as User;
  defaultUserImage = DEFAULT_USER_PROFILE_IMG;
  messagesRef!: AngularFireList<any>;
  messages: any[] = [];
  showedMessages: any[] = [];

  searchText = '';
  typeSelected = '1';

  showFilters = true;
  isLoaded = false;
  subs: Subscription = new Subscription();

  constructor(
    private afDB: AngularFireDatabase,
    private authSrv: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.authUser = this.authSrv.getCurrentUser();

    this.messagesRef = this.afDB.list(`userResume/userId_${this.authUser.id}`);
    let messagesSub = this.messagesRef
      .snapshotChanges()
      .pipe(
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
    this.subs.add(messagesSub);
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

    this.showedMessages = [...tempMessages];
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
