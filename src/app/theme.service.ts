import { DOCUMENT, Injectable, effect, inject, signal } from '@angular/core';

/**
 * Light/dark mode. The initial class on <html> is set by an inline script in index.html
 * (saved choice, otherwise the OS setting) to avoid a flash of the wrong theme.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private root = inject(DOCUMENT).documentElement;

  readonly dark = signal(this.root.classList.contains('app-dark'));

  constructor() {
    effect(() => {
      const dark = this.dark();
      this.root.classList.toggle('app-dark', dark);
      try {
        localStorage.setItem('theme', dark ? 'dark' : 'light');
      } catch {
        // storage unavailable – theme just isn't remembered
      }
    });
  }

  toggle(): void {
    this.dark.update((dark) => !dark);
  }
}
