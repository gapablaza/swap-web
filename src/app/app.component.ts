import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import {
  MatSidenav,
  MatDrawerMode,
  MatSidenavModule,
} from '@angular/material/sidenav';
import {
  NavigationEnd,
  NavigationStart,
  Router,
  RouterOutlet,
} from '@angular/router';
import { filter } from 'rxjs';

import { environment } from 'src/environments/environment';
import { AuthService, SEOService } from './core';
import { UIService } from './shared';
import { FooterComponent } from './modules/navigation/footer/footer.component';
import { SidenavListComponent } from './modules/navigation/sidenav-list/sidenav-list.component';
import { NgProgressModule } from 'ngx-progressbar';
import { HeaderComponent } from './modules/navigation/header/header.component';
// import { MatToolbarModule } from '@angular/material/toolbar';
// import { MatButtonModule } from '@angular/material/button';
// import { MatIconModule } from '@angular/material/icon';
// import { MatSnackBarModule } from '@angular/material/snack-bar';
// import { MatBottomSheetModule } from '@angular/material/bottom-sheet';

declare const gtag: Function;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    RouterOutlet,
    NgProgressModule,

    MatSidenavModule,
    // MatToolbarModule,
    // MatButtonModule,
    // MatIconModule,
    // MatSnackBarModule,
    // MatBottomSheetModule,
    
    HeaderComponent,
    SidenavListComponent,
    FooterComponent,
  ],
})
export class AppComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  navMode = 'push' as MatDrawerMode;
  navOpened = false;

  constructor(
    private authSrv: AuthService,
    private SEOSrv: SEOService,
    private afMessaging: AngularFireMessaging,
    private uiSrv: UIService,
    private router: Router
  ) {
    // agrega scripts de GA al index.html
    if (environment.analytics) {
      // register google tag manager
      const gTagManagerScript = document.createElement('script');
      gTagManagerScript.async = true;
      gTagManagerScript.src = `https://www.googletagmanager.com/gtag/js?id=${environment.analytics}`;
      document.head.appendChild(gTagManagerScript);

      // register google analytics
      const gaScript = document.createElement('script');
      gaScript.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        gtag('js', new Date());

        gtag('config', '${environment.analytics}');
      `;
      document.head.appendChild(gaScript);
    }

    // evita modificación de estilos por los ads
    const fixStylesAdsScript = document.createElement('script');
    fixStylesAdsScript.innerHTML = `
      var flex = document.getElementsByTagName('app-root')[0];
      const observer = new MutationObserver(function (mutations, observer) {
          flex.style.height = "";
      });
      observer.observe(flex, {
          attributes: true,
          attributeFilter: ['style']
      });
    `;
    document.head.appendChild(fixStylesAdsScript);
  }

  ngOnInit(): void {
    // Suscripción para GA (opcional) y ancho responsivo
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Suscripción para GA
        if (environment.analytics) {
          gtag('config', `${environment.analytics}`, {
            page_path: event.urlAfterRedirects,
          });
        }

        if (window.innerWidth < 768) {
          this.sidenav.close();
        }
      }

      // limpia la data SEO antes de cambiar de ruta
      // para que se inicialice correctamente
      if (event instanceof NavigationStart) {
        this.SEOSrv.cleanSEO();
      }
    });

    // Despliega el sidebar si es que la pantalla es ancha
    if (window.innerWidth >= 768) {
      this.navMode = 'side' as MatDrawerMode;
      this.navOpened = true;
    }

    // Subscripción a notificación de nuevos mensajes
    this.afMessaging.getToken
      .pipe(filter((token) => token != null))
      .subscribe((token) => {
        this.afMessaging.onMessage((payload) => {
          this.uiSrv.showSnackbar('Tienes un nuevo mensaje!');
        });
      });

    this.authSrv.populate();
  }

  // Ajusta el modo de la sidenav dependiendo del ancho de la pantalla
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (event.target.innerWidth >= 768) {
      this.navMode = 'side' as MatDrawerMode;
    }
    if (event.target.innerWidth < 768) {
      this.navMode = 'push' as MatDrawerMode;
    }
  }
}
