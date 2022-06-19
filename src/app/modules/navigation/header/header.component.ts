import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/core';
import { UIService } from 'src/app/shared';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output() sidenavToggle = new EventEmitter<void>();
  isAuth = false;
  searchTxt = '';

  constructor(
    private authSrv: AuthService,
    private router: Router,
    private uiSrv: UIService,
  ) { }

  ngOnInit(): void {
    this.authSrv.isAuth.subscribe(authState => {
      this.isAuth = authState;
    })
  }

  onToggleSidenav() {
    this.sidenavToggle.emit();
  }

  onLogout() {
    this.authSrv.logout();
  }

  onSearch() {
    if (this.searchTxt.trim().length < 2) {
      this.uiSrv.showSnackbar('Debes ingresar al menos 2 caracteres');
      return;
    };

    this.router.navigate(['/search'], {
      queryParams: {
        q: this.searchTxt,
      }
    })
  }

}
