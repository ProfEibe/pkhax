import { Component, DOCUMENT, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { MenuItem } from '@openng/optimus-ui/api';
import { ButtonModule } from '@openng/optimus-ui/button';
import { MenuModule } from '@openng/optimus-ui/menu';
import { ThemeService } from '../theme.service';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ButtonModule, MenuModule],
  templateUrl: './shell.component.html',
})
export class ShellComponent {
  private document = inject(DOCUMENT);
  protected auth = inject(AuthService);
  protected theme = inject(ThemeService);

  protected user = toSignal(this.auth.user$);
  protected loading = toSignal(this.auth.isLoading$, { initialValue: true });

  protected accountMenu: MenuItem[] = [
    { label: 'Profile', icon: 'pi pi-user', routerLink: '/user' },
    { label: 'Submit a hack', icon: 'pi pi-plus', routerLink: '/editor' },
    { separator: true },
    {
      label: 'Log out',
      icon: 'pi pi-sign-out',
      command: () => this.auth.logout({ logoutParams: { returnTo: this.document.location.origin } }),
    },
  ];

  protected login(): void {
    this.auth.loginWithRedirect();
  }
}
