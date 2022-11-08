import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { filter, map, Observable } from 'rxjs';

import { AuthService } from 'src/app/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  version = environment.appVersion;
  counter$!: Observable<number>;

  constructor(
    private afDB: AngularFireDatabase,
    private authSrv: AuthService
  ) {}

  ngOnInit(): void {
    registerLocaleData(es);
    
    this.counter$ = this.afDB
      .list(`onlineUsers`, (ref) =>
        ref.orderByChild('status').equalTo('online')
      )
      .valueChanges()
      .pipe(map((list) => list.length));

    let oldRef = this.afDB.database.refFromURL(
      `${environment.firebase.databaseURL}/onlineUsers`
    );
    let myUserRef = oldRef.push();

    this.afDB
      .object(`.info/connected`)
      .valueChanges()
      .pipe(filter((status) => status == true))
      .subscribe(() => {
        myUserRef
          .onDisconnect()
          .remove()
          .then(() => {
            myUserRef.set({
              status: 'online',
              userId: this.authSrv.getCurrentUser().id || 0,
            });
          });
      });
  }
}
