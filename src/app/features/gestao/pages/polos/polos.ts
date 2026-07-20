import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GestaoStore } from '../../gestao-store';
import { AppCard, Button, Icon } from '../../../../shared/ui';
import { Polo } from '../../../../core/models';

/** Gestão de pólos: cadastro, alocação de senseis e relatórios de turma. */
@Component({
  selector: 'app-polos',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, AppCard, Button, Icon],
  templateUrl: './polos.html',
  styleUrl: './polos.scss',
})
export class Polos {
  protected readonly store = inject(GestaoStore);

  protected readonly mostrarForm = signal(false);
  protected readonly expandido = signal<string | null>(null);
  protected readonly nome = signal('');
  protected readonly endereco = signal('');
  protected readonly capacidade = signal(40);

  protected toggleExpand(id: string): void {
    this.expandido.update((cur) => (cur === id ? null : id));
  }

  protected cadastrar(): void {
    const nome = this.nome().trim();
    if (!nome) return;
    const novo: Polo = {
      id: `p-${nome.toLowerCase().replace(/\s+/g, '-')}`,
      nome,
      endereco: this.endereco().trim() || 'Endereço a definir',
      capacidadeMaxima: this.capacidade(),
      senseiIds: [],
      crescimentoMes: 0,
    };
    this.store.addPolo(novo);
    this.nome.set('');
    this.endereco.set('');
    this.capacidade.set(40);
    this.mostrarForm.set(false);
  }
}
