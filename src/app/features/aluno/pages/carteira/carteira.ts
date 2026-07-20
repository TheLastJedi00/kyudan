import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AlunoStore } from '../../aluno-store';
import { AppCard, DigitalCard } from '../../../../shared/ui';

/** Carteira digital de filiação do aluno. */
@Component({
  selector: 'app-carteira',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppCard, DigitalCard],
  templateUrl: './carteira.html',
  styleUrl: './carteira.scss',
})
export class Carteira {
  protected readonly aluno = inject(AlunoStore).aluno;
}
