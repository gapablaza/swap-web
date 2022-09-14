import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgProgressModule } from 'ngx-progressbar';
import { NgProgressHttpModule } from 'ngx-progressbar/http';
import {
  SocialLoginModule,
  SocialAuthServiceConfig,
  GoogleInitOptions,
} from '@abacritt/angularx-social-login';
import {
  GoogleLoginProvider,
  FacebookLoginProvider,
} from '@abacritt/angularx-social-login';

// import { AngularFireModule } from '@angular/fire/compat';
// import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
// import { provideAuth, getAuth } from '@angular/fire/auth';
// import { provideDatabase, getDatabase } from '@angular/fire/database';

import { environment } from '../environments/environment';
import { UIService } from './shared';
import { CoreModule } from './core';
import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { AuthModule } from './modules/auth/auth.module';
import { HomeModule } from './modules/home/home.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './modules/navigation/header/header.component';
import { SidenavListComponent } from './modules/navigation/sidenav-list/sidenav-list.component';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

const googleLoginOptions: GoogleInitOptions = {
  oneTapEnabled: false, // default is true
  scopes:
    'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
};

const fbLoginOptions = {
  scope: 'email',
  // return_scopes: true,
};

@NgModule({
  declarations: [AppComponent, HeaderComponent, SidenavListComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,

    SharedModule,    
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,

    AppRoutingModule,
    // AngularFireModule.initializeApp(environment.firebase),
    AuthModule,
    // provideFirebaseApp(() => initializeApp(environment.firebase)),
    // provideAuth(() => getAuth()),
    // provideDatabase(() => getDatabase()),
    HomeModule,
    SocialLoginModule,
    NgProgressModule.withConfig({
      color: '#2dd4bf',
      spinner: false,
    }),
    NgProgressHttpModule,
  ],
  providers: [
    UIService,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              environment.google.token,
              googleLoginOptions
            ),
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider(
              environment.facebook.token,
              fbLoginOptions
            ),
          },
        ],
        onError: (err) => {
          console.error(err);
        },
      } as SocialAuthServiceConfig,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
