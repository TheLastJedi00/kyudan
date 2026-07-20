import { Injectable, inject } from '@angular/core';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
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
import { FirebaseService } from './firebase.service';

/**
 * Implementações Firestore dos repositórios. Toda a lógica do BaaS (coleções,
 * queries) vive aqui — os componentes desconhecem a existência do Firebase.
 * Guardadas por `isBrowser` para não tentar rede durante SSR/prerender.
 */

abstract class FirestoreBase {
  protected readonly fb = inject(FirebaseService);

  protected async list<T>(name: string): Promise<T[]> {
    if (!this.fb.isBrowser) return [];
    const snap = await getDocs(collection(this.fb.db, name));
    return snap.docs.map((d) => d.data() as T);
  }

  protected async listWhere<T>(name: string, field: string, value: unknown): Promise<T[]> {
    if (!this.fb.isBrowser) return [];
    const q = query(collection(this.fb.db, name), where(field, '==', value));
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as T);
  }
}

@Injectable()
export class FirebaseAlunosService extends FirestoreBase implements IAlunosService {
  getAll(): Promise<Aluno[]> {
    return this.list<Aluno>('alunos');
  }
  async getById(id: string): Promise<Aluno | null> {
    if (!this.fb.isBrowser) return null;
    const snap = await getDoc(doc(this.fb.db, 'alunos', id));
    return snap.exists() ? (snap.data() as Aluno) : null;
  }
  getByPolo(poloId: string): Promise<Aluno[]> {
    return this.listWhere<Aluno>('alunos', 'poloId', poloId);
  }
  getByTurma(turmaId: string): Promise<Aluno[]> {
    return this.listWhere<Aluno>('alunos', 'turmaId', turmaId);
  }
  getByResponsavel(responsavelId: string): Promise<Aluno[]> {
    return this.listWhere<Aluno>('alunos', 'responsavelId', responsavelId);
  }
  async toggleCurriculoItem(alunoId: string, item: CurriculoItem): Promise<void> {
    if (!this.fb.isBrowser) return;
    const aluno = await this.getById(alunoId);
    if (!aluno) return;
    const curriculo = aluno.curriculo.map((c) =>
      c.id === item.id ? { ...c, dominado: item.dominado } : c,
    );
    await updateDoc(doc(this.fb.db, 'alunos', alunoId), { curriculo });
  }
  async addOcorrencia(alunoId: string, ocorrencia: Ocorrencia): Promise<void> {
    if (!this.fb.isBrowser) return;
    const aluno = await this.getById(alunoId);
    if (!aluno) return;
    const ocorrencias = [ocorrencia, ...aluno.ocorrencias];
    await updateDoc(doc(this.fb.db, 'alunos', alunoId), { ocorrencias });
  }
}

@Injectable()
export class FirebasePolosService extends FirestoreBase implements IPolosService {
  getPolos(): Promise<Polo[]> {
    return this.list<Polo>('polos');
  }
  async getPoloById(id: string): Promise<Polo | null> {
    if (!this.fb.isBrowser) return null;
    const snap = await getDoc(doc(this.fb.db, 'polos', id));
    return snap.exists() ? (snap.data() as Polo) : null;
  }
  getTurmas(): Promise<Turma[]> {
    return this.list<Turma>('turmas');
  }
  getTurmasBySensei(senseiId: string): Promise<Turma[]> {
    return this.listWhere<Turma>('turmas', 'senseiId', senseiId);
  }
  getTurmasByPolo(poloId: string): Promise<Turma[]> {
    return this.listWhere<Turma>('turmas', 'poloId', poloId);
  }
}

@Injectable()
export class FirebaseExamesService extends FirestoreBase implements IExamesService {
  getExames(): Promise<Exame[]> {
    return this.list<Exame>('exames');
  }
  getCampeonatos(): Promise<Campeonato[]> {
    return this.list<Campeonato>('campeonatos');
  }
  getIndicacoes(): Promise<IndicacaoExame[]> {
    return this.list<IndicacaoExame>('indicacoes');
  }
  async indicar(indicacoes: IndicacaoExame[]): Promise<void> {
    if (!this.fb.isBrowser || !indicacoes.length) return;
    const batch = writeBatch(this.fb.db);
    for (const ind of indicacoes) {
      const ref = doc(this.fb.db, 'indicacoes', `${ind.exameId}_${ind.alunoId}`);
      batch.set(ref, ind);
    }
    await batch.commit();
  }
}

@Injectable()
export class FirebaseFinanceiroService extends FirestoreBase implements IFinanceiroService {
  getFaturas(): Promise<Fatura[]> {
    return this.list<Fatura>('faturas');
  }
  getFaturasByAluno(alunoId: string): Promise<Fatura[]> {
    return this.listWhere<Fatura>('faturas', 'alunoId', alunoId);
  }
  async getFaturasByAlunos(alunoIds: string[]): Promise<Fatura[]> {
    if (!this.fb.isBrowser || !alunoIds.length) return [];
    // Firestore 'in' aceita até 30 valores; suficiente para o plano familiar do MVC.
    const q = query(collection(this.fb.db, 'faturas'), where('alunoId', 'in', alunoIds.slice(0, 30)));
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as Fatura);
  }
  getSplits(): Promise<RegraSplit[]> {
    return this.list<RegraSplit>('splits');
  }
  getInventario(): Promise<ItemInventario[]> {
    return this.list<ItemInventario>('inventario');
  }
}

@Injectable()
export class FirebaseFrequenciaService extends FirestoreBase implements IFrequenciaService {
  getByTurma(turmaId: string): Promise<Frequencia[]> {
    return this.listWhere<Frequencia>('frequencias', 'turmaId', turmaId);
  }
  getByAluno(alunoId: string): Promise<Frequencia[]> {
    return this.listWhere<Frequencia>('frequencias', 'alunoId', alunoId);
  }
  async salvarChamada(frequencias: Frequencia[]): Promise<void> {
    if (!this.fb.isBrowser || !frequencias.length) return;
    const batch = writeBatch(this.fb.db);
    for (const f of frequencias) {
      const ref = doc(this.fb.db, 'frequencias', `${f.turmaId}_${f.data}_${f.alunoId}`);
      batch.set(ref, f);
    }
    await batch.commit();
  }
}
