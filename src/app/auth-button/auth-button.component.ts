import { Component, Inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-auth-button',
  template: `
    <ng-container *ngIf="auth.isAuthenticated$ | async; else loggedOut">
      <p-button (onClick)="auth.logout({ returnTo: document.location.origin })">
        Log out
      </p-button>
    </ng-container>

    <ng-template #loggedOut>
      <p-button (onClick)="auth.loginWithRedirect()">Log in</p-button>
    </ng-template>
  `,
  styles: [],
})
export class AuthButtonComponent {
  constructor(@Inject(DOCUMENT) public document: Document, public auth: AuthService) {}
}
