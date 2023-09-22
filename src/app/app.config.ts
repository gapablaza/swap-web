import {
  ApplicationConfig,
  Injectable,
  importProvidersFrom,
} from '@angular/core';
import { ServiceWorkerModule } from '@angular/service-worker';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import * as hammerjs from '@egjs/hammerjs';
import {
  HAMMER_GESTURE_CONFIG,
  HammerGestureConfig,
  HammerModule,
  provideClientHydration,
} from '@angular/platform-browser';

import { provideDatabase, getDatabase } from '@angular/fire/database';
import { getApp, initializeApp, provideFirebaseApp } from '@angular/fire/app';
import {
  provideAuth,
  initializeAuth,
  indexedDBLocalPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from '@angular/fire/auth';
// import { AngularFireModule } from '@angular/fire/compat';
// import {
//   VAPID_KEY,
//   SERVICE_WORKER,
//   AngularFireMessagingModule,
// } from '@angular/fire/compat/messaging';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';
import { NgProgressHttpModule } from 'ngx-progressbar/http';
import { NgProgressModule } from 'ngx-progressbar';

import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

import { CoreModule, errorInterceptor, tokenInterceptor } from './core';
import { environment } from 'src/environments/environment';
import { UIService } from './shared';
import APP_ROUTES from './app.routes';
import { getAuth } from 'firebase/auth';

@Injectable()
export class MyHammerConfig extends HammerGestureConfig {
  override overrides = <any>{
    // I will only use the swap gesture so
    // I will deactivate the others to avoid overlaps
    // pinch: { enable: false },
    // rotate: { enable: false }
    tap: { time: 500 },
    press: { time: 501 },
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([tokenInterceptor, errorInterceptor])),
    provideClientHydration(),
    provideRouter(APP_ROUTES),
    provideAnimations(),
    importProvidersFrom(
      CoreModule,
      HammerModule,

      MatSnackBarModule, // UIService lo necesita
      MatBottomSheetModule, // UIService lo necesita

      ServiceWorkerModule.register('ngsw-worker.js', {
        enabled: environment.production,
        // Register the ServiceWorker as soon as the application is stable
        // or after 30 seconds (whichever comes first).
        registrationStrategy: 'registerWhenStable:30000',
      }),
      provideFirebaseApp(() => initializeApp(environment.firebase)),
      provideMessaging(() => getMessaging()),
      // AngularFireModule.initializeApp(environment.firebase),
      // AngularFireMessagingModule,
      // provideAuth(() => getAuth()),
      // provideAuth(() =>
      //   initializeAuth(getApp(), {
      //     persistence: [
      //       indexedDBLocalPersistence,
      //       browserLocalPersistence,
      //       browserSessionPersistence,
      //     ],
      //   })
      // ),
      provideAuth(() =>
        typeof document === 'undefined'
          ? getAuth(getApp())
          : initializeAuth(getApp(), {
              persistence: [
                indexedDBLocalPersistence,
                browserLocalPersistence,
                browserSessionPersistence,
              ],
            })
      ),
      provideDatabase(() => getDatabase()),
      NgProgressModule.withConfig({
        color: '#2dd4bf',
        spinner: false,
      }),
      NgProgressHttpModule
    ),
    { provide: HAMMER_GESTURE_CONFIG, useClass: MyHammerConfig },
    // { provide: VAPID_KEY, useValue: environment.vapidKey },
    // {
    //   provide: SERVICE_WORKER,
    //   useFactory: () =>
    //     (typeof navigator !== 'undefined' &&
    //       navigator.serviceWorker?.register('firebase-messaging-sw.js', {
    //         scope: '__',
    //       })) ||
    //     undefined,
    // },
    {
      // https://stackoverflow.com/a/75107066
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        subscriptSizing: 'dynamic',
      },
    },
    UIService,
  ],
};
