import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeAuthResolver } from './modules/home/home-auth-resolver.service';
import { HomeComponent } from './modules/home/home.component';

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
      import('./modules/auth/login/login.module').then(
        (m) => m.LoginModule
      ),
  },
  {
    path: 'signup',
    loadChildren: () =>
      import('./modules/auth/signup/signup.module').then(
        (m) => m.SignupModule
      ),
  },
  {
    path: 'c',
    loadChildren: () =>
      import('./modules/collection/collection.module').then(
        (m) => m.CollectionModule
      ),
  },
  {
    path: 'user',
    loadChildren: () =>
      import('./modules/user/user.module').then((m) => m.UserModule),
  },
  {
    path: 'item',
    loadChildren: () =>
      import('./modules/item/item.module').then((m) => m.ItemModule),
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
    path: 'settings',
    loadChildren: () =>
      import('./modules/settings/settings.module').then(
        (m) => m.SettingsModule
      ),
  },
  {
    path: 'trades',
    loadChildren: () =>
      import('./modules/trades/trades.module').then((m) => m.TradesModule),
  },
  // {
  //   path: '**',
  //   redirectTo: '',
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
