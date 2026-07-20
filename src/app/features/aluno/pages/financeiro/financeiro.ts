import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { AlunoStore } from '../../aluno-store';
import { AppCard, AlertChip, Button, ChipTone } from '../../../../shared/ui';
import { Fatura, FaturaStatus } from '../../../../core/models';
import { formatBRL, formatDataBR } from '../../../../shared/util/format';

/** Central financeira do aluno: mensalidades e copiar PIX. */
@Component({
  selector: 'app-financeiro',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppCard, AlertChip, Button],
  templateUrl: './financeiro.html',
  styleUrl: './financeiro.scss',
})
export class Financeiro {
  protected readonly store = inject(AlunoStore);

  protected readonly copiado = signal<string | null>(null);

  protected readonly faturas = computed(() =>
    [...this.store.faturas()].sort((a, b) => a.vencimento.localeCompare(b.vencimento)),
  );

  protected readonly totalAberto = computed(() =>
    this.store
      .faturas()
      .filter((f) => f.status !== 'paga')
      .reduce((s, f) => s + f.valor, 0),
  );

  protected readonly formatBRL = formatBRL;
  protected readonly formatData = formatDataBR;

  protected tone(status: FaturaStatus): ChipTone {
    return status === 'paga' ? 'success' : status === 'vencida' ? 'danger' : 'warning';
  }

  protected statusLabel(status: FaturaStatus): string {
    return status === 'paga' ? 'Paga' : status === 'vencida' ? 'Vencida' : 'Pendente';
  }

  protected async copiarPix(f: Fatura): Promise<void> {
    if (!f.pixCopiaCola) return;
    try {
      await navigator.clipboard?.writeText(f.pixCopiaCola);
      this.copiado.set(f.id);
    } catch {
      this.copiado.set(f.id);
    }
  }
}
