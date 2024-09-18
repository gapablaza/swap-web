import {
  ApplicationConfig,
  Injectable,
  importProvidersFrom,
  isDevMode,
} from '@angular/core';
import { ServiceWorkerModule } from '@angular/service-worker';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import {
  HAMMER_GESTURE_CONFIG,
  HammerGestureConfig,
  HammerModule,
  // provideClientHydration,
  // withNoHttpTransferCache,
} from '@angular/platform-browser';

import { getApp, initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideDatabase, getDatabase } from '@angular/fire/database';
import {
  provideAuth,
  initializeAuth,
  indexedDBLocalPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  getAuth,
} from '@angular/fire/auth';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';

import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { provideState, provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { progressInterceptor } from 'ngx-progressbar/http';

import APP_ROUTES from './app.routes';
import { environment } from 'src/environments/environment';
import { CoreModule, errorInterceptor, tokenInterceptor } from './core';
import { SocialModule } from './shared';
import { authFeature } from './modules/auth/store/auth.state';
import { offlineFeature } from './modules/offline/store/offline.state';
import { AuthEffects } from './modules/auth/store/auth.effects';
import { OfflineEffects } from './modules/offline/store/offline.effects';

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
    provideHttpClient(
      withInterceptors([
        tokenInterceptor,
        errorInterceptor,
        progressInterceptor,
      ])
    ),
    // provideClientHydration(withNoHttpTransferCache()),
    provideRouter(APP_ROUTES),
    provideAnimations(),

    provideStore(),
    provideState(authFeature),
    provideState(offlineFeature),
    provideEffects([AuthEffects, OfflineEffects]),
    provideStoreDevtools({
      maxAge: 25, // Retains last 25 states
      logOnly: !isDevMode(), // Restrict extension to log-only mode
      // autoPause: true, // Pauses recording actions and state changes when the extension window is not open
      // trace: false, //  If set to true, will include stack trace for every dispatched action, so you can see it in trace tab jumping directly to that part of code
      // traceLimit: 75, // maximum stack trace frames to be stored (in case trace option was provided as true)
      // connectInZone: true // If set to true, the connection is established within the Angular zone
    }),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideMessaging(() => getMessaging()),
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
    importProvidersFrom(
      CoreModule,
      HammerModule,
      SocialModule,

      ServiceWorkerModule.register('ngsw-worker.js', {
        enabled: environment.production,
        // Register the ServiceWorker as soon as the application is stable
        // or after 30 seconds (whichever comes first).
        registrationStrategy: 'registerWhenStable:30000',
      })
    ),
    { provide: HAMMER_GESTURE_CONFIG, useClass: MyHammerConfig },
    {
      // https://stackoverflow.com/a/75107066
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        subscriptSizing: 'dynamic',
      },
    },
  ],
};
