import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MenuItem } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { LayoutService } from '../service/layout.service';
import { AuthButtonComponent } from '../../auth-button/auth-button.component';
import { Avatar } from 'primeng/avatar';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [RouterModule, CommonModule, StyleClassModule, AuthButtonComponent, Avatar],
  template: ` <div class="layout-topbar bg-surface-card">
    <div class="layout-topbar-logo-container">
      <button class="layout-menu-button layout-topbar-action" (click)="layoutService.onMenuToggle()">
        <i class="pi pi-bars"></i>
      </button>
      <a class="layout-topbar-logo" routerLink="/">
        <img
          [src]="
            layoutService.isDarkTheme() ? 'assets/layout/images/logo-white.svg' : 'assets/layout/images/logo-dark.svg'
          "
          alt="PkHax Logo"
          style="height: 40px"
        />
        <span>PkHax</span>
      </a>
    </div>

    <div class="layout-topbar-actions">
      <div class="layout-config-menu">
        <button type="button" class="layout-topbar-action" (click)="toggleDarkMode()">
          <i
            [ngClass]="{ 'pi ': true, 'pi-moon': layoutService.isDarkTheme(), 'pi-sun': !layoutService.isDarkTheme() }"
          ></i>
        </button>
      </div>

      <button
        class="layout-topbar-menu-button layout-topbar-action"
        pStyleClass="@next"
        enterFromClass="hidden"
        enterActiveClass="animate-scalein"
        leaveToClass="hidden"
        leaveActiveClass="animate-fadeout"
        [hideOnOutsideClick]="true"
      >
        <i class="pi pi-ellipsis-v"></i>
      </button>

      <div class="layout-topbar-menu hidden lg:block">
        <div class="layout-topbar-menu-content">
          <button [routerLink]="['editor']" type="button" class="layout-topbar-action">
            <i class="pi pi-plus"></i>
            <span>New Entry</span>
          </button>
          <app-auth-button></app-auth-button>
          @if (auth.user$ | async; as user) {
            <p-avatar
              [image]="imageSrc"
              styleClass="ml-2 cursor-pointer"
              shape="circle"
              [routerLink]="['user']"
            ></p-avatar>
          }
        </div>
      </div>
    </div>
  </div>`,
})
export class AppTopbar {
  layoutService = inject(LayoutService);

  items!: MenuItem[];
  protected auth = inject(AuthService);

  protected imageSrc = '';

  constructor() {
    this.auth.user$.pipe(takeUntilDestroyed()).subscribe((user) => {
      this.imageSrc = user?.picture ?? '';
    });
  }

  toggleDarkMode() {
    this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
  }
}
