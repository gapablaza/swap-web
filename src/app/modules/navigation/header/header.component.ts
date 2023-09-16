import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from 'src/app/core';
import { UIService } from 'src/app/shared';
import { NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        RouterLink,
        NgIf,
    ],
})
export class HeaderComponent implements OnInit {
  @Output() sidenavToggle = new EventEmitter<void>();
  isAuth = false;
  searchTxt = '';

  constructor(
    private authSrv: AuthService,
    private router: Router,
    private uiSrv: UIService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.authSrv.isAuth.subscribe(authState => {
      this.isAuth = authState;
      this.cdr.markForCheck();
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
