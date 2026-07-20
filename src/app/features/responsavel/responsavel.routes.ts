import { Routes } from '@angular/router';

/** Rotas da role Responsável (A Base). Expandidas na Fase 5. */
export const RESPONSAVEL_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('../../shared/pages/welcome/welcome').then((m) => m.Welcome),
  },
];
