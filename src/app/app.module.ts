import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgProgressModule } from 'ngx-progressbar';
import { NgProgressHttpModule } from 'ngx-progressbar/http';

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

    SharedModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatToolbarModule,

    AppRoutingModule,
    // AngularFireModule.initializeApp(environment.firebase),
    // provideFirebaseApp(() => initializeApp(environment.firebase)),
    // provideAuth(() => getAuth()),
    // provideDatabase(() => getDatabase()),
    HomeModule,
    NgProgressModule.withConfig({
      color: '#2dd4bf',
      spinner: false,
    }),
    NgProgressHttpModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
  providers: [UIService],
  bootstrap: [AppComponent],
})
export class AppModule {}
