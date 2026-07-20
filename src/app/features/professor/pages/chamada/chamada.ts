import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProfessorStore } from '../../professor-store';
import { AppCard, BeltBadge, Button, Icon } from '../../../../shared/ui';
import { Aluno, AlunoAlerta, Frequencia } from '../../../../core/models';
import { DIAS_SEMANA, diaSemanaHoje, hojeISO } from '../../../../shared/util/format';

/** Chamada rápida: tap alterna presença; alertas visuais por aluno. */
@Component({
  selector: 'app-chamada',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, AppCard, BeltBadge, Button, Icon],
  templateUrl: './chamada.html',
  styleUrl: './chamada.scss',
})
export class Chamada {
  private readonly store = inject(ProfessorStore);

  /** Vinculado ao parâmetro de rota (withComponentInputBinding). */
  readonly turmaId = input.required<string>();

  protected readonly alunos = signal<Aluno[]>([]);
  protected readonly presencas = signal<Record<string, boolean>>({});
  protected readonly salvo = signal(false);

  protected readonly turma = computed(() => this.store.turmaById(this.turmaId()));
  protected readonly hojeLabel = DIAS_SEMANA[diaSemanaHoje()];
  protected readonly presentesCount = computed(
    () => Object.values(this.presencas()).filter(Boolean).length,
  );

  constructor() {
    effect(() => {
      const id = this.turmaId();
      if (id) void this.carregar(id);
    });
  }

  private async carregar(turmaId: string): Promise<void> {
    const alunos = await this.store.getAlunosByTurma(turmaId);
    this.alunos.set(alunos);
    // Estado inicial: todos ausentes (o sensei confirma quem veio).
    this.presencas.set(Object.fromEntries(alunos.map((a) => [a.id, false])));
    this.salvo.set(false);
  }

  protected toggle(alunoId: string): void {
    this.presencas.update((p) => ({ ...p, [alunoId]: !p[alunoId] }));
    this.salvo.set(false);
  }

  protected marcarTodos(): void {
    this.presencas.set(Object.fromEntries(this.alunos().map((a) => [a.id, true])));
    this.salvo.set(false);
  }

  protected async salvar(): Promise<void> {
    const data = hojeISO();
    const tid = this.turmaId();
    const freq: Frequencia[] = this.alunos().map((a) => ({
      alunoId: a.id,
      turmaId: tid,
      data,
      presente: !!this.presencas()[a.id],
    }));
    await this.store.salvarChamada(freq);
    this.salvo.set(true);
  }

  protected alertaChip(a: AlunoAlerta): { label: string; icon: string } {
    switch (a) {
      case 'mensalidade':
        return { label: 'Mensalidade', icon: 'wallet' };
      case 'fck':
        return { label: 'FCK', icon: 'shield' };
      case 'medico':
        return { label: 'Restrição médica', icon: 'alert' };
    }
  }
}
