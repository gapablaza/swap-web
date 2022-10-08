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
import firebase from 'firebase/compat/app';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, map, Subscription, switchMap, tap } from 'rxjs';
import {
  AuthService,
  DEFAULT_USER_PROFILE_IMG,
  Message,
  User,
} from 'src/app/core';
import { UIService } from 'src/app/shared';

export interface IMessage extends Message {
  newDate: boolean;
}

@Component({
  selector: 'app-message-with-user',
  templateUrl: './message-with-user.component.html',
  styleUrls: ['./message-with-user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageWithUserComponent implements OnInit, OnDestroy {
  usersMessagesRef!: AngularFireList<any>;
  usersMessages: IMessage[] = [];
  authUser: User = {} as User;
  otherUser: User = {} as User;
  otherUserId = 0;
  usersIdUrl = '';
  tempDate = '';
  newMessageText = '';
  defaultUserImage = DEFAULT_USER_PROFILE_IMG;
  isArchived = false;
  isLoaded = false;
  subs: Subscription = new Subscription();

  constructor(
    private afDB: AngularFireDatabase,
    private authSrv: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private uiSrv: UIService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.authUser = this.authSrv.getCurrentUser();
    this.otherUser = this.route.snapshot.data['userData'];

    let routeSub = this.route.params
      .pipe(
        map((params) => Number(params['userId'])),
        tap((userId) => {
          this.otherUserId = userId;
          this.cleanUnread();
          if (this.authUser.id.toString() > userId.toString()) {
            this.usersIdUrl = `userId_${userId}/userId_${this.authUser.id}`;
          } else {
            this.usersIdUrl = `userId_${this.authUser.id}/userId_${userId}`;
          }
        }),
        switchMap(() => {
          this.usersMessagesRef = this.afDB.list(
            `userMessages/${this.usersIdUrl}`
          );
          return this.usersMessagesRef.valueChanges();
        })
      )
      .subscribe((list) => {
        let actualDate = '';

        this.usersMessages = list.map((e: Message) => {
          let tempDate = new Date(e.timestamp || 0 * 1000).toDateString();
          if (actualDate != tempDate) {
            actualDate = tempDate;
            return {
              ...e,
              newDate: true,
            };
          } else {
            return {
              ...e,
              newDate: false,
            };
          }
        });
        this.isLoaded = true;
        this.cdr.markForCheck();
      });
    this.subs.add(routeSub);
  }

  onArchive() {
    if (isNaN(this.otherUser.id)) {
      return;
    }

    this.afDB
      .object(
        `userResume/userId_${this.authUser.id}/userId_${this.otherUser.id}`
      )
      .update({ archived: true })
      .then(() => {
        this.uiSrv.showSuccess('Conversación archivada exitosamente');
        this.router.navigate(['message']);
      });
  }

  // cuando el otro usuario de esta conversación me envía un nuevo mensaje
  // se actualiza como leído
  cleanUnread() {
    let unreadSub = this.afDB
      .object(
        `userResume/userId_${this.authUser.id}/userId_${this.otherUser.id}`
      )
      .valueChanges()
      .pipe(
        tap((resp: any) => {
          this.isArchived = resp.archived === true;
          this.cdr.markForCheck();
        }),
        filter(
          (resp: any) =>
            resp.toUserId == this.authUser.id && resp.unread !== false
        )
      )
      .subscribe(() => {
        this.afDB
          .object(
            `userResume/userId_${this.otherUser.id}/userId_${this.authUser.id}`
          )
          .update({ unread: false });
        this.afDB
          .object(
            `userResume/userId_${this.authUser.id}/userId_${this.otherUser.id}`
          )
          .update({ unread: false });
      });
    this.subs.add(unreadSub);
  }

  onSend() {
    if (this.newMessageText.trim().length == 0) {
      return;
    }
    if (isNaN(this.otherUser.id)) {
      return;
    }
    if (this.authUser.disabled || this.otherUser.disabled) {
      return;
    }

    let newMessage = {
      fromUserId: this.authUser.id,
      fromUserName: this.authUser.displayName,
      fromUserImage: this.authUser.image,
      toUserId: this.otherUser.id,
      toUserName: this.otherUser.displayName,
      toUserImage: this.otherUser.image,
      body: this.newMessageText.trim().substring(0, 500),
      timestamp: firebase.database.ServerValue.TIMESTAMP,
    };

    this.usersMessagesRef.push(newMessage).then(() => {
      this.afDB
        .list(`userResume/userId_${this.authUser.id}/`)
        .set(`userId_${this.otherUser.id}`, { ...newMessage, unread: true });
      this.afDB
        .list(`userResume/userId_${this.otherUser.id}/`)
        .set(`userId_${this.authUser.id}`, { ...newMessage, unread: true });
    });

    this.newMessageText = '';
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
