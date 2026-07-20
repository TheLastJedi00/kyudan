import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ResponsavelStore } from '../../responsavel-store';
import { DependenteSelector } from '../../components/dependente-selector/dependente-selector';
import { AppCard, Button, Icon } from '../../../../shared/ui';

interface Termo {
  id: string;
  titulo: string;
  descricao: string;
}

/** Termos de aceite digital e envio de documentos do dependente. */
@Component({
  selector: 'app-autorizacoes',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DependenteSelector, AppCard, Button, Icon],
  templateUrl: './autorizacoes.html',
  styleUrl: './autorizacoes.scss',
})
export class Autorizacoes {
  protected readonly store = inject(ResponsavelStore);

  protected readonly termos: Termo[] = [
    { id: 'viagem', titulo: 'Autorização de viagem', descricao: 'Competições estaduais e regionais (JASC, OLESC).' },
    { id: 'imagem', titulo: 'Uso de imagem', descricao: 'Fotos e vídeos em treinos e eventos da ABK.' },
    { id: 'medico', titulo: 'Isenção de responsabilidade médica', descricao: 'Declaração de aptidão física para a prática.' },
  ];

  protected readonly assinados = signal<Set<string>>(new Set());
  protected readonly docEnviado = signal<string | null>(null);

  protected assinar(id: string): void {
    this.assinados.update((s) => new Set(s).add(id));
  }

  protected onArquivo(event: Event): void {
    const input = event.target as HTMLInputElement;
    const nome = input.files?.[0]?.name ?? null;
    if (nome) this.docEnviado.set(nome);
  }
}
