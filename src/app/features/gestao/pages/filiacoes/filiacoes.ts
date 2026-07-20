import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { GestaoStore } from '../../gestao-store';
import { AppCard, Button, ChipTone } from '../../../../shared/ui';
import { Aluno, FiliacaoStatus } from '../../../../core/models';

type Filtro = 'todos' | 'irregular' | 'regular';

/** Painel de filiações FCK/CBK: filtro, notificação em lote e relatórios. */
@Component({
  selector: 'app-filiacoes',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppCard, Button],
  templateUrl: './filiacoes.html',
  styleUrl: './filiacoes.scss',
})
export class Filiacoes {
  protected readonly store = inject(GestaoStore);

  protected readonly filtro = signal<Filtro>('irregular');
  protected readonly selecionados = signal<Set<string>>(new Set());
  protected readonly notificados = signal(false);
  protected readonly exportado = signal(false);

  protected readonly filtros: { valor: Filtro; label: string }[] = [
    { valor: 'todos', label: 'Todos' },
    { valor: 'irregular', label: 'Irregulares' },
    { valor: 'regular', label: 'Regulares' },
  ];

  private irregular(a: Aluno): boolean {
    return a.filiacoes.fck !== 'regular' || a.filiacoes.cbk !== 'regular';
  }

  protected readonly lista = computed<Aluno[]>(() => {
    const f = this.filtro();
    return this.store.alunos().filter((a) => {
      if (f === 'irregular') return this.irregular(a);
      if (f === 'regular') return !this.irregular(a);
      return true;
    });
  });

  protected readonly totalSel = computed(() => this.selecionados().size);

  protected toggle(id: string): void {
    this.selecionados.update((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
    this.notificados.set(false);
  }

  protected notificar(): void {
    if (!this.selecionados().size) return;
    this.notificados.set(true);
    this.selecionados.set(new Set());
  }

  protected exportar(): void {
    this.exportado.set(true);
  }

  protected tone(status: FiliacaoStatus): ChipTone {
    return status === 'regular' ? 'success' : status === 'vencendo' ? 'warning' : 'danger';
  }
  protected statusLabel(status: FiliacaoStatus): string {
    return status === 'regular' ? 'Regular' : status === 'vencendo' ? 'Vencendo' : 'Vencido';
  }
}
