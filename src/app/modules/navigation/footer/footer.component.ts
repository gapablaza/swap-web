import { registerLocaleData, AsyncPipe, DecimalPipe } from '@angular/common';
import es from '@angular/common/locales/es';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';

import { environment } from 'src/environments/environment';
import { authActions } from '../../auth/store/auth.actions';
import { authFeature } from '../../auth/store/auth.state';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  standalone: true,
  imports: [AsyncPipe, DecimalPipe, RouterLink, MatIconModule],
})
export class FooterComponent implements OnInit {
  version = environment.appVersion;
  usersOnline = this.store.select(authFeature.selectOnlineUsers);

  constructor(private store: Store) {}

  ngOnInit(): void {
    registerLocaleData(es);

    this.store.dispatch(authActions.getOnlineUsersCount());
  }
}
