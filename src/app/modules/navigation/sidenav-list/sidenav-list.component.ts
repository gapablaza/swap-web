import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { Store } from '@ngrx/store';

import { DEFAULT_USER_PROFILE_IMG } from 'src/app/core';
import { authFeature } from '../../auth/store/auth.state';
import { authActions } from '../../auth/store/auth.actions';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AsyncPipe, RouterLink, MatIconModule],
})
export class SidenavListComponent {
  defaultUserImage = DEFAULT_USER_PROFILE_IMG;

  isAuth$ = this.store.select(authFeature.selectIsAuth);
  authUser$ = this.store.select(authFeature.selectUser);
  unreadCount$ = this.store.select(authFeature.selectUnreads);

  constructor(private store: Store) {}

  onLogout() {
    this.store.dispatch(authActions.logoutStart());
  }
}
