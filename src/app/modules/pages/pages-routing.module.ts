import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AboutComponent } from './about/about.component';
import { FaqsComponent } from './faqs/faqs.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { TosComponent } from './tos/tos.component';

const routes: Routes = [
    {
      path: '',
      pathMatch: 'full',
      redirectTo: 'tos',
    },
    {
      path: 'tos',
      component: TosComponent,
      title: 'Términos y Condiciones - Intercambia Láminas'
    },
    {
      path: 'privacy',
      component: PrivacyComponent,
      title: 'Privacidad - Intercambia Láminas'
    },
    {
      path: 'faqs',
      component: FaqsComponent,
      title: 'Preguntas frecuentes - Intercambia Láminas'
    },
    {
      path: 'about',
      component: AboutComponent,
      title: 'Acerca de nosotros - Intercambia Láminas'
    },
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
