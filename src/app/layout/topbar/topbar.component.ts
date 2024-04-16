import { Component, HostListener, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { AsyncPipe, NgClass } from '@angular/common';
import { RippleModule } from 'primeng/ripple';
import { RouterLink } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [ButtonModule, NgClass, RippleModule, RouterLink, AsyncPipe],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css',
})
export class TopbarComponent {
  private authService = inject(AuthService);

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
}
