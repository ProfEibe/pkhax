import { Component, OnInit } from '@angular/core';
import {GlobalFilterService} from '../global-filter.service';
import {AuthService} from '@auth0/auth0-angular';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {

  constructor(private filterService: GlobalFilterService, public auth: AuthService) { }

  ngOnInit(): void {}

  callFilter($event: Event): void {
    this.filterService.addFilter(($event.target as HTMLInputElement).value);
  }
}
