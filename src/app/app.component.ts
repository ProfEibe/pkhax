import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import {
  NgcCookieConsentConfig,
  NgcCookieConsentService,
  WindowService,
} from 'ngx-cookieconsent';
import { RouterOutlet } from '@angular/router';
import { TopbarComponent } from './layout/topbar/topbar.component';
import { FooterComponent } from './layout/footer/footer.component';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    RouterOutlet,
    TopbarComponent,
    FooterComponent,
    ToastModule,
    ConfirmDialogModule,
  ],
  providers: [
    NgcCookieConsentService,
    WindowService,
    NgcCookieConsentConfig,
    MessageService,
    ConfirmationService,
  ],
})
export class AppComponent {}
