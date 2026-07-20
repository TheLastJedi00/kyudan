import { Injectable, PLATFORM_ID, effect, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type ThemeMode = 'light' | 'dark';

const STORAGE_KEY = 'kyudan-theme';

/** Controla o tema (light padrão / dark nativo) com persistência local. */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  readonly mode = signal<ThemeMode>(this.initialMode());

  constructor() {
    // Reflete o tema no <html> sempre que mudar (apenas no browser).
    effect(() => {
      const mode = this.mode();
      if (!this.isBrowser) return;
      document.documentElement.classList.toggle('dark', mode === 'dark');
      localStorage.setItem(STORAGE_KEY, mode);
    });
  }

  toggle(): void {
    this.mode.update((m) => (m === 'dark' ? 'light' : 'dark'));
  }

  set(mode: ThemeMode): void {
    this.mode.set(mode);
  }

  private initialMode(): ThemeMode {
    if (!this.isBrowser) return 'light';
    const saved = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
}
