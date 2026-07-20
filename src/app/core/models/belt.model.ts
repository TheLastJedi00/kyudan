/** Cor de faixa na linhagem FCK/CBK (chave do token de cor `belt-*`). */
export type BeltColor =
  | 'white'
  | 'yellow'
  | 'red'
  | 'orange'
  | 'green'
  | 'purple'
  | 'brown'
  | 'black';

/**
 * Uma graduação (faixa) na progressão de Kyu/Dan.
 * `order` cresce com a evolução (0 = Branca ... 7 = Preta/Dan).
 */
export interface Belt {
  /** Identificador estável (ex.: 'branca', 'dan'). */
  id: string;
  /** Cor semântica na paleta de faixas. */
  color: BeltColor;
  /** Rótulo de exibição (ex.: 'Branca', 'Preta (Dan)'). */
  label: string;
  /** Grau na nomenclatura marcial (ex.: '7º Kyu', 'Dan'). */
  grade: string;
  /** Posição na linhagem — quanto maior, mais avançada. */
  order: number;
  /** Carga horária mínima (horas-aula) exigida para alcançar a PRÓXIMA faixa. */
  requiredHours: number;
}
