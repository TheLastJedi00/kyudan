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
