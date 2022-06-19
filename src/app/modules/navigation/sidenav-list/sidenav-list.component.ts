import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { AuthService } from 'src/app/core';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.scss']
})
export class SidenavListComponent implements OnInit {
  @Output() closeSidenav = new EventEmitter<void>();
  isAuth = false;

  constructor(
    private authSrv: AuthService,
  ) { }

  ngOnInit(): void {
    this.authSrv.isAuth.subscribe(authState => {
      this.isAuth = authState;
    })
  }

  onClose() {
    this.closeSidenav.emit();
  }

  onLogout() {}

}
