import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { AlunoStore } from '../../aluno-store';
import { AppCard, BeltBadge } from '../../../../shared/ui';
import { BeltLineageService } from '../../../../core/services/belt-lineage.service';
import { formatDataBR } from '../../../../shared/util/format';

/** O Cartel: linha do tempo de graduações + histórico de competições. */
@Component({
  selector: 'app-cartel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppCard, BeltBadge],
  templateUrl: './cartel.html',
  styleUrl: './cartel.scss',
})
export class Cartel {
  private readonly lineage = inject(BeltLineageService);
  protected readonly aluno = inject(AlunoStore).aluno;

  protected readonly graduacoes = computed(() =>
    [...(this.aluno()?.graduacoes ?? [])]
      .sort((a, b) => b.data.localeCompare(a.data))
      .map((g) => ({ ...g, label: this.lineage.byColor(g.beltColor).label })),
  );

  protected readonly competicoes = computed(() =>
    [...(this.aluno()?.competicoes ?? [])].sort((a, b) => b.data.localeCompare(a.data)),
  );

  protected readonly formatData = formatDataBR;

  protected medalha(m?: 'ouro' | 'prata' | 'bronze'): string {
    return m === 'ouro' ? '🥇' : m === 'prata' ? '🥈' : m === 'bronze' ? '🥉' : '🎖️';
  }
}
