import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

/**
 * CTA com área de toque expandida (fat-finger). Primary = Preto (Dan),
 * a mais alta hierarquia de ação.
 */
@Component({
  selector: 'app-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './button.html',
  styleUrl: './button.scss',
})
export class Button {
  readonly variant = input<ButtonVariant>('primary');
  readonly type = input<'button' | 'submit'>('button');
  readonly disabled = input(false);
  readonly block = input(false);
  readonly press = output<void>();

  private readonly variantClasses: Record<ButtonVariant, string> = {
    primary:
      'bg-belt-black text-white hover:bg-belt-black/90 dark:bg-white dark:text-belt-black dark:hover:bg-white/90',
    secondary: 'border border-line bg-surface text-fg hover:bg-surface-muted',
    danger: 'bg-belt-red text-white hover:bg-belt-red/90',
    ghost: 'text-fg hover:bg-surface-muted',
  };

  protected readonly classes = computed(() => this.variantClasses[this.variant()]);

  protected onClick(): void {
    if (!this.disabled()) this.press.emit();
  }
}
