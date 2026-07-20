import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { AlunoStore } from '../../aluno-store';
import { AppCard, BeltBadge, Icon } from '../../../../shared/ui';
import { BeltLineageService } from '../../../../core/services/belt-lineage.service';
import { formatDataBR } from '../../../../shared/util/format';

/** O Cartel: linha do tempo de graduações + histórico de competições. */
@Component({
  selector: 'app-cartel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppCard, BeltBadge, Icon],
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

  /** Cor da medalha conforme a colocação (usada no ícone `medal`). */
  protected medalCor(m?: 'ouro' | 'prata' | 'bronze'): string {
    return m === 'ouro' ? '#EAB308' : m === 'prata' ? '#9CA3AF' : m === 'bronze' ? '#B45309' : '#6B7280';
  }
}
