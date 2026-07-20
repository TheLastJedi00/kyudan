import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { AlunoStore } from '../../aluno-store';
import { BELT_HEX } from '../../../../shared/ui/belt-colors';
import { AppCard, BeltShelf, ProgressBar, AlertChip, Button, Icon } from '../../../../shared/ui';
import { CurriculoItem } from '../../../../core/models';
import { formatDataBR, formatBRL } from '../../../../shared/util/format';

/** Dashboard do Caminho: faixa atual, progresso, currículo técnico e próximo exame. */
@Component({
  selector: 'app-caminho',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppCard, BeltShelf, ProgressBar, AlertChip, Button, Icon],
  templateUrl: './caminho.html',
  styleUrl: './caminho.scss',
})
export class Caminho {
  protected readonly store = inject(AlunoStore);
  protected readonly aluno = this.store.aluno;
  protected readonly proximoExame = this.store.proximoExame;

  /** Inscrição no exame (mock do MVC). */
  protected readonly inscrito = signal(false);
  protected readonly formatBRL = formatBRL;

  protected inscrever(): void {
    this.inscrito.set(true);
  }

  protected readonly accent = computed(() => {
    const a = this.aluno();
    return a ? BELT_HEX[a.beltColor] : BELT_HEX.black;
  });

  protected readonly grupos = computed(() => {
    const cur = this.aluno()?.curriculo ?? [];
    return [
      { titulo: 'Kihon', itens: cur.filter((c) => c.categoria === 'kihon') },
      { titulo: 'Kata', itens: cur.filter((c) => c.categoria === 'kata') },
      { titulo: 'Kumite', itens: cur.filter((c) => c.categoria === 'kumite') },
    ].filter((g) => g.itens.length);
  });

  protected readonly dominados = computed(() => {
    const cur = this.aluno()?.curriculo ?? [];
    return cur.filter((c) => c.dominado).length;
  });

  protected trackItem = (_: number, item: CurriculoItem) => item.id;
  protected readonly formatData = formatDataBR;
}
