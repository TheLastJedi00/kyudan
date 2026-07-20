import { BeltColor } from '../../core/models';

/**
 * Hex das faixas (espelha o tema Tailwind `belt-*`). Usado em `[style]` porque
 * o Tailwind faz purge de classes montadas dinamicamente (ex.: `bg-belt-${cor}`).
 */
export const BELT_HEX: Record<BeltColor, string> = {
  white: '#E7E5E4',
  yellow: '#EAB308',
  red: '#DC2626',
  orange: '#EA580C',
  green: '#16A34A',
  purple: '#7C3AED',
  brown: '#92400E',
  black: '#0A0A0A',
};

/** Faixas que precisam de anel de contraste sobre fundo branco/preto. */
export const BELT_NEEDS_RING: Record<BeltColor, boolean> = {
  white: true,
  yellow: false,
  red: false,
  orange: false,
  green: false,
  purple: false,
  brown: false,
  black: true,
};
