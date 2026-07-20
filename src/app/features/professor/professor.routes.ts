import { Routes } from '@angular/router';

/** Rotas da role Professor (O Tatame). Expandidas na Fase 4. */
export const PROFESSOR_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('../../shared/pages/welcome/welcome').then((m) => m.Welcome),
  },
];
