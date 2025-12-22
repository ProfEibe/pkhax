import { Component, Inject, DOCUMENT, inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-auth-button',
  template: `
    @if (auth.isAuthenticated$ | async) {
      <button
        type="button"
        class="layout-topbar-action"
        (click)="auth.logout({ logoutParams: { returnTo: document.location.origin } })"
      >
        <i class="pi pi-sign-out"></i>
        <span>Log out</span>
      </button>
    } @else {
      <button type="button" class="layout-topbar-action" (click)="auth.loginWithRedirect()">
        <i class="pi pi-sign-in"></i>
        <span>Log in</span>
      </button>
    }
  `,
  styles: [],
  standalone: true,
  imports: [AsyncPipe],
})
export class AuthButtonComponent {
  public document = inject(DOCUMENT);
  public auth = inject(AuthService);
}
