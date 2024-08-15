import {
  Component,
  HostListener,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AsyncPipe, DOCUMENT } from '@angular/common';
import {
  NavigationEnd,
  NavigationStart,
  Router,
  RouterOutlet,
} from '@angular/router';
import { Messaging, onMessage } from '@angular/fire/messaging';
import { NgProgressModule } from 'ngx-progressbar';
import { Store } from '@ngrx/store';
import {
  MatSidenav,
  MatDrawerMode,
  MatSidenavModule,
} from '@angular/material/sidenav';

import { environment } from 'src/environments/environment';
import { SEOService } from './core';
import { UIService } from './shared';
import { FooterComponent } from './modules/navigation/footer/footer.component';
import { SidenavListComponent } from './modules/navigation/sidenav-list/sidenav-list.component';
import { HeaderComponent } from './modules/navigation/header/header.component';
import { authActions } from './modules/auth/store/auth.actions';
import { authFeature } from './modules/auth/store/auth.state';

declare const gtag: Function;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [
    RouterOutlet,
    NgProgressModule,
    AsyncPipe,

    MatSidenavModule,

    HeaderComponent,
    SidenavListComponent,
    FooterComponent,
  ],
})
export class AppComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  navMode = 'push' as MatDrawerMode;
  navOpened = false;
  isInit$ = this.store.select(authFeature.selectIsInit);

  constructor(
    private SEOSrv: SEOService,
    private fbMessaging: Messaging,
    private uiSrv: UIService,
    private router: Router,
    private store: Store,
    @Inject(DOCUMENT) private document: Document
  ) {
    // agrega scripts de GA al index.html
    if (environment.analytics) {
      // register google tag manager
      const gTagManagerScript = this.document.createElement('script');
      gTagManagerScript.async = true;
      gTagManagerScript.src = `https://www.googletagmanager.com/gtag/js?id=${environment.analytics}`;
      this.document.head.appendChild(gTagManagerScript);

      // register google analytics
      const gaScript = this.document.createElement('script');
      gaScript.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        gtag('js', new Date());

        gtag('config', '${environment.analytics}');
      `;
      this.document.head.appendChild(gaScript);
    }

    if (typeof window !== 'undefined') {
      // evita modificación de estilos por los ads
      const fixStylesAdsScript = this.document.createElement('script');
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
      this.document.head.appendChild(fixStylesAdsScript);
    }
  }

  ngOnInit(): void {
    this.store.dispatch(authActions.autoLogin());

    // Suscripción para GA (opcional) y ancho responsivo
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Suscripción para GA
        if (environment.analytics) {
          gtag('config', `${environment.analytics}`, {
            page_path: event.urlAfterRedirects,
          });
        }

        if (
          typeof window !== 'undefined' &&
          window.innerWidth < 768 &&
          this.sidenav
        ) {
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
    // if (typeof window !== 'undefined' && window.innerWidth >= 768) {
    if ((this.document.defaultView?.innerWidth || 0) >= 768) {
      this.navMode = 'side' as MatDrawerMode;
      this.navOpened = true;
    }

    // Registra el SW y se suscribe a nuevos mensajes
    if (typeof navigator !== 'undefined') {
      navigator.serviceWorker
        .register('firebase-messaging-sw.js', {
          // type: 'module',
          scope: '__',
        })
        .then((ServiceWorkerRegistration) => {
          onMessage(this.fbMessaging, (payload) => {
            this.uiSrv.showSuccess('Tienes un nuevo mensaje!');
          });
        });
    }
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
