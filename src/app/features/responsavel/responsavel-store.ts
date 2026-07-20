import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { Aluno, AlunoComProgresso, Fatura, Frequencia } from '../../core/models';
import { ALUNOS_SERVICE, FINANCEIRO_SERVICE, FREQUENCIA_SERVICE } from '../../core/contracts/data-contracts';
import { SessionService } from '../../core/services/session.service';
import { BeltLineageService } from '../../core/services/belt-lineage.service';

export interface AcaoPendente {
  tipo: 'financeiro' | 'aptidao';
  dependenteNome: string;
  titulo: string;
  descricao: string;
}

/** Facade da role Responsável: dependentes, financeiro consolidado e pendências. */
@Injectable({ providedIn: 'root' })
export class ResponsavelStore {
  private readonly alunosSvc = inject(ALUNOS_SERVICE);
  private readonly financeiroSvc = inject(FINANCEIRO_SERVICE);
  private readonly freqSvc = inject(FREQUENCIA_SERVICE);
  private readonly session = inject(SessionService);
  private readonly lineage = inject(BeltLineageService);

  private readonly _dependentes = signal<Aluno[]>([]);
  private readonly _faturas = signal<Fatura[]>([]);
  private readonly _loading = signal(true);
  readonly selectedId = signal<string | null>(null);
  readonly loading = this._loading.asReadonly();

  /** Dependentes enriquecidos com faixa/progresso. */
  readonly dependentes = computed<AlunoComProgresso[]>(() =>
    this._dependentes().map((a) => ({
      ...a,
      faixaAtual: this.lineage.byColor(a.beltColor),
      proximaFaixa: this.lineage.next(a.beltColor),
      progressoPercent: this.lineage.progressPercent(a.beltColor, a.horasAcumuladas),
    })),
  );

  readonly selecionado = computed<AlunoComProgresso | null>(
    () => this.dependentes().find((d) => d.id === this.selectedId()) ?? this.dependentes()[0] ?? null,
  );

  /** Faturas de todos os dependentes (plano familiar consolidado). */
  readonly faturas = this._faturas.asReadonly();
  readonly totalAberto = computed(() =>
    this._faturas().filter((f) => f.status !== 'paga').reduce((s, f) => s + f.valor, 0),
  );

  /** Pendências priorizadas para a home de atrito zero. */
  readonly acoesPendentes = computed<AcaoPendente[]>(() => {
    const acoes: AcaoPendente[] = [];
    for (const dep of this.dependentes()) {
      const vencidas = this._faturas().filter((f) => f.alunoId === dep.id && f.status === 'vencida');
      if (vencidas.length) {
        acoes.push({
          tipo: 'financeiro',
          dependenteNome: dep.nome,
          titulo: `Fatura vencida de ${dep.nome}`,
          descricao: vencidas[0].descricao,
        });
      }
      if (dep.progressoPercent >= 100 && dep.proximaFaixa) {
        acoes.push({
          tipo: 'aptidao',
          dependenteNome: dep.nome,
          titulo: `${dep.nome} está apto(a) à faixa ${dep.proximaFaixa.label}! 🎉`,
          descricao: 'Carga horária e disciplina concluídas. Prepare-se para a graduação.',
        });
      }
    }
    // Financeiro primeiro (mais urgente).
    return acoes.sort((a, b) => (a.tipo === 'financeiro' ? -1 : 1));
  });

  constructor() {
    effect(() => {
      const rid = this.session.responsavelId();
      if (rid) void this.load(rid);
    });
  }

  async load(responsavelId: string): Promise<void> {
    this._loading.set(true);
    const dependentes = await this.alunosSvc.getByResponsavel(responsavelId);
    this._dependentes.set(dependentes);
    this.selectedId.set(dependentes[0]?.id ?? null);
    this._faturas.set(await this.financeiroSvc.getFaturasByAlunos(dependentes.map((d) => d.id)));
    this._loading.set(false);
  }

  getFrequencias(alunoId: string): Promise<Frequencia[]> {
    return this.freqSvc.getByAluno(alunoId);
  }
}
