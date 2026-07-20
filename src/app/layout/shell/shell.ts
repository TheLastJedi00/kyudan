import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { SessionService } from '../../core/services/session.service';
import { ThemeService } from '../../core/services/theme.service';
import { NAV_CONFIG, ROLE_LABEL } from '../nav-config';
import { Icon } from '../../shared/ui/icon/icon';

/**
 * Casca (app shell) mobile-first: header com troca de persona e tema,
 * área de conteúdo roteada e navegação inferior adaptada à role ativa.
 */
@Component({
  selector: 'app-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Icon],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
})
export class Shell {
  private readonly router = inject(Router);
  protected readonly session = inject(SessionService);
  protected readonly theme = inject(ThemeService);

  protected readonly roleLabel = computed(() => ROLE_LABEL[this.session.role()]);
  protected readonly navItems = computed(() => NAV_CONFIG[this.session.role()]);

  protected onPersonaChange(userId: string): void {
    this.session.switchTo(userId);
    // Leva para a home da nova role.
    const home = NAV_CONFIG[this.session.role()][0]?.path ?? '/';
    this.router.navigateByUrl(home);
  }
}
