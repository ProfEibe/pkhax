import { Component, inject } from '@angular/core';
import { LayoutService } from '../service/layout.service';
import { AppMenu } from './app.menu';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [AppMenu],
  template: `<div class="layout-sidebar bg-surface-card">
    <app-menu></app-menu>
  </div>`,
})
export class AppSidebar {
  layoutService = inject(LayoutService);
}
