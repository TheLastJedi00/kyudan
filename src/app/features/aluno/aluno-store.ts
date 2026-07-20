import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { Aluno, AlunoComProgresso, Exame, Fatura } from '../../core/models';
import { ALUNOS_SERVICE, EXAMES_SERVICE, FINANCEIRO_SERVICE } from '../../core/contracts/data-contracts';
import { BeltLineageService } from '../../core/services/belt-lineage.service';
import { SessionService } from '../../core/services/session.service';

/**
 * Facade da role Aluno: carrega o praticante atual + faturas + exames e expõe
 * estado reativo (signals). Concentra a lógica de apresentação fora das telas.
 */
@Injectable({ providedIn: 'root' })
export class AlunoStore {
  private readonly alunosSvc = inject(ALUNOS_SERVICE);
  private readonly financeiroSvc = inject(FINANCEIRO_SERVICE);
  private readonly examesSvc = inject(EXAMES_SERVICE);
  private readonly lineage = inject(BeltLineageService);
  private readonly session = inject(SessionService);

  private readonly _aluno = signal<Aluno | null>(null);
  private readonly _faturas = signal<Fatura[]>([]);
  private readonly _exames = signal<Exame[]>([]);
  private readonly _loading = signal(true);

  readonly loading = this._loading.asReadonly();
  readonly faturas = this._faturas.asReadonly();

  /** Aluno enriquecido com faixa atual/próxima e progresso. */
  readonly aluno = computed<AlunoComProgresso | null>(() => {
    const a = this._aluno();
    if (!a) return null;
    return {
      ...a,
      faixaAtual: this.lineage.byColor(a.beltColor),
      proximaFaixa: this.lineage.next(a.beltColor),
      progressoPercent: this.lineage.progressPercent(a.beltColor, a.horasAcumuladas),
    };
  });

  /** Próximo exame cronologicamente compatível com a próxima faixa do aluno. */
  readonly proximoExame = computed<Exame | null>(() => {
    const prox = this.aluno()?.proximaFaixa;
    if (!prox) return null;
    return (
      this._exames()
        .filter((e) => e.faixaAlvo === prox.color)
        .sort((a, b) => a.data.localeCompare(b.data))[0] ?? null
    );
  });

  constructor() {
    // Recarrega sempre que a persona-aluno mudar.
    effect(() => {
      const id = this.session.alunoId();
      if (id) this.load(id);
    });
  }

  async load(alunoId: string): Promise<void> {
    this._loading.set(true);
    const [aluno, faturas, exames] = await Promise.all([
      this.alunosSvc.getById(alunoId),
      this.financeiroSvc.getFaturasByAluno(alunoId),
      this.examesSvc.getExames(),
    ]);
    this._aluno.set(aluno);
    this._faturas.set(faturas);
    this._exames.set(exames);
    this._loading.set(false);
  }
}
