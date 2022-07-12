import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgProgressModule } from 'ngx-progressbar';
import { NgProgressHttpModule } from 'ngx-progressbar/http';
// import { AngularFireModule } from '@angular/fire/compat';
// import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
// import { provideAuth, getAuth } from '@angular/fire/auth';
// import { provideDatabase, getDatabase } from '@angular/fire/database';

import { environment } from '../environments/environment';
import { UIService } from './shared/ui.service';
import { CoreModule } from './core';
import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { AuthModule } from './modules/auth/auth.module';
import { HomeModule } from './modules/home/home.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './modules/navigation/header/header.component';
import { SidenavListComponent } from './modules/navigation/sidenav-list/sidenav-list.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidenavListComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    SharedModule,
    AppRoutingModule,
    // AngularFireModule.initializeApp(environment.firebase),
    AuthModule,
    // provideFirebaseApp(() => initializeApp(environment.firebase)),
    // provideAuth(() => getAuth()),
    // provideDatabase(() => getDatabase()),
    HomeModule,
    NgProgressModule.withConfig({
      color: '#2dd4bf',
      spinner: false,
    }),
    NgProgressHttpModule,
  ],
  providers: [
    UIService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
