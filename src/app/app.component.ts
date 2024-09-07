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
import { Store } from '@ngrx/store';
import {
  MatSidenav,
  MatDrawerMode,
  MatSidenavModule,
} from '@angular/material/sidenav';
import { NgProgressbar } from 'ngx-progressbar';
import { NgProgressHttp } from 'ngx-progressbar/http';

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
    AsyncPipe,

    MatSidenavModule,
    NgProgressbar,
    NgProgressHttp,

    HeaderComponent,
    SidenavListComponent,
    FooterComponent,
  ],
})
export class AppComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  navMode = 'push' as MatDrawerMode;
  navOpened = false;
  TAB_COUNT_KEY = 'openTabCount';
  isInit$ = this.store.select(authFeature.selectIsInit);

  constructor(
    private SEOSrv: SEOService,
    private fbMessaging: Messaging,
    private uiSrv: UIService,
    private router: Router,
    private store: Store,
    @Inject(DOCUMENT) private document: Document
  ) {
    // 1. Agrega scripts de GA al index.html
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

    // 2. Evita que los anuncios se superpongan
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

    this.router.events.subscribe((event) => {
      // 3. limpia la data SEO antes de cambiar de ruta
      // para que se inicialice correctamente
      if (event instanceof NavigationStart) {
        this.SEOSrv.cleanSEO();
      }

      if (event instanceof NavigationEnd) {
        // 4. Suscripción para GA (opcional)
        if (environment.analytics) {
          gtag('config', `${environment.analytics}`, {
            page_path: event.urlAfterRedirects,
          });
        }

        // 5. Cierra el sidebar si es que la pantalla es pequeña
        if (
          typeof window !== 'undefined' &&
          window.innerWidth < 768 &&
          this.sidenav
        ) {
          this.sidenav.close();
        }
      }
    });

    // 6. Despliega el sidebar si es que la pantalla es ancha
    // if (typeof window !== 'undefined' && window.innerWidth >= 768) {
    if ((this.document.defaultView?.innerWidth || 0) >= 768) {
      this.navMode = 'side' as MatDrawerMode;
      this.navOpened = true;
    }

    // 7. Registra el SW y se suscribe a nuevos mensajes
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

    // 8. Control del estado de conexión del usuario
    //    llevando la cuenta de las pestañas abiertas
    this.incrementTabCount();
    // Descuenta la cantidad de pestañas abiertas antes de cerrarla
    window.addEventListener('beforeunload', this.decrementTabCount.bind(this));
  }

  // obtiene la cantidad de pestañas abiertas desde el localStorage
  getTabCount(): number {
    const itemStr = localStorage.getItem(this.TAB_COUNT_KEY);

    if (!itemStr) {
      return 0;
    }

    const item = JSON.parse(itemStr);
    const now = new Date();

    if (now.getTime() > item.expiry) {
      localStorage.removeItem(this.TAB_COUNT_KEY);
      return 0;
    }

    return item.value;
  }

  // Almacena la cantidad de pestañas abiertas en el localStorage
  setTabCountWithExpiration(value: number, ttl: number) {
    const now = new Date();

    // Objeto que contendrá tanto el valor como el tiempo de expiración
    const item = {
      value: value,
      expiry: now.getTime() + ttl,
    };

    localStorage.setItem(this.TAB_COUNT_KEY, JSON.stringify(item));
  }

  // Incrementa el contador de pestañas abiertas al cargar la página
  incrementTabCount() {
    const currentCount = this.getTabCount();
    this.setTabCountWithExpiration(currentCount + 1, 60 * 60 * 24 * 1000);
  }

  // Decrementa el contador de pestañas abiertas al cerrar la página
  decrementTabCount() {
    const currentCount = this.getTabCount();

    if (currentCount <= 1) {
      // Si es la última pestaña, se elimina el registro en el servidor
      this.store.dispatch(authActions.setOfflineStatus());
      localStorage.removeItem(this.TAB_COUNT_KEY);
    } else {
      this.setTabCountWithExpiration(currentCount - 1, 60 * 60 * 24 * 1000);
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
