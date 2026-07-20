import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GestaoStore } from '../../gestao-store';
import { AppCard, Button, BeltBadge, Icon } from '../../../../shared/ui';
import { BeltColor, Exame } from '../../../../core/models';
import { formatDataBR } from '../../../../shared/util/format';

/** Gestão de eventos: exames (criação + aptidão + listas) e campeonatos. */
@Component({
  selector: 'app-eventos',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, AppCard, Button, BeltBadge, Icon],
  templateUrl: './eventos.html',
  styleUrl: './eventos.scss',
})
export class Eventos {
  protected readonly store = inject(GestaoStore);
  protected readonly formatData = formatDataBR;

  protected readonly mostrarForm = signal(false);
  protected readonly acao = signal<string | null>(null);

  // Formulário de novo exame
  protected readonly titulo = signal('');
  protected readonly data = signal('');
  protected readonly local = signal('');
  protected readonly taxa = signal(80);
  protected readonly prazo = signal('');
  protected readonly faixaAlvo = signal<BeltColor>('yellow');

  protected aptosCount(exame: Exame): number {
    return this.store.aptosParaExame(exame).length;
  }

  protected marcarAcao(chave: string): void {
    this.acao.set(chave);
  }

  protected criarExame(): void {
    const titulo = this.titulo().trim();
    if (!titulo || !this.data()) return;
    const exame: Exame = {
      id: `e-${this.data()}-${this.faixaAlvo()}`,
      titulo,
      data: this.data(),
      local: this.local().trim() || 'A definir',
      taxaInscricao: this.taxa(),
      dataLimitePagamento: this.prazo() || this.data(),
      faixaAlvo: this.faixaAlvo(),
    };
    this.store.addExame(exame);
    this.titulo.set('');
    this.data.set('');
    this.local.set('');
    this.taxa.set(80);
    this.prazo.set('');
    this.mostrarForm.set(false);
  }
}
