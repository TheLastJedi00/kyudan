import { Routes } from '@angular/router';

/** Rotas da role Gestão (A Cúpula). */
export const GESTAO_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/painel/painel').then((m) => m.Painel),
  },
  {
    path: 'polos',
    loadComponent: () => import('./pages/polos/polos').then((m) => m.Polos),
  },
  {
    path: 'filiacoes',
    loadComponent: () => import('./pages/filiacoes/filiacoes').then((m) => m.Filiacoes),
  },
  {
    path: 'eventos',
    loadComponent: () => import('./pages/eventos/eventos').then((m) => m.Eventos),
  },
  {
    path: 'financeiro',
    loadComponent: () =>
      import('./pages/financeiro-gestao/financeiro-gestao').then((m) => m.FinanceiroGestao),
  },
];
