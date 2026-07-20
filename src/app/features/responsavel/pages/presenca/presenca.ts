import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { ResponsavelStore } from '../../responsavel-store';
import { DependenteSelector } from '../../components/dependente-selector/dependente-selector';
import { AppCard } from '../../../../shared/ui';
import { Frequencia } from '../../../../core/models';

interface DiaCal {
  dia: number | null;
  status: 'presente' | 'falta' | 'sem-aula';
}

/** Calendário de presença mensal do dependente. */
@Component({
  selector: 'app-presenca',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DependenteSelector, AppCard],
  templateUrl: './presenca.html',
  styleUrl: './presenca.scss',
})
export class Presenca {
  protected readonly store = inject(ResponsavelStore);
  protected readonly diasSemana = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

  private readonly frequencias = signal<Frequencia[]>([]);

  protected readonly mesAno = computed(() => {
    const f = this.frequencias();
    const ref = f.length ? f[f.length - 1].data : new Date().toISOString().slice(0, 10);
    const [y, m] = ref.split('-');
    const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    return { label: `${meses[Number(m) - 1]} de ${y}`, y: Number(y), m: Number(m) };
  });

  protected readonly presentes = computed(() => this.frequencias().filter((f) => f.presente).length);
  protected readonly faltas = computed(() => this.frequencias().filter((f) => !f.presente).length);

  protected readonly grade = computed<DiaCal[]>(() => {
    const { y, m } = this.mesAno();
    const mapa = new Map<number, boolean>();
    for (const f of this.frequencias()) {
      const [fy, fm, fd] = f.data.split('-').map(Number);
      if (fy === y && fm === m) mapa.set(fd, f.presente);
    }
    const primeiroDia = new Date(y, m - 1, 1).getDay();
    const diasNoMes = new Date(y, m, 0).getDate();
    const celulas: DiaCal[] = [];
    for (let i = 0; i < primeiroDia; i++) celulas.push({ dia: null, status: 'sem-aula' });
    for (let d = 1; d <= diasNoMes; d++) {
      const presente = mapa.get(d);
      celulas.push({
        dia: d,
        status: presente === undefined ? 'sem-aula' : presente ? 'presente' : 'falta',
      });
    }
    return celulas;
  });

  constructor() {
    effect(() => {
      const dep = this.store.selecionado();
      if (dep) void this.carregar(dep.id);
    });
  }

  private async carregar(alunoId: string): Promise<void> {
    this.frequencias.set(await this.store.getFrequencias(alunoId));
  }
}
