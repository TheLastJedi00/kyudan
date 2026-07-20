import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ResponsavelStore } from '../../responsavel-store';
import { DependenteSelector } from '../../components/dependente-selector/dependente-selector';
import { AppCard, ProgressBar, AlertChip, ChipTone } from '../../../../shared/ui';
import { Ocorrencia } from '../../../../core/models';
import { formatDataBR } from '../../../../shared/util/format';

/** Acompanhamento pedagógico do dependente (linguagem para pais). */
@Component({
  selector: 'app-evolucao',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DependenteSelector, AppCard, ProgressBar, AlertChip],
  templateUrl: './evolucao.html',
  styleUrl: './evolucao.scss',
})
export class Evolucao {
  protected readonly store = inject(ResponsavelStore);
  protected readonly dep = this.store.selecionado;

  protected readonly apto = computed(() => {
    const d = this.dep();
    return !!d && d.progressoPercent >= 100 && !!d.proximaFaixa;
  });

  protected readonly feedbacks = computed(() =>
    [...(this.dep()?.ocorrencias ?? [])].sort((a, b) => b.data.localeCompare(a.data)),
  );

  protected readonly formatData = formatDataBR;

  /** Traduz a tag técnica em linguagem para os pais. */
  protected feedbackLabel(tag: Ocorrencia['tag']): string {
    switch (tag) {
      case 'destaque':
        return 'Destaque no treino';
      case 'disciplina':
        return 'Ponto de atenção — disciplina';
      case 'lesao':
        return 'Cuidado físico';
      case 'observacao':
        return 'Observação do professor';
    }
  }
  protected feedbackTone(tag: Ocorrencia['tag']): ChipTone {
    return tag === 'destaque' ? 'success' : tag === 'lesao' ? 'danger' : tag === 'disciplina' ? 'warning' : 'info';
  }
}
