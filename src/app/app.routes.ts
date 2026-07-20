import { Routes } from '@angular/router';
import { Shell } from './layout/shell/shell';

export const routes: Routes = [
  {
    path: '',
    component: Shell,
    children: [
      {
        path: 'aluno',
        loadChildren: () => import('./features/aluno/aluno.routes').then((m) => m.ALUNO_ROUTES),
      },
      {
        path: 'professor',
        loadChildren: () =>
          import('./features/professor/professor.routes').then((m) => m.PROFESSOR_ROUTES),
      },
      {
        path: 'responsavel',
        loadChildren: () =>
          import('./features/responsavel/responsavel.routes').then((m) => m.RESPONSAVEL_ROUTES),
      },
      {
        path: 'gestao',
        loadChildren: () => import('./features/gestao/gestao.routes').then((m) => m.GESTAO_ROUTES),
      },
      { path: '', pathMatch: 'full', redirectTo: 'gestao' },
    ],
  },
  { path: '**', redirectTo: '' },
];
