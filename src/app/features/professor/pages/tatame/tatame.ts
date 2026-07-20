import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProfessorStore } from '../../professor-store';
import { AppCard, Icon } from '../../../../shared/ui';
import { DIAS_SEMANA, diaSemanaHoje } from '../../../../shared/util/format';
import { Turma } from '../../../../core/models';

interface TurmaView extends Turma {
  hoje: boolean;
  horarioHoje: string | null;
  diasLabel: string;
}

/** O Tatame — Visão do Dia: turmas do sensei, priorizando as de hoje. */
@Component({
  selector: 'app-tatame',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, AppCard, Icon],
  templateUrl: './tatame.html',
  styleUrl: './tatame.scss',
})
export class Tatame {
  private readonly store = inject(ProfessorStore);
  private readonly dow = diaSemanaHoje();

  protected readonly hojeLabel = DIAS_SEMANA[this.dow];

  private readonly view = computed<TurmaView[]>(() =>
    this.store.turmas().map((t) => {
      const hojeHorario = t.horarios.find((h) => h.diaSemana === this.dow);
      return {
        ...t,
        hoje: !!hojeHorario,
        horarioHoje: hojeHorario ? `${hojeHorario.inicio}–${hojeHorario.fim}` : null,
        diasLabel: t.horarios.map((h) => DIAS_SEMANA[h.diaSemana].slice(0, 3)).join(', '),
      };
    }),
  );

  protected readonly turmasHoje = computed(() =>
    this.view()
      .filter((t) => t.hoje)
      .sort((a, b) => (a.horarioHoje ?? '').localeCompare(b.horarioHoje ?? '')),
  );
  protected readonly outrasTurmas = computed(() => this.view().filter((t) => !t.hoje));
}
