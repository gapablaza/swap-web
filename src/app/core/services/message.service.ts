import { Injectable } from '@angular/core';
import {
  Database,
  list,
  objectVal,
  orderByChild,
  push,
  query,
  ref,
  remove,
  serverTimestamp,
  update,
} from '@angular/fire/database';
import { Observable, combineLatest, filter, from, map, take } from 'rxjs';

import { Message, User } from '../models';

@Injectable()
export class MessageService {
  constructor(private firebaseDB: Database) {}

  resume(userId: number): Observable<Message[]> {
    const usersBL$ = list(
      ref(this.firebaseDB, `userBlacklist/userId_${userId}`)
    ).pipe(map((snapshot) => snapshot.map((mess) => mess.snapshot.key)));

    const resume$ = list(
      query(
        ref(this.firebaseDB, `userResume/userId_${userId}`),
        orderByChild('timestamp')
      )
    ).pipe(map((snapshot) => snapshot.map((mess) => mess.snapshot)));

    return combineLatest([usersBL$, resume$]).pipe(
      map(([users, resume]) => {
        return resume.filter((mess) => !users.includes(mess.key));
      }),
      map((messages) => {
        return messages.map((mess) => mess.val() as Message);
      })
    );
  }

  unreads(userId: number): Observable<number> {
    const usersBL$ = list(
      ref(this.firebaseDB, `userBlacklist/userId_${userId}`)
    ).pipe(map((snapshot) => snapshot.map((mess) => mess.snapshot.key)));

    const unreads$ = list(
      ref(this.firebaseDB, `unreadUserMessages/userId_${userId}`)
    ).pipe(map((snapshot) => snapshot.map((mess) => mess.snapshot)));

    return combineLatest([usersBL$, unreads$]).pipe(
      map(([users, unreads]) => {
        return unreads.filter((mess) => !users.includes(mess.key));
      }),
      map((unreads) => unreads.length)
    );
  }

  conversation(userId: number, otherUserId: number): Observable<Message[]> {
    let usersUrl = '';
    if (userId.toString() > otherUserId.toString()) {
      usersUrl = `userId_${otherUserId}/userId_${userId}`;
    } else {
      usersUrl = `userId_${userId}/userId_${otherUserId}`;
    }

    return list(ref(this.firebaseDB, `userMessages/${usersUrl}`)).pipe(
      map((snapshot) => snapshot.map((mess) => mess.snapshot.val() as Message)),
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
    );
  }

  send(user: User, otherUser: User, message: string): Observable<void> {
    let usersUrl = '';
    if (user.id.toString() > otherUser.id.toString()) {
      usersUrl = `userId_${otherUser.id}/userId_${user.id}`;
    } else {
      usersUrl = `userId_${user.id}/userId_${otherUser.id}`;
    }

    const newMessage = {
      fromUserId: user.id,
      fromUserName: user.displayName,
      fromUserImage: user.image,
      toUserId: otherUser.id,
      toUserName: otherUser.displayName,
      toUserImage: otherUser.image,
      body: message,
      timestamp: serverTimestamp(),
    };

    return from(
      push(ref(this.firebaseDB, `userMessages/${usersUrl}`), newMessage).then(
        () => {
          let updates: any = {};
          updates[`userResume/userId_${user.id}/userId_${otherUser.id}`] = {
            ...newMessage,
            unread: true,
          };
          updates[`userResume/userId_${otherUser.id}/userId_${user.id}`] = {
            ...newMessage,
            unread: true,
          };
          updates[
            `unreadUserMessages/userId_${otherUser.id}/userId_${user.id}`
          ] = newMessage;
          return update(ref(this.firebaseDB), updates);
        }
      )
    );
  }

  archive(userId: number, otherUserId: number): Observable<void> {
    return from(
      update(
        ref(
          this.firebaseDB,
          `userResume/userId_${userId}/userId_${otherUserId}`
        ),
        { archived: true }
      )
    );
  }

  cleanUnread(userId: number, otherUserId: number): Observable<unknown> {
    const unreadRef = ref(
      this.firebaseDB,
      `unreadUserMessages/userId_${userId}/userId_${otherUserId}`
    );

    return objectVal(unreadRef).pipe(
      filter((resp) => resp !== null),
      map(() => from(remove(unreadRef)))
    );
  }

  conversationArchived(
    userId: number,
    otherUserId: number
  ): Observable<boolean> {
    return objectVal(
      ref(this.firebaseDB, `userResume/userId_${userId}/userId_${otherUserId}`)
    ).pipe(map((resp: any) => resp && resp.archived === true));
  }
}
