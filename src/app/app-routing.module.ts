import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeAuthResolver } from './modules/home/home-auth-resolver.service';

import { HomeComponent } from './modules/home/home.component';
import { CustomErrorComponent } from './modules/navigation/custom-error/custom-error.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    resolve: {
      isAuthenticated: HomeAuthResolver,
    },
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./modules/auth/login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'signup',
    loadChildren: () =>
      import('./modules/auth/signup/signup.module').then((m) => m.SignupModule),
  },
  {
    path: 'forgot-password',
    loadChildren: () =>
      import('./modules/auth/reset-password/reset-password.module').then((m) => m.ResetPasswordModule),
  },
  {
    path: 'new-password',
    loadChildren: () =>
      import('./modules/auth/new-password/new-password.module').then((m) => m.NewPasswordModule),
  },
  {
    path: 'c',
    loadChildren: () =>
      import('./modules/collection/collection.module').then(
        (m) => m.CollectionModule
      ),
  },
  {
    path: 'item',
    loadChildren: () =>
      import('./modules/item/item.module').then((m) => m.ItemModule),
  },
  {
    path: 'user',
    loadChildren: () =>
      import('./modules/user/user.module').then((m) => m.UserModule),
  },
  {
    path: 'search',
    loadChildren: () =>
      import('./modules/search/search.module').then((m) => m.SearchModule),
  },
  {
    path: 'explore',
    loadChildren: () =>
      import('./modules/explore/explore.module').then((m) => m.ExploreModule),
  },
  {
    path: 'trades',
    loadChildren: () =>
      import('./modules/trades/trades.module').then((m) => m.TradesModule),
  },
  {
    path: 'message',
    loadChildren: () =>
      import('./modules/message/message.module').then((m) => m.MessageModule),
  },
  {
    path: 'settings',
    loadChildren: () =>
      import('./modules/settings/settings.module').then(
        (m) => m.SettingsModule
      ),
  },
  {
    path: 'p',
    loadChildren: () =>
      import('./modules/pages/pages.module').then((m) => m.PagesModule),
  },
  {
    path: 'mod',
    loadChildren: () =>
      import('./modules/mod/mod.module').then((m) => m.ModModule),
  },
  {
    path: 'collaborate',
    loadChildren: () =>
      import('./modules/collaborate/collaborate.module').then((m) => m.CollaborateModule),
  },
  {
    path: 'new-collection',
    loadChildren: () =>
      import('./modules/new-collection/new-collection.module').then((m) => m.NewCollectionModule),
  },
  {
    path: '**',
    pathMatch: 'full',
    component: CustomErrorComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
