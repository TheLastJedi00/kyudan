import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';

/**
 * Ícone SVG inline (stroke, herda currentColor). Conjunto mínimo usado na navegação
 * e nos cards. Mantém o bundle leve sem dependência de biblioteca de ícones.
 * Exceção deliberada à regra de 3 arquivos: primitivo puramente apresentacional.
 */
@Component({
  selector: 'app-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgSwitch, NgSwitchCase, NgSwitchDefault],
  template: `
    <svg
      [attr.width]="size()"
      [attr.height]="size()"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <ng-container [ngSwitch]="name()">
        <path *ngSwitchCase="'path'" d="M4 18 L10 6 L14 14 L20 4" />
        <g *ngSwitchCase="'trophy'">
          <path d="M8 4h8v4a4 4 0 0 1-8 0V4Z" />
          <path d="M8 6H5a3 3 0 0 0 3 3M16 6h3a3 3 0 0 1-3 3M10 12v3M14 12v3M8 20h8M9 20l1-2h4l1 2" />
        </g>
        <g *ngSwitchCase="'card'">
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M3 10h18M7 15h4" />
        </g>
        <g *ngSwitchCase="'wallet'">
          <rect x="3" y="6" width="18" height="13" rx="2" />
          <path d="M3 10h13a2 2 0 0 1 0 4H3M16 12h.01" />
        </g>
        <g *ngSwitchCase="'tatame'">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
        </g>
        <path *ngSwitchCase="'check'" d="M4 12l5 5L20 6" />
        <g *ngSwitchCase="'home'">
          <path d="M4 11l8-7 8 7" />
          <path d="M6 10v9h12v-9" />
        </g>
        <g *ngSwitchCase="'doc'">
          <path d="M6 3h8l4 4v14H6Z" />
          <path d="M14 3v4h4M9 13h6M9 17h6" />
        </g>
        <g *ngSwitchCase="'calendar'">
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M3 9h18M8 3v4M16 3v4" />
        </g>
        <g *ngSwitchCase="'grid'">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </g>
        <g *ngSwitchCase="'pin'">
          <path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Z" />
          <circle cx="12" cy="10" r="2.5" />
        </g>
        <g *ngSwitchCase="'shield'">
          <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6Z" />
          <path d="M9 12l2 2 4-4" />
        </g>
        <g *ngSwitchCase="'search'">
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4-4" />
        </g>
        <g *ngSwitchCase="'sun'">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19" />
        </g>
        <path *ngSwitchCase="'moon'" d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
        <g *ngSwitchCase="'users'">
          <circle cx="9" cy="8" r="3" />
          <path d="M3 20a6 6 0 0 1 12 0M16 5a3 3 0 0 1 0 6M18 20a6 6 0 0 0-3-5.2" />
        </g>
        <g *ngSwitchCase="'alert'">
          <path d="M12 3l9 16H3Z" />
          <path d="M12 10v4M12 17h.01" />
        </g>
        <path *ngSwitchCase="'chevron'" d="M9 6l6 6-6 6" />
        <path *ngSwitchDefault d="M12 5v14M5 12h14" />
      </ng-container>
    </svg>
  `,
})
export class Icon {
  readonly name = input.required<string>();
  readonly size = input(22);
}
