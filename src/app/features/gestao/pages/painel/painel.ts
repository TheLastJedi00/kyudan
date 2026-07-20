import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { GestaoStore } from '../../gestao-store';
import { AppCard, AlertChip, BeltBadge, SearchBar, Icon } from '../../../../shared/ui';
import { Aluno } from '../../../../core/models';

/** Dashboard executivo: busca global, alertas, métricas e saúde dos pólos. */
@Component({
  selector: 'app-painel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppCard, AlertChip, BeltBadge, SearchBar, Icon],
  templateUrl: './painel.html',
  styleUrl: './painel.scss',
})
export class Painel {
  protected readonly store = inject(GestaoStore);
  protected readonly termo = signal('');

  protected readonly resultados = computed<Aluno[]>(() => {
    const q = this.termo().trim().toLowerCase();
    if (!q) return [];
    return this.store.alunos().filter((a) => a.nome.toLowerCase().includes(q)).slice(0, 8);
  });
}
