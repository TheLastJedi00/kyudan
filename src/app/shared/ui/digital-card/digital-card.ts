import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { BeltColor, Filiacoes, FiliacaoStatus } from '../../../core/models';
import { BELT_HEX } from '../belt-colors';

/** Carteira digital de filiação (foto/inicial, matrícula, faixa, QR, status). */
@Component({
  selector: 'app-digital-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './digital-card.html',
  styleUrl: './digital-card.scss',
})
export class DigitalCard {
  readonly nome = input.required<string>();
  readonly matricula = input.required<string>();
  readonly beltColor = input.required<BeltColor>();
  readonly faixaLabel = input.required<string>();
  readonly filiacoes = input.required<Filiacoes>();

  protected readonly accent = computed(() => BELT_HEX[this.beltColor()]);
  protected readonly inicial = computed(() => this.nome().charAt(0).toUpperCase());

  protected readonly filiacaoRows = computed<{ sigla: string; status: FiliacaoStatus }[]>(() => {
    const f = this.filiacoes();
    return [
      { sigla: 'ABK', status: f.abk },
      { sigla: 'FCK', status: f.fck },
      { sigla: 'CBK', status: f.cbk },
    ];
  });

  /** Matriz pseudo-QR determinística (derivada da matrícula) — decorativa no MVC. */
  protected readonly qr = computed<boolean[]>(() => {
    const seed = this.matricula();
    const n = 12;
    const cells: boolean[] = [];
    for (let i = 0; i < n * n; i++) {
      const code = seed.charCodeAt(i % seed.length);
      cells.push(((code * (i + 7)) % 5) < 2);
    }
    return cells;
  });

  protected statusTone(s: FiliacaoStatus): string {
    return s === 'regular'
      ? 'text-belt-green'
      : s === 'vencendo'
        ? 'text-belt-orange'
        : 'text-belt-red';
  }

  protected statusLabel(s: FiliacaoStatus): string {
    return s === 'regular' ? 'Regular' : s === 'vencendo' ? 'Vencendo' : 'Vencido';
  }
}
