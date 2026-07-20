import { BeltColor, Belt } from './belt.model';
import { Filiacoes } from './usuario.model';

/** Item do currículo técnico (Kihon/Kata/Kumite) avaliável pelo Sensei. */
export interface CurriculoItem {
  id: string;
  /** Categoria técnica. */
  categoria: 'kihon' | 'kata' | 'kumite';
  nome: string;
  /** Marcado como dominado pelo Sensei. */
  dominado: boolean;
}

/** Registro histórico de uma graduação conquistada (O Cartel). */
export interface GraduacaoHistorico {
  beltColor: BeltColor;
  /** ISO date. */
  data: string;
  senseiNome: string;
}

/** Participação em competição (perfil atleta de rendimento). */
export interface CompeticaoHistorico {
  id: string;
  evento: string;
  /** ISO date. */
  data: string;
  colocacao?: string;
  medalha?: 'ouro' | 'prata' | 'bronze';
}

/** Ocorrência/observação registrada pelo Sensei (Diário de Bordo). */
export interface Ocorrencia {
  id: string;
  /** ISO date. */
  data: string;
  autorNome: string;
  tag: 'destaque' | 'disciplina' | 'lesao' | 'observacao';
  texto: string;
}

/** Alerta crítico exibido no card do aluno durante a chamada. */
export type AlunoAlerta = 'mensalidade' | 'fck' | 'medico';

/** Praticante da ABK (aluno/atleta). */
export interface Aluno {
  id: string;
  nome: string;
  avatarUrl?: string;
  dataNascimento: string; // ISO
  poloId: string;
  turmaId: string;
  /** Faixa atual. */
  beltColor: BeltColor;
  /** Horas-aula acumuladas rumo à próxima faixa. */
  horasAcumuladas: number;
  filiacoes: Filiacoes;
  /** ID do responsável, quando menor. */
  responsavelId?: string;
  perfilAtleta: boolean;
  alertas: AlunoAlerta[];
  curriculo: CurriculoItem[];
  graduacoes: GraduacaoHistorico[];
  competicoes: CompeticaoHistorico[];
  ocorrencias: Ocorrencia[];
}

/** Aluno enriquecido com a faixa atual/próxima resolvidas (view model). */
export interface AlunoComProgresso extends Aluno {
  faixaAtual: Belt;
  proximaFaixa: Belt | null;
  /** 0..100 — horas acumuladas vs. exigidas para a próxima faixa. */
  progressoPercent: number;
}
