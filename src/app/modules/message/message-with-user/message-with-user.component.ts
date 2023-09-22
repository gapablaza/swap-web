import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  Database,
  ref,
  onValue,
  object,
  objectVal,
  set,
  push,
  list,
  update,
  query,
  orderByChild,
  equalTo,
  onDisconnect,
  listVal,
  serverTimestamp,
} from '@angular/fire/database';
// import {
//   AngularFireDatabase,
//   AngularFireList,
// } from '@angular/fire/compat/database';
// import firebase from 'firebase/compat/app';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { filter, map, Subscription, switchMap, tap } from 'rxjs';
import {
  AuthService,
  DEFAULT_USER_PROFILE_IMG,
  Message,
  User,
} from 'src/app/core';
import { UIService } from 'src/app/shared';
import { FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgIf, NgFor, NgClass, DatePipe } from '@angular/common';

export interface IMessage extends Message {
  newDate: boolean;
}

@Component({
    selector: 'app-message-with-user',
    templateUrl: './message-with-user.component.html',
    styleUrls: ['./message-with-user.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        NgIf,
        MatProgressSpinnerModule,
        MatButtonModule,
        RouterLink,
        MatIconModule,
        LazyLoadImageModule,
        MatMenuModule,
        NgFor,
        NgClass,
        FormsModule,
        DatePipe,
    ],
})
export class MessageWithUserComponent implements OnInit, OnDestroy {
  // usersMessagesRef!: AngularFireList<any>;
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
    // private afDB: AngularFireDatabase,
    private firebaseDB: Database,
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
        // switchMap(() => {
        //   this.usersMessagesRef = this.afDB.list(
        //     `userMessages/${this.usersIdUrl}`
        //   );
        //   return this.usersMessagesRef.valueChanges();
        // })
        switchMap(() => {
          return list(ref(this.firebaseDB, `userMessages/${this.usersIdUrl}`))
            .pipe(map((snapshot) => snapshot.map((mess) => mess.snapshot.val())));
        }),
        map(messages => {
          let actualDate = '';
          return messages.map((e: Message) => {
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
        })
      )
      // .subscribe(resp => console.log(resp));
      .subscribe((list) => {
        this.usersMessages = list;
        this.isLoaded = true;
        this.cdr.markForCheck();
      });
    this.subs.add(routeSub);
  }

  onArchive() {
    if (isNaN(this.otherUser.id)) {
      return;
    }

    // this.afDB
    //   .object(
    //     `userResume/userId_${this.authUser.id}/userId_${this.otherUser.id}`
    //   )
    //   .update({ archived: true })
    //   .then(() => {
    //     this.uiSrv.showSuccess('Conversación archivada exitosamente');
    //     this.router.navigate(['message']);
    //   });
  }

  // cuando el otro usuario de esta conversación me envía un nuevo mensaje
  // se actualiza como leído
  cleanUnread() {
    // let unreadRef = this.afDB.object(
    //   `unreadUserMessages/userId_${this.authUser.id}/userId_${this.otherUser.id}`
    // );
    // let oldUnreadSub = unreadRef
    //   .snapshotChanges()
    //   .pipe(filter((resp: any) => resp.key != null))
    //   .subscribe((resp: any) => {
    //     unreadRef.remove();
    //   });
    // this.subs.add(oldUnreadSub);

    // let newUnreadSub = this.afDB
    //   .object(
    //     `userResume/userId_${this.authUser.id}/userId_${this.otherUser.id}`
    //   )
    //   .valueChanges()
    //   .subscribe((resp: any) => {
    //     this.isArchived = resp && resp.archived === true;
    //     this.cdr.markForCheck();
    //   })
    // this.subs.add(newUnreadSub);
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
      // timestamp: firebase.database.ServerValue.TIMESTAMP,
      timestamp: serverTimestamp(),
    };

    // // Escribe en /userMessages
    // this.usersMessagesRef.push(newMessage).then(() => {
    //   // escribe en /userResume del authUser
    //   this.afDB
    //     .list(`userResume/userId_${this.authUser.id}/`)
    //     .set(`userId_${this.otherUser.id}`, { ...newMessage, unread: true });
    //   // escribe en /userResume del otherUser
    //   this.afDB
    //     .list(`userResume/userId_${this.otherUser.id}/`)
    //     .set(`userId_${this.authUser.id}`, { ...newMessage, unread: true });
    //   // escribe en /unreadUserMessages del otherUser
    //   this.afDB
    //     .list(`unreadUserMessages/userId_${this.otherUser.id}/`)
    //     .set(`userId_${this.authUser.id}`, newMessage);
    // });
    push(ref(this.firebaseDB, `userMessages/${this.usersIdUrl}`), newMessage).then(() => {
      // set(ref(this.firebaseDB, `userResume/userId_${this.authUser.id}/userId_${this.otherUser.id}`), { ...newMessage, unread: true });
      // set(ref(this.firebaseDB, `userResume/userId_${this.otherUser.id}/userId_${this.authUser.id}`), { ...newMessage, unread: true });
      // set(ref(this.firebaseDB, `unreadUserMessages/userId_${this.otherUser.id}/userId_${this.authUser.id}`), newMessage);

      let updates:any = {};
      updates[`userResume/userId_${this.authUser.id}/userId_${this.otherUser.id}`] = { ...newMessage, unread: true };
      updates[`userResume/userId_${this.otherUser.id}/userId_${this.authUser.id}`] = { ...newMessage, unread: true };
      updates[`unreadUserMessages/userId_${this.otherUser.id}/userId_${this.authUser.id}`] = newMessage;
      update(ref(this.firebaseDB), updates);
    });

    this.newMessageText = '';
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
