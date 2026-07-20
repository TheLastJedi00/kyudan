/** Formatação pt-BR compartilhada (Intl — sem depender de locale do Angular). */

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export function formatBRL(valor: number): string {
  return brl.format(valor);
}

/** 'YYYY-MM-DD' → 'DD/MM/YYYY' (sem fuso, evita off-by-one). */
export function formatDataBR(iso: string): string {
  const [y, m, d] = iso.split('-');
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}

/** 'YYYY-MM-DD' → 'MMM/YYYY' abreviado em pt-BR. */
export function formatMesAno(iso: string): string {
  const [y, m] = iso.split('-');
  const meses = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  const idx = Number(m) - 1;
  return `${meses[idx] ?? m}/${y}`;
}

export const DIAS_SEMANA = [
  'Domingo',
  'Segunda',
  'Terça',
  'Quarta',
  'Quinta',
  'Sexta',
  'Sábado',
] as const;

/** Data de hoje em ISO 'YYYY-MM-DD' (runtime do browser). */
export function hojeISO(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Dia da semana de hoje (0=Domingo ... 6=Sábado). */
export function diaSemanaHoje(): number {
  return new Date().getDay();
}
