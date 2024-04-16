import { Component } from '@angular/core';
import { AppMainComponent } from './app.main.component';
import { MenuItem } from 'primeng/api';
import { AuthService } from '@auth0/auth0-angular';
import { AsyncPipe, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthButtonComponent } from './auth-button/auth-button.component';
import { AvatarModule } from 'primeng/avatar';

@Component({
  standalone: true,
  selector: 'app-topbar',
  imports: [NgClass, RouterLink, AuthButtonComponent, AvatarModule, AsyncPipe],
  templateUrl: './app.topbar.component.html',
})
export class AppTopBarComponent {
  items: MenuItem[];

  constructor(
    public appMain: AppMainComponent,
    public auth: AuthService,
  ) {}
}
