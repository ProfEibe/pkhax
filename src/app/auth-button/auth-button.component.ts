import { Component, Inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { AsyncPipe, DOCUMENT } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-auth-button',
  template: `
    @if (auth.isAuthenticated$ | async) {
      <a
        (click)="
          auth.logout({ logoutParams: { returnTo: document.location.origin } })
        "
        class="p-link layout-topbar-button"
      >
        <i class="pi pi-sign-out"></i>
        <span>Log out</span>
      </a>
    } @else {
      <a (click)="auth.loginWithRedirect()" class="p-link layout-topbar-button">
        <i class="pi pi-sign-in"></i>
        <span>Log in</span>
      </a>
    }
  `,
  styles: [],
  standalone: true,
  imports: [ButtonModule, AsyncPipe],
})
export class AuthButtonComponent {
  constructor(
    @Inject(DOCUMENT) public document: Document,
    public auth: AuthService,
  ) {}
}
