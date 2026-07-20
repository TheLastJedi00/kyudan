import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { BeltColor } from '../../../core/models';
import { BeltLineageService } from '../../../core/services/belt-lineage.service';
import { BeltBadge } from '../belt-badge/belt-badge';

/**
 * "Estante" horizontal de faixas: conquistadas coloridas + bloqueadas esmaecidas,
 * atestando a bagagem do praticante (gamificação por coleção).
 */
@Component({
  selector: 'app-belt-shelf',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BeltBadge],
  templateUrl: './belt-shelf.html',
  styleUrl: './belt-shelf.scss',
})
export class BeltShelf {
  private readonly lineage = inject(BeltLineageService);

  readonly current = input.required<BeltColor>();
  readonly size = input(20);

  protected readonly belts = computed(() => {
    const atualOrder = this.lineage.byColor(this.current()).order;
    return this.lineage.all.map((b) => ({
      color: b.color as BeltColor,
      label: b.label,
      locked: b.order > atualOrder,
    }));
  });
}
