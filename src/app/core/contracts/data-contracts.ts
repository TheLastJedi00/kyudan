import { InjectionToken } from '@angular/core';
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

/**
 * Contratos da camada de dados (padrão Repository/Adapter).
 * A UI depende SOMENTE destas interfaces — nunca do Firebase diretamente.
 * Trocar Firebase por API (NestJS) = trocar o provider do token, sem tocar na UI.
 */

export interface IAlunosService {
  getAll(): Promise<Aluno[]>;
  getById(id: string): Promise<Aluno | null>;
  getByPolo(poloId: string): Promise<Aluno[]>;
  getByTurma(turmaId: string): Promise<Aluno[]>;
  getByResponsavel(responsavelId: string): Promise<Aluno[]>;
  toggleCurriculoItem(alunoId: string, item: CurriculoItem): Promise<void>;
  addOcorrencia(alunoId: string, ocorrencia: Ocorrencia): Promise<void>;
}

export interface IPolosService {
  getPolos(): Promise<Polo[]>;
  getPoloById(id: string): Promise<Polo | null>;
  getTurmas(): Promise<Turma[]>;
  getTurmasBySensei(senseiId: string): Promise<Turma[]>;
  getTurmasByPolo(poloId: string): Promise<Turma[]>;
}

export interface IExamesService {
  getExames(): Promise<Exame[]>;
  getCampeonatos(): Promise<Campeonato[]>;
  getIndicacoes(): Promise<IndicacaoExame[]>;
  indicar(indicacoes: IndicacaoExame[]): Promise<void>;
}

export interface IFinanceiroService {
  getFaturas(): Promise<Fatura[]>;
  getFaturasByAluno(alunoId: string): Promise<Fatura[]>;
  getFaturasByAlunos(alunoIds: string[]): Promise<Fatura[]>;
  getSplits(): Promise<RegraSplit[]>;
  getInventario(): Promise<ItemInventario[]>;
}

export interface IFrequenciaService {
  getByTurma(turmaId: string): Promise<Frequencia[]>;
  getByAluno(alunoId: string): Promise<Frequencia[]>;
  salvarChamada(frequencias: Frequencia[]): Promise<void>;
}

export const ALUNOS_SERVICE = new InjectionToken<IAlunosService>('ALUNOS_SERVICE');
export const POLOS_SERVICE = new InjectionToken<IPolosService>('POLOS_SERVICE');
export const EXAMES_SERVICE = new InjectionToken<IExamesService>('EXAMES_SERVICE');
export const FINANCEIRO_SERVICE = new InjectionToken<IFinanceiroService>('FINANCEIRO_SERVICE');
export const FREQUENCIA_SERVICE = new InjectionToken<IFrequenciaService>('FREQUENCIA_SERVICE');
