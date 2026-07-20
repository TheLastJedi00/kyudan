import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { Aluno, CurriculoItem, Exame, Frequencia, IndicacaoExame, Ocorrencia, Turma } from '../../core/models';
import {
  ALUNOS_SERVICE,
  EXAMES_SERVICE,
  FREQUENCIA_SERVICE,
  POLOS_SERVICE,
} from '../../core/contracts/data-contracts';
import { SessionService } from '../../core/services/session.service';
import { BeltLineageService } from '../../core/services/belt-lineage.service';

/** Facade da role Professor: turmas do sensei e ações do tatame. */
@Injectable({ providedIn: 'root' })
export class ProfessorStore {
  private readonly polosSvc = inject(POLOS_SERVICE);
  private readonly alunosSvc = inject(ALUNOS_SERVICE);
  private readonly freqSvc = inject(FREQUENCIA_SERVICE);
  private readonly examesSvc = inject(EXAMES_SERVICE);
  private readonly session = inject(SessionService);
  private readonly lineage = inject(BeltLineageService);

  private readonly _turmas = signal<Turma[]>([]);
  readonly turmas = this._turmas.asReadonly();

  constructor() {
    effect(() => {
      const sid = this.session.senseiId();
      if (sid) this.loadTurmas(sid);
    });
  }

  private async loadTurmas(senseiId: string): Promise<void> {
    this._turmas.set(await this.polosSvc.getTurmasBySensei(senseiId));
  }

  turmaById(id: string): Turma | undefined {
    return this._turmas().find((t) => t.id === id);
  }

  getAlunosByTurma(turmaId: string): Promise<Aluno[]> {
    return this.alunosSvc.getByTurma(turmaId);
  }

  getAlunoById(id: string): Promise<Aluno | null> {
    return this.alunosSvc.getById(id);
  }

  salvarChamada(frequencias: Frequencia[]): Promise<void> {
    return this.freqSvc.salvarChamada(frequencias);
  }

  toggleCurriculo(alunoId: string, item: CurriculoItem): Promise<void> {
    return this.alunosSvc.toggleCurriculoItem(alunoId, item);
  }

  addOcorrencia(alunoId: string, ocorrencia: Ocorrencia): Promise<void> {
    return this.alunosSvc.addOcorrencia(alunoId, ocorrencia);
  }

  getExames(): Promise<Exame[]> {
    return this.examesSvc.getExames();
  }

  indicar(indicacoes: IndicacaoExame[]): Promise<void> {
    return this.examesSvc.indicar(indicacoes);
  }

  /** Todos os alunos das turmas do sensei. */
  async getAlunosDoSensei(): Promise<Aluno[]> {
    const turmas = this._turmas();
    const listas = await Promise.all(turmas.map((t) => this.alunosSvc.getByTurma(t.id)));
    return listas.flat();
  }

  /** Aluno cumpriu a carência (horas) para a próxima faixa? */
  aptoPorCarencia(aluno: Aluno): boolean {
    const atual = this.lineage.byColor(aluno.beltColor);
    return atual.requiredHours > 0 && aluno.horasAcumuladas >= atual.requiredHours;
  }
}
