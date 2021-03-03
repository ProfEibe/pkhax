import {Component, OnInit} from '@angular/core';
import {PrimeNGConfig} from 'primeng/api';
import {NgcCookieConsentService} from 'ngx-cookieconsent';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit  {
  title = 'pkhax';
  private popupOpenSubscription: Subscription;

  constructor(private primengConfig: PrimeNGConfig, private ccService: NgcCookieConsentService) {}

  ngOnInit(): void {
    this.primengConfig.ripple = true;

    this.popupOpenSubscription = this.ccService.popupOpen$.subscribe(
      () => {
        // you can use this.ccService.getConfig() to do stuff...
      });
  }
}
