import { Routes } from '@angular/router';

export const PAGES_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'tos',
  },
  {
    path: 'tos',
    title: 'Términos y Condiciones - Intercambia Láminas',
    loadComponent: () =>
      import('./tos/tos.component').then((c) => c.TosComponent),
  },
  {
    path: 'privacy',
    title: 'Privacidad - Intercambia Láminas',
    loadComponent: () =>
      import('./privacy/privacy.component').then((c) => c.PrivacyComponent),
  },
  {
    path: 'faqs',
    title: 'Preguntas frecuentes - Intercambia Láminas',
    loadComponent: () =>
      import('./faqs/faqs.component').then((c) => c.FaqsComponent),
  },
  {
    path: 'about',
    title: 'Acerca de nosotros - Intercambia Láminas',
    loadComponent: () =>
      import('./about/about.component').then((c) => c.AboutComponent),
  },
  {
    path: 'guide',
    title: 'Modo de Uso - Intercambia Láminas',
    loadComponent: () =>
      import('./guide/guide.component').then((c) => c.GuideComponent),
  },
  {
    path: 'community-guidelines',
    title: 'Principios de la comunidad - Intercambia Láminas',
    loadComponent: () =>
      import('./guidelines/guidelines.component').then((c) => c.GuidelinesComponent),
  },
];

export default PAGES_ROUTES;
