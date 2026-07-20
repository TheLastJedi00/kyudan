import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NavItem } from '../../../layout/nav-config';
import { Icon } from '../icon/icon';

/** Navegação inferior mobile com áreas de toque expandidas (>=48dp). */
@Component({
  selector: 'app-bottom-nav',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, Icon],
  templateUrl: './bottom-nav.html',
  styleUrl: './bottom-nav.scss',
})
export class BottomNav {
  readonly items = input.required<NavItem[]>();

  /** Rotas de "home" (2 segmentos) casam exato para não ficarem sempre ativas. */
  protected exact(path: string): boolean {
    return path.split('/').length <= 2;
  }
}
