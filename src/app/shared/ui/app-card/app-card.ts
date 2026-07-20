import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Card base clean (kimono). Envolve conteúdo com borda discreta e respiros. */
@Component({
  selector: 'app-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app-card.html',
  styleUrl: './app-card.scss',
})
export class AppCard {
  /** Remove o padding interno (para listas/áreas que controlam o próprio espaçamento). */
  readonly flush = input(false);
  /** Realça a borda (ex.: destaque de ação pendente). */
  readonly emphasis = input(false);
}
