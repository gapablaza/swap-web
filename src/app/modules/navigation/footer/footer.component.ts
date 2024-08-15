import { registerLocaleData, AsyncPipe, DecimalPipe } from '@angular/common';
import es from '@angular/common/locales/es';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  standalone: true,
  imports: [RouterLink, MatIconModule, DecimalPipe],
})
export class FooterComponent implements OnInit {
  version = environment.appVersion;

  constructor() {}

  ngOnInit(): void {
    registerLocaleData(es);

    // TO DO: Agregar el despliegue de la cantidad de usuarios conectados
    //        manejando los usuarios no registrados, y sin duplicar

    // this.counter$ = list(
    //   query(
    //     ref(this.firebaseDB, `onlineUsers`),
    //     orderByChild('status'),
    //     equalTo('online')
    //   )
    // ).pipe(map((list) => list.length || 1));

    // const onlineUsersRef = ref(this.firebaseDB, `onlineUsers`);
    // const connectedRef = ref(this.firebaseDB, `.info/connected`);
    // onValue(connectedRef, (snap) => {
    //   if (snap.val() === true) {
    //     // We're connected (or reconnected)!
    //     // Do anything here that should happen only if online (or on reconnect)
    //     const myUserRef = push(onlineUsersRef);

    //     // When I disconnect, remove this device
    //     onDisconnect(myUserRef).remove();

    //     // Add this device to my connections list
    //     // this value could contain info about the device or a timestamp too
    //     set(myUserRef, {
    //       status: 'online',
    //       userId: this.authSrv.getCurrentUser().id || 0,
    //       lastUpdated: serverTimestamp(),
    //     });
    //   }
    // });
  }
}
