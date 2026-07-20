import { Routes } from '@angular/router';

/** Rotas da role Aluno (O Caminho). */
export const ALUNO_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/caminho/caminho').then((m) => m.Caminho),
  },
  {
    path: 'cartel',
    loadComponent: () => import('./pages/cartel/cartel').then((m) => m.Cartel),
  },
  {
    path: 'carteira',
    loadComponent: () => import('./pages/carteira/carteira').then((m) => m.Carteira),
  },
  {
    path: 'financeiro',
    loadComponent: () => import('./pages/financeiro/financeiro').then((m) => m.Financeiro),
  },
];
