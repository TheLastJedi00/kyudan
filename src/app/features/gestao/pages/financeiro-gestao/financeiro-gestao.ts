import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { GestaoStore } from '../../gestao-store';
import { AppCard, AlertChip } from '../../../../shared/ui';
import { Fatura, ItemInventario } from '../../../../core/models';
import { formatBRL, formatDataBR } from '../../../../shared/util/format';

/** Financeiro da Gestão: split de repasses, inadimplência e inventário. */
@Component({
  selector: 'app-financeiro-gestao',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppCard, AlertChip],
  templateUrl: './financeiro-gestao.html',
  styleUrl: './financeiro-gestao.scss',
})
export class FinanceiroGestao {
  protected readonly store = inject(GestaoStore);
  protected readonly formatBRL = formatBRL;
  protected readonly formatData = formatDataBR;

  protected readonly vencidas = computed<Fatura[]>(() =>
    this.store.faturas().filter((f) => f.status === 'vencida'),
  );

  protected readonly totalInadimplencia = computed(() =>
    this.vencidas().reduce((s, f) => s + f.valor, 0),
  );

  protected estoqueBaixo(item: ItemInventario): boolean {
    return item.quantidade < item.estoqueMinimo;
  }
}
