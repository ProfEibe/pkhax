import { Component, HostListener, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { AsyncPipe, NgClass } from '@angular/common';
import { RippleModule } from 'primeng/ripple';
import { RouterLink } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';

import { LayoutService } from '../service/layout.service';

@Component({
  selector: 'app-topbar',
  imports: [ButtonModule, NgClass, RippleModule, RouterLink, AsyncPipe],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css'
})
export class TopbarComponent {
  private authService = inject(AuthService);
  protected layoutService = inject(LayoutService);

  scrolled: boolean = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.scrolled = window.scrollY > 0;
  }

  logout() {
    this.authService.logout();
  }

  isLoggedIn() {
    return this.authService.isAuthenticated$;
  }

  toggleTheme() {
    this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
  }
}
