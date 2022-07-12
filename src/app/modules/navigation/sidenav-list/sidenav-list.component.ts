import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { AuthService, DEFAULT_USER_PROFILE_IMG, User } from 'src/app/core';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.scss']
})
export class SidenavListComponent implements OnInit {
  @Output() closeSidenav = new EventEmitter<void>();
  authUser: User = {} as User;
  defaultUserImage = DEFAULT_USER_PROFILE_IMG;
  isAuth = false;

  constructor(
    private authSrv: AuthService,
  ) { }

  ngOnInit(): void {
    this.authSrv.authUser
      .subscribe((user) => {
        if (user.id) {
          this.authUser = user;
          this.isAuth = true;
        } else {
          this.authUser = {} as User;
          this.isAuth = false;
        }
      })
  }

  onClose() {
    this.closeSidenav.emit();
  }

  onLogout() {
    this.authSrv.logout();
  }

}
