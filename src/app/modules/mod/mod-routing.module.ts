import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard, ModGuard } from 'src/app/core';
import { ModMediaComponent } from './mod-media/mod-media.component';
import { ModComponent } from './mod.component';
import { ModPublishComponent } from './mod-publish/mod-publish.component';

const routes: Routes = [
  {
    path: '',
    component: ModComponent,
    canActivate: [AuthGuard, ModGuard],
    children: [
      {
        path: 'media',
        component: ModMediaComponent,
        title: 'Moderar elementos multimedia - Intercambia Láminas',
      },
      {
        path: 'publish',
        component: ModPublishComponent,
        title: 'Publicar nuevas colecciones - Intercambia Láminas',
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModRoutingModule {}
