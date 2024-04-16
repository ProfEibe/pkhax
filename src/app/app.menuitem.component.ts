import {
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { MenuService } from './service/app.menu.service';
import { AppMainComponent } from './app.main.component';
import { NgClass } from '@angular/common';

@Component({
  /* tslint:disable:component-selector */
  selector: '[app-menuitem]',
  /* tslint:enable:component-selector */
  template: `
    <ng-container>
      @if ((!item.routerLink || item.items) && item.visible !== false) {
        <a
          [attr.href]="item.url"
          (click)="itemClick($event)"
          [ngClass]="item.class"
          [attr.target]="item.target"
          [attr.tabindex]="0"
          [attr.aria-label]="item.label"
          role="menuitem"
          pRipple
        >
          <i [ngClass]="item.icon" class="layout-menuitem-icon"></i>
          <span>{{ item.label }}</span>
          @if (item.badge) {
            <span class="menuitem-badge">{{ item.badge }}</span>
          }
          @if (item.items) {
            <i
              class="pi pi-fw {{
                active ? 'pi-angle-up' : 'pi-angle-down'
              }} ml-auto"
            ></i>
          }
        </a>
      }
      @if (item.routerLink && !item.items && item.visible !== false) {
        <a
          (click)="itemClick($event)"
          [ngClass]="item.class"
          [routerLink]="item.routerLink"
          routerLinkActive="active-menuitem-routerlink router-link-exact-active"
          [routerLinkActiveOptions]="{ exact: !item.preventExact }"
          [attr.target]="item.target"
          [attr.tabindex]="0"
          [attr.aria-label]="item.label"
          role="menuitem"
          pRipple
        >
          <i [ngClass]="item.icon" class="layout-menuitem-icon"></i>
          <span>{{ item.label }}</span>
          @if (item.badge) {
            <span class="p-tag p-badge ml-auto">{{ item.badge }}</span>
          }
          @if (item.items) {
            <i
              class="pi pi-fw {{
                active ? 'pi-angle-up' : 'pi-angle-down'
              }} ml-auto"
            ></i>
          }
        </a>
      }
      @if (item.items && active && item.visible !== false) {
        <ul
          [@children]="active ? 'visibleAnimated' : 'hiddenAnimated'"
          role="menu"
        >
          @for (child of item.items; track child; let i = $index) {
            <li
              app-menuitem
              [item]="child"
              [index]="i"
              [parentKey]="key"
              [class]="child.badgeClass"
              role="none"
            ></li>
          }
        </ul>
      }
    </ng-container>
  `,
  host: {
    '[class.active-menuitem]': 'active',
  },
  standalone: true,
  imports: [NgClass, RouterLink, RouterLinkActive],
  animations: [
    trigger('children', [
      state(
        'void',
        style({
          height: '0px',
        }),
      ),
      state(
        'hiddenAnimated',
        style({
          height: '0px',
        }),
      ),
      state(
        'visibleAnimated',
        style({
          height: '*',
        }),
      ),
      transition(
        'visibleAnimated => hiddenAnimated',
        animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'),
      ),
      transition(
        'hiddenAnimated => visibleAnimated',
        animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'),
      ),
      transition(
        'void => visibleAnimated, visibleAnimated => void',
        animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'),
      ),
    ]),
  ],
})
export class AppMenuitemComponent implements OnInit, OnDestroy {
  @Input() item: any;

  @Input() index: number;

  @Input() root: boolean;

  @Input() parentKey: string;

  active = false;

  menuSourceSubscription: Subscription;

  menuResetSubscription: Subscription;

  key: string;

  constructor(
    public app: AppMainComponent,
    public router: Router,
    private cd: ChangeDetectorRef,
    private menuService: MenuService,
  ) {
    this.menuSourceSubscription = this.menuService.menuSource$.subscribe(
      (key) => {
        // deactivate current active menu
        if (this.active && this.key !== key && key.indexOf(this.key) !== 0) {
          this.active = false;
        }
      },
    );

    this.menuResetSubscription = this.menuService.resetSource$.subscribe(() => {
      this.active = false;
    });

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((params) => {
        if (this.item.routerLink) {
          this.updateActiveStateFromRoute();
        } else {
          this.active = false;
        }
      });
  }

  ngOnInit() {
    if (this.item.routerLink) {
      this.updateActiveStateFromRoute();
    }

    this.key = this.parentKey
      ? this.parentKey + '-' + this.index
      : String(this.index);
  }

  updateActiveStateFromRoute() {
    this.active = this.router.isActive(
      this.item.routerLink[0],
      this.item.items ? false : true,
    );
  }

  itemClick(event: Event) {
    event.stopPropagation();
    // avoid processing disabled items
    if (this.item.disabled) {
      event.preventDefault();
      return;
    }

    // notify other items
    this.menuService.onMenuStateChange(this.key);

    // execute command
    if (this.item.command) {
      this.item.command({ originalEvent: event, item: this.item });
    }

    // toggle active state
    if (this.item.items) {
      this.active = !this.active;
    } else {
      // activate item
      this.active = true;

      // hide overlay menus
      this.app.menuActiveMobile = false;

      if (this.app.isDesktop() && this.app.isOverlay()) {
        this.app.menuInactiveDesktop = true;
      }
    }
  }

  ngOnDestroy() {
    if (this.menuSourceSubscription) {
      this.menuSourceSubscription.unsubscribe();
    }

    if (this.menuResetSubscription) {
      this.menuResetSubscription.unsubscribe();
    }
  }
}
