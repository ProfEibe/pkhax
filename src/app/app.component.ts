import { Component } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import {
  NgcCookieConsentConfig,
  NgcCookieConsentService,
  WindowService,
} from 'ngx-cookieconsent';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [RouterOutlet],
  standalone: true,
  providers: [NgcCookieConsentService, WindowService, NgcCookieConsentConfig],
})
export class AppComponent {
  menuMode = 'overlay';

  constructor(private primengConfig: PrimeNGConfig) {}

  ngOnInit() {
    this.primengConfig.ripple = true;
    document.documentElement.style.fontSize = '14px';
  }
}
