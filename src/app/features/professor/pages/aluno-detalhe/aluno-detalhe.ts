import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProfessorStore } from '../../professor-store';
import { SessionService } from '../../../../core/services/session.service';
import { BeltLineageService } from '../../../../core/services/belt-lineage.service';
import { AppCard, BeltBadge, Button, Icon, ProgressBar, AlertChip, ChipTone } from '../../../../shared/ui';
import { Aluno, CurriculoItem, Ocorrencia } from '../../../../core/models';
import { formatDataBR, hojeISO } from '../../../../shared/util/format';

type TagOcorrencia = Ocorrencia['tag'];

/** Perfil do aluno para o Sensei: avaliação de currículo + diário de bordo. */
@Component({
  selector: 'app-aluno-detalhe',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, RouterLink, AppCard, BeltBadge, Button, Icon, ProgressBar, AlertChip],
  templateUrl: './aluno-detalhe.html',
  styleUrl: './aluno-detalhe.scss',
})
export class AlunoDetalhe {
  private readonly store = inject(ProfessorStore);
  private readonly session = inject(SessionService);
  private readonly lineage = inject(BeltLineageService);

  readonly alunoId = input.required<string>();

  protected readonly aluno = signal<Aluno | null>(null);
  protected readonly novaTag = signal<TagOcorrencia>('destaque');
  protected readonly novoTexto = signal('');

  protected readonly faixa = computed(() => {
    const a = this.aluno();
    return a ? this.lineage.byColor(a.beltColor) : null;
  });
  protected readonly progresso = computed(() => {
    const a = this.aluno();
    return a ? this.lineage.progressPercent(a.beltColor, a.horasAcumuladas) : 0;
  });
  protected readonly grupos = computed(() => {
    const cur = this.aluno()?.curriculo ?? [];
    return [
      { titulo: 'Kihon', itens: cur.filter((c) => c.categoria === 'kihon') },
      { titulo: 'Kata', itens: cur.filter((c) => c.categoria === 'kata') },
      { titulo: 'Kumite', itens: cur.filter((c) => c.categoria === 'kumite') },
    ].filter((g) => g.itens.length);
  });

  protected readonly tags: { valor: TagOcorrencia; label: string; tone: ChipTone }[] = [
    { valor: 'destaque', label: 'Destaque', tone: 'success' },
    { valor: 'disciplina', label: 'Disciplina', tone: 'warning' },
    { valor: 'lesao', label: 'Lesão', tone: 'danger' },
    { valor: 'observacao', label: 'Observação', tone: 'info' },
  ];

  protected readonly formatData = formatDataBR;

  constructor() {
    effect(() => {
      const id = this.alunoId();
      if (id) void this.carregar(id);
    });
  }

  private async carregar(id: string): Promise<void> {
    this.aluno.set(await this.store.getAlunoById(id));
  }

  protected async toggleItem(item: CurriculoItem): Promise<void> {
    const atualizado = { ...item, dominado: !item.dominado };
    await this.store.toggleCurriculo(this.alunoId(), atualizado);
    this.aluno.update((a) =>
      a ? { ...a, curriculo: a.curriculo.map((c) => (c.id === item.id ? atualizado : c)) } : a,
    );
  }

  protected tagTone(tag: TagOcorrencia): ChipTone {
    return this.tags.find((t) => t.valor === tag)?.tone ?? 'neutral';
  }
  protected tagLabel(tag: TagOcorrencia): string {
    return this.tags.find((t) => t.valor === tag)?.label ?? tag;
  }

  protected async registrarOcorrencia(): Promise<void> {
    const texto = this.novoTexto().trim();
    if (!texto) return;
    const ocorrencia: Ocorrencia = {
      id: `o-${new Date().getTime()}`,
      data: hojeISO(),
      autorNome: this.session.currentUser().nome,
      tag: this.novaTag(),
      texto,
    };
    await this.store.addOcorrencia(this.alunoId(), ocorrencia);
    this.aluno.update((a) => (a ? { ...a, ocorrencias: [ocorrencia, ...a.ocorrencias] } : a));
    this.novoTexto.set('');
  }
}
