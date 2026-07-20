import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { SessionService } from '../../core/services/session.service';
import { NAV_CONFIG, ROLE_LABEL } from '../nav-config';
import { ThemeToggle } from '../../shared/ui/theme-toggle/theme-toggle';
import { BottomNav } from '../../shared/ui/bottom-nav/bottom-nav';

/**
 * Casca (app shell) mobile-first: header com troca de persona e tema,
 * área de conteúdo roteada e navegação inferior adaptada à role ativa.
 */
@Component({
  selector: 'app-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, ThemeToggle, BottomNav],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
})
export class Shell {
  private readonly router = inject(Router);
  protected readonly session = inject(SessionService);

  protected readonly roleLabel = computed(() => ROLE_LABEL[this.session.role()]);
  protected readonly navItems = computed(() => NAV_CONFIG[this.session.role()]);

  protected onPersonaChange(userId: string): void {
    this.session.switchTo(userId);
    const home = NAV_CONFIG[this.session.role()][0]?.path ?? '/';
    this.router.navigateByUrl(home);
  }
}
