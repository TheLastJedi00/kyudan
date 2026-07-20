import { Routes } from '@angular/router';

/** Rotas da role Gestão (A Cúpula). Expandidas na Fase 6. */
export const GESTAO_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('../../shared/pages/welcome/welcome').then((m) => m.Welcome),
  },
];
