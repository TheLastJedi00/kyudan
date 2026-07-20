import { Injectable } from '@angular/core';
import {
  Aluno,
  Campeonato,
  CurriculoItem,
  Exame,
  Fatura,
  Frequencia,
  IndicacaoExame,
  ItemInventario,
  Ocorrencia,
  Polo,
  RegraSplit,
  Turma,
} from '../models';
import {
  IAlunosService,
  IExamesService,
  IFinanceiroService,
  IFrequenciaService,
  IPolosService,
} from '../contracts/data-contracts';
import {
  ALUNOS,
  CAMPEONATOS,
  EXAMES,
  FATURAS,
  FREQUENCIAS,
  INDICACOES,
  INVENTARIO,
  POLOS,
  SPLITS,
  TURMAS,
} from './mock-dataset';

/** Cópia profunda simples para não mutar o dataset original entre reloads de HMR. */
const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v));

/**
 * Estado in-memory compartilhado — atua como um "Firestore local" para o MVC,
 * permitindo que o app rode 100% offline. As mutações são persistidas em memória.
 */
class MockStore {
  alunos: Aluno[] = clone(ALUNOS);
  polos: Polo[] = clone(POLOS);
  turmas: Turma[] = clone(TURMAS);
  exames: Exame[] = clone(EXAMES);
  campeonatos: Campeonato[] = clone(CAMPEONATOS);
  indicacoes: IndicacaoExame[] = clone(INDICACOES);
  faturas: Fatura[] = clone(FATURAS);
  splits: RegraSplit[] = clone(SPLITS);
  inventario: ItemInventario[] = clone(INVENTARIO);
  frequencias: Frequencia[] = clone(FREQUENCIAS);
}

const store = new MockStore();

@Injectable()
export class MockAlunosService implements IAlunosService {
  async getAll(): Promise<Aluno[]> {
    return clone(store.alunos);
  }
  async getById(id: string): Promise<Aluno | null> {
    return clone(store.alunos.find((a) => a.id === id) ?? null);
  }
  async getByPolo(poloId: string): Promise<Aluno[]> {
    return clone(store.alunos.filter((a) => a.poloId === poloId));
  }
  async getByTurma(turmaId: string): Promise<Aluno[]> {
    return clone(store.alunos.filter((a) => a.turmaId === turmaId));
  }
  async getByResponsavel(responsavelId: string): Promise<Aluno[]> {
    return clone(store.alunos.filter((a) => a.responsavelId === responsavelId));
  }
  async toggleCurriculoItem(alunoId: string, item: CurriculoItem): Promise<void> {
    const aluno = store.alunos.find((a) => a.id === alunoId);
    const found = aluno?.curriculo.find((c) => c.id === item.id);
    if (found) found.dominado = item.dominado;
  }
  async addOcorrencia(alunoId: string, ocorrencia: Ocorrencia): Promise<void> {
    store.alunos.find((a) => a.id === alunoId)?.ocorrencias.unshift(clone(ocorrencia));
  }
}

@Injectable()
export class MockPolosService implements IPolosService {
  async getPolos(): Promise<Polo[]> {
    return clone(store.polos);
  }
  async getPoloById(id: string): Promise<Polo | null> {
    return clone(store.polos.find((p) => p.id === id) ?? null);
  }
  async getTurmas(): Promise<Turma[]> {
    return clone(store.turmas);
  }
  async getTurmasBySensei(senseiId: string): Promise<Turma[]> {
    return clone(store.turmas.filter((t) => t.senseiId === senseiId));
  }
  async getTurmasByPolo(poloId: string): Promise<Turma[]> {
    return clone(store.turmas.filter((t) => t.poloId === poloId));
  }
}

@Injectable()
export class MockExamesService implements IExamesService {
  async getExames(): Promise<Exame[]> {
    return clone(store.exames);
  }
  async getCampeonatos(): Promise<Campeonato[]> {
    return clone(store.campeonatos);
  }
  async getIndicacoes(): Promise<IndicacaoExame[]> {
    return clone(store.indicacoes);
  }
  async indicar(indicacoes: IndicacaoExame[]): Promise<void> {
    for (const ind of indicacoes) {
      const jaExiste = store.indicacoes.some(
        (i) => i.alunoId === ind.alunoId && i.exameId === ind.exameId,
      );
      if (!jaExiste) store.indicacoes.push(clone(ind));
    }
  }
}

@Injectable()
export class MockFinanceiroService implements IFinanceiroService {
  async getFaturas(): Promise<Fatura[]> {
    return clone(store.faturas);
  }
  async getFaturasByAluno(alunoId: string): Promise<Fatura[]> {
    return clone(store.faturas.filter((f) => f.alunoId === alunoId));
  }
  async getFaturasByAlunos(alunoIds: string[]): Promise<Fatura[]> {
    return clone(store.faturas.filter((f) => alunoIds.includes(f.alunoId)));
  }
  async getSplits(): Promise<RegraSplit[]> {
    return clone(store.splits);
  }
  async getInventario(): Promise<ItemInventario[]> {
    return clone(store.inventario);
  }
}

@Injectable()
export class MockFrequenciaService implements IFrequenciaService {
  async getByTurma(turmaId: string): Promise<Frequencia[]> {
    return clone(store.frequencias.filter((f) => f.turmaId === turmaId));
  }
  async getByAluno(alunoId: string): Promise<Frequencia[]> {
    return clone(store.frequencias.filter((f) => f.alunoId === alunoId));
  }
  async salvarChamada(frequencias: Frequencia[]): Promise<void> {
    for (const nova of frequencias) {
      const idx = store.frequencias.findIndex(
        (f) => f.alunoId === nova.alunoId && f.data === nova.data && f.turmaId === nova.turmaId,
      );
      if (idx >= 0) store.frequencias[idx] = clone(nova);
      else store.frequencias.push(clone(nova));
    }
  }
}
