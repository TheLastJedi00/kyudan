import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ResponsavelStore } from '../../responsavel-store';
import { DependenteSelector } from '../../components/dependente-selector/dependente-selector';
import { AppCard, Button, ProgressBar, Icon } from '../../../../shared/ui';
import { formatBRL } from '../../../../shared/util/format';

/** Home do Responsável — antecipa a ação pendente mais importante (atrito zero). */
@Component({
  selector: 'app-inicio',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, DependenteSelector, AppCard, Button, ProgressBar, Icon],
  templateUrl: './inicio.html',
  styleUrl: './inicio.scss',
})
export class Inicio {
  protected readonly store = inject(ResponsavelStore);
  protected readonly resolvido = signal(false);

  protected readonly acaoPrincipal = computed(() => this.store.acoesPendentes()[0] ?? null);
  protected readonly formatBRL = formatBRL;
}
