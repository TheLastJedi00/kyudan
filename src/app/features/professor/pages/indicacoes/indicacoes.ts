import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ProfessorStore } from '../../professor-store';
import { SessionService } from '../../../../core/services/session.service';
import { BeltLineageService } from '../../../../core/services/belt-lineage.service';
import { AppCard, BeltBadge, Button, Icon } from '../../../../shared/ui';
import { Aluno, Exame, IndicacaoExame } from '../../../../core/models';
import { formatDataBR, hojeISO } from '../../../../shared/util/format';

/** Indicação ao exame: aptos por carência + aval técnico do Sensei. */
@Component({
  selector: 'app-indicacoes',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppCard, BeltBadge, Button, Icon],
  templateUrl: './indicacoes.html',
  styleUrl: './indicacoes.scss',
})
export class Indicacoes {
  private readonly store = inject(ProfessorStore);
  private readonly session = inject(SessionService);
  private readonly lineage = inject(BeltLineageService);

  protected readonly exames = signal<Exame[]>([]);
  protected readonly aptos = signal<Aluno[]>([]);
  protected readonly exameSelId = signal<string>('');
  protected readonly selecionados = signal<Set<string>>(new Set());
  protected readonly enviado = signal(false);

  protected readonly formatData = formatDataBR;
  protected readonly totalSel = computed(() => this.selecionados().size);

  constructor() {
    void this.carregar();
  }

  private async carregar(): Promise<void> {
    const [exames, alunos] = await Promise.all([
      this.store.getExames(),
      this.store.getAlunosDoSensei(),
    ]);
    this.exames.set(exames);
    this.aptos.set(alunos.filter((a) => this.store.aptoPorCarencia(a)));
    if (exames.length) this.exameSelId.set(exames[0].id);
  }

  protected proximaFaixaLabel(a: Aluno): string {
    return this.lineage.next(a.beltColor)?.label ?? '—';
  }

  protected toggle(alunoId: string): void {
    this.selecionados.update((set) => {
      const novo = new Set(set);
      novo.has(alunoId) ? novo.delete(alunoId) : novo.add(alunoId);
      return novo;
    });
    this.enviado.set(false);
  }

  protected async submeter(): Promise<void> {
    const exameId = this.exameSelId();
    const senseiId = this.session.currentUser().id;
    if (!exameId || !this.selecionados().size) return;
    const indicacoes: IndicacaoExame[] = [...this.selecionados()].map((alunoId) => ({
      alunoId,
      exameId,
      senseiId,
      data: hojeISO(),
    }));
    await this.store.indicar(indicacoes);
    this.enviado.set(true);
    this.selecionados.set(new Set());
  }
}
