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
  TAB_COUNT_KEY = 'openTabCount';

  constructor(private store: Store) {}

  ngOnInit(): void {
    registerLocaleData(es);

    this.store.dispatch(authActions.getOnlineUsersCount());
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
    console.log(value);
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
}
