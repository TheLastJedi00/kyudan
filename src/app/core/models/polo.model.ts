/** Dia/horário de funcionamento de uma turma no pólo. */
export interface HorarioTurma {
  /** 0=Domingo ... 6=Sábado. */
  diaSemana: number;
  /** 'HH:mm'. */
  inicio: string;
  fim: string;
}

/** Pólo (local de treino: escola, clube, fundação). */
export interface Polo {
  id: string;
  nome: string;
  endereco: string;
  capacidadeMaxima: number;
  /** IDs dos senseis alocados. */
  senseiIds: string[];
  /** Crescimento líquido de alunos no mês corrente (pode ser negativo = evasão). */
  crescimentoMes: number;
}

/** Turma vinculada a um pólo, conduzida por um sensei. */
export interface Turma {
  id: string;
  poloId: string;
  senseiId: string;
  nome: string;
  horarios: HorarioTurma[];
  alunoIds: string[];
}
