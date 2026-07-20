import { Role } from '../core/models';

export interface NavItem {
  label: string;
  /** Rota absoluta. */
  path: string;
  /** Nome do ícone (ver `AppIcon`). */
  icon: string;
}

/**
 * Configuração da navegação inferior por role.
 * Cada phase de role preenche/expande suas abas aqui.
 */
export const NAV_CONFIG: Record<Role, NavItem[]> = {
  aluno: [
    { label: 'Caminho', path: '/aluno', icon: 'path' },
    { label: 'Cartel', path: '/aluno/cartel', icon: 'trophy' },
    { label: 'Carteira', path: '/aluno/carteira', icon: 'card' },
    { label: 'Financeiro', path: '/aluno/financeiro', icon: 'wallet' },
  ],
  professor: [
    { label: 'Tatame', path: '/professor', icon: 'tatame' },
    { label: 'Exames', path: '/professor/exames', icon: 'check' },
  ],
  responsavel: [
    { label: 'Início', path: '/responsavel', icon: 'home' },
    { label: 'Evolução', path: '/responsavel/evolucao', icon: 'path' },
    { label: 'Autorizações', path: '/responsavel/autorizacoes', icon: 'doc' },
    { label: 'Presença', path: '/responsavel/presenca', icon: 'calendar' },
  ],
  gestao: [
    { label: 'Painel', path: '/gestao', icon: 'grid' },
    { label: 'Pólos', path: '/gestao/polos', icon: 'pin' },
    { label: 'Filiações', path: '/gestao/filiacoes', icon: 'shield' },
    { label: 'Eventos', path: '/gestao/eventos', icon: 'calendar' },
    { label: 'Financeiro', path: '/gestao/financeiro', icon: 'wallet' },
  ],
};

export const ROLE_LABEL: Record<Role, string> = {
  aluno: 'O Caminho',
  professor: 'O Tatame',
  responsavel: 'A Base',
  gestao: 'A Cúpula',
};
