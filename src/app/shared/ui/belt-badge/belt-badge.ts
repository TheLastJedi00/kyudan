import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { BeltColor } from '../../../core/models';
import { BELT_HEX, BELT_NEEDS_RING } from '../belt-colors';

/**
 * Badge circular de faixa (coleção de conquistas). Faixa conquistada = círculo
 * colorido; bloqueada = esmaecida/contorno.
 */
@Component({
  selector: 'app-belt-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './belt-badge.html',
  styleUrl: './belt-badge.scss',
})
export class BeltBadge {
  readonly color = input.required<BeltColor>();
  readonly locked = input(false);
  /** Diâmetro em px. */
  readonly size = input(24);

  protected readonly hex = computed(() => BELT_HEX[this.color()]);
  protected readonly needsRing = computed(() => BELT_NEEDS_RING[this.color()]);
}
