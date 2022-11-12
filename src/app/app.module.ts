import { Injectable, NgModule } from '@angular/core';
import { BrowserModule, HammerGestureConfig, HammerModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import 'hammerjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgProgressModule } from 'ngx-progressbar';
import { NgProgressHttpModule } from 'ngx-progressbar/http';

import { AngularFireModule } from '@angular/fire/compat';
import { getApp } from '@angular/fire/app';
// import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth, initializeAuth, indexedDBLocalPersistence, browserLocalPersistence } from '@angular/fire/auth';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { AngularFireMessagingModule, SERVICE_WORKER, VAPID_KEY } from '@angular/fire/compat/messaging';

import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core';
import { HomeModule } from './modules/home/home.module';
import { SharedModule } from './shared/shared.module';
import { UIService } from './shared';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';

import { AppComponent } from './app.component';
import { HeaderComponent } from './modules/navigation/header/header.component';
import { SidenavListComponent } from './modules/navigation/sidenav-list/sidenav-list.component';
import { CustomErrorComponent } from './modules/navigation/custom-error/custom-error.component';
import { FooterComponent } from './modules/navigation/footer/footer.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

@Injectable()
export class HammerConfig extends HammerGestureConfig {
  override overrides = <any> {
      // I will only use the swap gesture so 
      // I will deactivate the others to avoid overlaps
      // pinch: { enable: false },
      // rotate: { enable: false }
      'tap': { time: 500 },
      'press': { time: 501 }
  }
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidenavListComponent,
    CustomErrorComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    HammerModule,

    SharedModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatToolbarModule,

    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireMessagingModule,
    // provideAuth(() => getAuth()),
    provideAuth(() => initializeAuth(getApp(), {
      persistence: [indexedDBLocalPersistence, browserLocalPersistence],
      popupRedirectResolver: undefined
    })),
    provideDatabase(() => getDatabase()),
    // provideFirebaseApp(() => initializeApp(environment.firebase)),
    HomeModule,
    NgProgressModule.withConfig({
      color: '#2dd4bf',
      spinner: false,
    }),
    NgProgressHttpModule,
  ],
  providers: [
    UIService,
    { provide: HAMMER_GESTURE_CONFIG, useClass: HammerConfig },
    { provide: VAPID_KEY, useValue: environment.vapidKey },
    { provide: SERVICE_WORKER, useFactory: () => typeof navigator !== 'undefined' && navigator.serviceWorker?.register('firebase-messaging-sw.js', { scope: '__' }) || undefined },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
