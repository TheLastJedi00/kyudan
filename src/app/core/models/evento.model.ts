import { BeltColor } from './belt.model';

/** Frequência de um aluno em uma data. */
export interface Frequencia {
  alunoId: string;
  turmaId: string;
  /** ISO date. */
  data: string;
  presente: boolean;
}

/** Exame de graduação (troca de faixa). */
export interface Exame {
  id: string;
  titulo: string;
  /** ISO date. */
  data: string;
  local: string;
  taxaInscricao: number;
  /** ISO date — limite para pagamento. */
  dataLimitePagamento: string;
  /** Faixa-alvo do exame. */
  faixaAlvo: BeltColor;
}

/** Campeonato/competição. */
export interface Campeonato {
  id: string;
  titulo: string;
  /** ISO date. */
  data: string;
  local: string;
  /** Documentos exigidos (ex.: 'autorização de viagem', 'atestado médico'). */
  documentosExigidos: string[];
}

/** Indicação de aluno a um exame (aval do Sensei → Gestão). */
export interface IndicacaoExame {
  alunoId: string;
  exameId: string;
  senseiId: string;
  /** ISO date. */
  data: string;
}
