/** Status de uma fatura. */
export type FaturaStatus = 'paga' | 'pendente' | 'vencida';

/** Fatura/mensalidade de um aluno. */
export interface Fatura {
  id: string;
  alunoId: string;
  descricao: string;
  valor: number;
  /** ISO date. */
  vencimento: string;
  status: FaturaStatus;
  /** Código PIX copia-e-cola (mocado). */
  pixCopiaCola?: string;
}

/** Regra de repasse (split) de mensalidade de um pólo. */
export interface RegraSplit {
  poloId: string;
  /** Percentual destinado ao Sensei (0..100); o restante vai para a Associação. */
  percentualSensei: number;
}

/** Item do inventário institucional. */
export interface ItemInventario {
  id: string;
  nome: string;
  categoria: 'kimono' | 'faixa' | 'agasalho' | 'outro';
  tamanho?: string;
  quantidade: number;
  /** Abaixo deste nível, dispara alerta visual (amarelo/laranja). */
  estoqueMinimo: number;
}
