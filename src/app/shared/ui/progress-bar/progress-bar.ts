import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { BeltColor } from '../../../core/models';
import { BELT_HEX } from '../belt-colors';

/**
 * Barra de progressão linear e discreta — preenchimento na cor da faixa atual.
 */
@Component({
  selector: 'app-progress-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './progress-bar.html',
  styleUrl: './progress-bar.scss',
})
export class ProgressBar {
  /** 0..100. */
  readonly percent = input.required<number>();
  /** Cor de preenchimento (faixa). Omitido = preto (Dan). */
  readonly beltColor = input<BeltColor | null>(null);

  protected readonly clamped = computed(() => Math.max(0, Math.min(100, this.percent())));
  protected readonly fill = computed(() => {
    const c = this.beltColor();
    return c ? BELT_HEX[c] : BELT_HEX.black;
  });
}
