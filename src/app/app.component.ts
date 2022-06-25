import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatSidenav, MatDrawerMode } from '@angular/material/sidenav';
import { AuthService } from './core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  navMode = 'side' as MatDrawerMode;
  navOpened = false;

  constructor(
    private authSrv: AuthService,
  ) {}

  ngOnInit(): void {
    this.authSrv.populate();
  }

  @HostListener('window:resize', ['$event'])
    onResize(event: any) {
        if (event.target.innerWidth >= 768) {
            this.navMode = 'side' as MatDrawerMode;
            this.sidenav.open();
        }
        if (event.target.innerWidth < 768) {
           this.navMode = 'push' as MatDrawerMode;
           this.sidenav.close();
        }
    }
}
