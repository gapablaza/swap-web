import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  NgZone,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  Database,
  ref,
  objectVal,
  push,
  list,
  update,
  serverTimestamp,
  remove,
} from '@angular/fire/database';
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
    private firebaseDB: Database,
    private authSrv: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private uiSrv: UIService,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
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
          return list(
            ref(this.firebaseDB, `userMessages/${this.usersIdUrl}`)
          ).pipe(
            map((snapshot) => snapshot.map((mess) => mess.snapshot.val()))
          );
        }),
        map((messages) => {
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
      .subscribe((list) => {
        this.zone.run(() => {
          this.usersMessages = list;
          this.isLoaded = true;
          this.cdr.markForCheck();
        });
      });
    this.subs.add(routeSub);
  }

  onArchive() {
    if (isNaN(this.otherUser.id)) {
      return;
    }

    update(
      ref(
        this.firebaseDB,
        `userResume/userId_${this.authUser.id}/userId_${this.otherUser.id}`
      ),
      { archived: true }
    ).then(() => {
      this.uiSrv.showSuccess('Conversación archivada exitosamente');
      this.router.navigate(['message']);
    });
  }

  // cuando el otro usuario de esta conversación me envía un nuevo mensaje
  // se actualiza como leído
  cleanUnread() {
    const unreadRef = ref(
      this.firebaseDB,
      `unreadUserMessages/userId_${this.authUser.id}/userId_${this.otherUser.id}`
    );
    let unreadSub = objectVal(unreadRef)
      .pipe(filter((resp) => resp !== null))
      .subscribe((resp) => {
        this.zone.run(() => {
          remove(unreadRef);
        });
      });
    this.subs.add(unreadSub);

    let isArchivedSub = objectVal(
      ref(
        this.firebaseDB,
        `userResume/userId_${this.authUser.id}/userId_${this.otherUser.id}`
      )
    ).subscribe((resp: any) => {
      this.zone.run(() => {
        this.isArchived = resp && resp.archived === true;
        this.cdr.markForCheck();
      });
    });
    this.subs.add(isArchivedSub);
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
      timestamp: serverTimestamp(),
    };

    // Escribe en /userMessages
    push(
      ref(this.firebaseDB, `userMessages/${this.usersIdUrl}`),
      newMessage
    ).then(() => {
      // set(ref(this.firebaseDB, `userResume/userId_${this.authUser.id}/userId_${this.otherUser.id}`), { ...newMessage, unread: true });
      // set(ref(this.firebaseDB, `userResume/userId_${this.otherUser.id}/userId_${this.authUser.id}`), { ...newMessage, unread: true });
      // set(ref(this.firebaseDB, `unreadUserMessages/userId_${this.otherUser.id}/userId_${this.authUser.id}`), newMessage);

      let updates: any = {};
      updates[
        `userResume/userId_${this.authUser.id}/userId_${this.otherUser.id}`
      ] = { ...newMessage, unread: true };
      updates[
        `userResume/userId_${this.otherUser.id}/userId_${this.authUser.id}`
      ] = { ...newMessage, unread: true };
      updates[
        `unreadUserMessages/userId_${this.otherUser.id}/userId_${this.authUser.id}`
      ] = newMessage;
      update(ref(this.firebaseDB), updates);
    });

    this.newMessageText = '';
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
