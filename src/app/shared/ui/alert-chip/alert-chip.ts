import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Icon } from '../icon/icon';

export type ChipTone = 'danger' | 'warning' | 'success' | 'info' | 'neutral';

/** Chip discreto de status/alerta. Cor conforme a semântica de faixas. */
@Component({
  selector: 'app-alert-chip',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  templateUrl: './alert-chip.html',
  styleUrl: './alert-chip.scss',
})
export class AlertChip {
  readonly tone = input<ChipTone>('neutral');
  readonly label = input.required<string>();
  readonly icon = input<string | null>(null);

  // Strings literais para o Tailwind detectar no purge.
  private readonly toneClasses: Record<ChipTone, string> = {
    danger: 'bg-belt-red/10 text-belt-red',
    warning: 'bg-belt-orange/10 text-belt-orange',
    success: 'bg-belt-green/10 text-belt-green',
    info: 'bg-belt-purple/10 text-belt-purple',
    neutral: 'bg-surface-muted text-fg-muted',
  };

  protected readonly classes = computed(() => this.toneClasses[this.tone()]);
}
