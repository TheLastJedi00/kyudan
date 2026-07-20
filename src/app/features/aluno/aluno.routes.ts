import { Routes } from '@angular/router';

/** Rotas da role Aluno (O Caminho). Expandidas na Fase 3. */
export const ALUNO_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('../../shared/pages/welcome/welcome').then((m) => m.Welcome),
  },
];
