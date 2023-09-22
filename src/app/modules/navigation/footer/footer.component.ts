import { registerLocaleData, AsyncPipe, DecimalPipe } from '@angular/common';
import es from '@angular/common/locales/es';
import { Component, OnInit } from '@angular/core';
import {
  Database,
  ref,
  onValue,
  object,
  objectVal,
  set,
  push,
  list,
  query,
  orderByChild,
  equalTo,
  onDisconnect,
  listVal,
} from '@angular/fire/database';
// import { AngularFireDatabase } from '@angular/fire/compat/database';
import { filter, from, map, Observable, tap } from 'rxjs';

import { AuthService } from 'src/app/core';
import { environment } from 'src/environments/environment';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [RouterLink, MatIconModule, AsyncPipe, DecimalPipe],
})
export class FooterComponent implements OnInit {
  version = environment.appVersion;
  counter$!: Observable<number>;

  constructor(
    // private afDB: AngularFireDatabase,
    private firebaseDB: Database,
    private authSrv: AuthService
  ) {}

  ngOnInit(): void {
    registerLocaleData(es);

    this.counter$ = list(
      query(
        ref(this.firebaseDB, `onlineUsers`),
        orderByChild('status'),
        equalTo('online')
      )
    ).pipe(
      // tap((resp) => console.log(resp)),
      map((list) => list.length || 1)
    );

    // onValue(
    //   query(
    //     ref(this.firebaseDB, `onlineUsers`),
    //     orderByChild('status'),
    //     equalTo('online')
    //   ), (snapshot) => {
    //     console.log(snapshot.size);
    //     // this.counter$ = snapshot.size
    //   }
    // )

    const onlineUsersRef = ref(this.firebaseDB, `onlineUsers`);
    const connectedRef = ref(this.firebaseDB, `.info/connected`);
    onValue(connectedRef, (snap) => {
      if (snap.val() === true) {
        // We're connected (or reconnected)! 
        // Do anything here that should happen only if online (or on reconnect)
        const myUserRef = push(onlineUsersRef);

        // When I disconnect, remove this device
        onDisconnect(myUserRef).remove();

        // Add this device to my connections list
        // this value could contain info about the device or a timestamp too
        set(myUserRef, {
          status: 'online',
          userId: this.authSrv.getCurrentUser().id || 0,
        });
      }
    });
  }
}
