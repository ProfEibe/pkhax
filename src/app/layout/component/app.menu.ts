import { Component } from '@angular/core';

import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [AppMenuitem, RouterModule],
  template: `<ul class="layout-menu">
    @for (item of model; track item; let i = $index) {
      @if (!item.separator) {
        <li app-menuitem [item]="item" [index]="i" [root]="true"></li>
      }
      @if (item.separator) {
        <li class="menu-separator"></li>
      }
    }
  </ul>`,
})
export class AppMenu {
  model: MenuItem[] = [
    {
      label: 'Main',
      items: [
        { label: 'Romhack List', icon: 'pi pi-fw pi-list', routerLink: ['/'] },
        { label: 'Add New Hack', icon: 'pi pi-fw pi-plus', routerLink: ['/editor'] },
      ],
    },
    {
      label: 'Account',
      items: [{ label: 'My Profile', icon: 'pi pi-fw pi-user', routerLink: ['/user'] }],
    },
  ];
}
