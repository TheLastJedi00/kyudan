import { Injectable, computed, inject, signal } from '@angular/core';
import {
  Aluno,
  Campeonato,
  Exame,
  Fatura,
  IndicacaoExame,
  ItemInventario,
  Polo,
  RegraSplit,
  Turma,
} from '../../core/models';
import {
  ALUNOS_SERVICE,
  EXAMES_SERVICE,
  FINANCEIRO_SERVICE,
  POLOS_SERVICE,
} from '../../core/contracts/data-contracts';
import { BeltLineageService } from '../../core/services/belt-lineage.service';
import { USUARIOS } from '../../core/data/mock-dataset';

export interface Metricas {
  ativos: number;
  inadimplentes: number;
  professores: number;
}

export interface AlertaGestao {
  tone: 'danger' | 'warning' | 'info';
  titulo: string;
  icon: string;
}

export interface PoloSaude extends Polo {
  totalAlunos: number;
}

/** Facade da role Gestão: carrega toda a base e expõe agregados executivos. */
@Injectable({ providedIn: 'root' })
export class GestaoStore {
  private readonly alunosSvc = inject(ALUNOS_SERVICE);
  private readonly polosSvc = inject(POLOS_SERVICE);
  private readonly financeiroSvc = inject(FINANCEIRO_SERVICE);
  private readonly examesSvc = inject(EXAMES_SERVICE);
  private readonly lineage = inject(BeltLineageService);

  readonly alunos = signal<Aluno[]>([]);
  readonly polos = signal<Polo[]>([]);
  readonly turmas = signal<Turma[]>([]);
  readonly faturas = signal<Fatura[]>([]);
  readonly exames = signal<Exame[]>([]);
  readonly campeonatos = signal<Campeonato[]>([]);
  readonly inventario = signal<ItemInventario[]>([]);
  readonly splits = signal<RegraSplit[]>([]);
  readonly indicacoes = signal<IndicacaoExame[]>([]);
  readonly loading = signal(true);

  private carregado = false;

  constructor() {
    void this.load();
  }

  async load(): Promise<void> {
    if (this.carregado) return;
    this.loading.set(true);
    const [alunos, polos, turmas, faturas, exames, campeonatos, inventario, splits, indicacoes] =
      await Promise.all([
        this.alunosSvc.getAll(),
        this.polosSvc.getPolos(),
        this.polosSvc.getTurmas(),
        this.financeiroSvc.getFaturas(),
        this.examesSvc.getExames(),
        this.examesSvc.getCampeonatos(),
        this.financeiroSvc.getInventario(),
        this.financeiroSvc.getSplits(),
        this.examesSvc.getIndicacoes(),
      ]);
    this.alunos.set(alunos);
    this.polos.set(polos);
    this.turmas.set(turmas);
    this.faturas.set(faturas);
    this.exames.set(exames);
    this.campeonatos.set(campeonatos);
    this.inventario.set(inventario);
    this.splits.set(splits);
    this.indicacoes.set(indicacoes);
    this.carregado = true;
    this.loading.set(false);
  }

  /** IDs de alunos com ao menos uma fatura vencida. */
  private readonly inadimplentesIds = computed(
    () => new Set(this.faturas().filter((f) => f.status === 'vencida').map((f) => f.alunoId)),
  );

  readonly metricas = computed<Metricas>(() => ({
    ativos: this.alunos().length,
    inadimplentes: this.inadimplentesIds().size,
    professores: new Set(this.turmas().map((t) => t.senseiId)).size,
  }));

  readonly polosSaude = computed<PoloSaude[]>(() =>
    this.polos()
      .map((p) => ({ ...p, totalAlunos: this.alunos().filter((a) => a.poloId === p.id).length }))
      .sort((a, b) => b.crescimentoMes - a.crescimentoMes),
  );

  readonly alertas = computed<AlertaGestao[]>(() => {
    const alertas: AlertaGestao[] = [];
    const fckVencido = this.alunos().filter((a) => a.filiacoes.fck === 'vencido').length;
    const fckVencendo = this.alunos().filter((a) => a.filiacoes.fck === 'vencendo').length;
    if (fckVencido) {
      alertas.push({ tone: 'danger', icon: 'shield', titulo: `${fckVencido} aluno(s) com anuidade FCK vencida` });
    }
    if (fckVencendo) {
      alertas.push({ tone: 'warning', icon: 'shield', titulo: `${fckVencendo} anuidade(s) FCK vencendo em breve` });
    }
    const evasao = this.polos().filter((p) => p.crescimentoMes < 0);
    for (const p of evasao) {
      alertas.push({ tone: 'warning', icon: 'pin', titulo: `${p.nome}: evasão de ${Math.abs(p.crescimentoMes)} alunos no mês` });
    }
    if (this.indicacoes().length) {
      alertas.push({ tone: 'info', icon: 'check', titulo: `${this.indicacoes().length} indicação(ões) de exame aguardando validação` });
    }
    const estoqueBaixo = this.inventario().filter((i) => i.quantidade < i.estoqueMinimo).length;
    if (estoqueBaixo) {
      alertas.push({ tone: 'warning', icon: 'alert', titulo: `${estoqueBaixo} item(ns) de inventário com estoque baixo` });
    }
    return alertas;
  });

  isInadimplente(alunoId: string): boolean {
    return this.inadimplentesIds().has(alunoId);
  }

  poloNome(id: string): string {
    return this.polos().find((p) => p.id === id)?.nome ?? '—';
  }

  turmasDoPolo(poloId: string): Turma[] {
    return this.turmas().filter((t) => t.poloId === poloId);
  }

  senseiNome(id: string): string {
    return USUARIOS.find((u) => u.id === id)?.nome ?? id;
  }

  alunoNome(id: string): string {
    return this.alunos().find((a) => a.id === id)?.nome ?? id;
  }

  /** Adiciona um pólo localmente (cadastro mocado do MVC). */
  addPolo(polo: Polo): void {
    this.polos.update((ps) => [...ps, polo]);
  }

  /** Adiciona um exame localmente (cadastro mocado do MVC). */
  addExame(exame: Exame): void {
    this.exames.update((es) => [...es, exame]);
  }

  /** Faixas disponíveis como alvo de exame (todas menos a Branca inicial). */
  get faixasAlvo() {
    return this.lineage.all.filter((b) => b.order > 0);
  }

  proximaFaixaLabel(a: Aluno): string {
    return this.lineage.next(a.beltColor)?.label ?? '—';
  }

  /** Aptos a um exame por carência de horas e faixa-alvo. */
  aptosParaExame(exame: Exame): Aluno[] {
    return this.alunos().filter((a) => {
      const atual = this.lineage.byColor(a.beltColor);
      const prox = this.lineage.next(a.beltColor);
      return prox?.color === exame.faixaAlvo && atual.requiredHours > 0 && a.horasAcumuladas >= atual.requiredHours;
    });
  }
}
