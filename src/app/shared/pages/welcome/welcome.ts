import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { SessionService } from '../../../core/services/session.service';
import { ROLE_LABEL } from '../../../layout/nav-config';

/** Página temporária de fundação — substituída pelas telas reais nas fases de role. */
@Component({
  selector: 'app-welcome',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './welcome.html',
  styleUrl: './welcome.scss',
})
export class Welcome {
  private readonly session = inject(SessionService);
  protected readonly roleLabel = computed(() => ROLE_LABEL[this.session.role()]);
  protected readonly nome = computed(() => this.session.currentUser().nome);
}
