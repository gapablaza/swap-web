import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';

import 'hammerjs';

import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { appConfig } from './app';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
