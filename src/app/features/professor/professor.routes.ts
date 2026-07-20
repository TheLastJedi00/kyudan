import { Routes } from '@angular/router';

/** Rotas da role Professor (O Tatame). */
export const PROFESSOR_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/tatame/tatame').then((m) => m.Tatame),
  },
  {
    path: 'turma/:turmaId',
    loadComponent: () => import('./pages/chamada/chamada').then((m) => m.Chamada),
  },
  {
    path: 'aluno/:alunoId',
    loadComponent: () => import('./pages/aluno-detalhe/aluno-detalhe').then((m) => m.AlunoDetalhe),
  },
  {
    path: 'exames',
    loadComponent: () => import('./pages/indicacoes/indicacoes').then((m) => m.Indicacoes),
  },
];
