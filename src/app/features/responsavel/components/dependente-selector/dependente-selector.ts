import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ResponsavelStore } from '../../responsavel-store';
import { BELT_HEX } from '../../../../shared/ui';

/** Seletor de dependentes (Family View) — alterna o perfil ativo. */
@Component({
  selector: 'app-dependente-selector',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dependente-selector.html',
  styleUrl: './dependente-selector.scss',
})
export class DependenteSelector {
  protected readonly store = inject(ResponsavelStore);

  protected inicial(nome: string): string {
    return nome.charAt(0).toUpperCase();
  }
  protected cor(color: string): string {
    return BELT_HEX[color as keyof typeof BELT_HEX] ?? BELT_HEX.black;
  }
}
