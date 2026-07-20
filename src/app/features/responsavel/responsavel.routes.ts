import { Routes } from '@angular/router';

/** Rotas da role Responsável (A Base). */
export const RESPONSAVEL_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/inicio/inicio').then((m) => m.Inicio),
  },
  {
    path: 'evolucao',
    loadComponent: () => import('./pages/evolucao/evolucao').then((m) => m.Evolucao),
  },
  {
    path: 'autorizacoes',
    loadComponent: () => import('./pages/autorizacoes/autorizacoes').then((m) => m.Autorizacoes),
  },
  {
    path: 'presenca',
    loadComponent: () => import('./pages/presenca/presenca').then((m) => m.Presenca),
  },
];
