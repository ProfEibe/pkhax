import { Component, OnInit } from '@angular/core';
import {GlobalFilterService} from '../global-filter.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {

  constructor(private filterService: GlobalFilterService) { }

  ngOnInit(): void {
  }

  callFilter($event: Event): void {
    this.filterService.addFilter(($event.target as HTMLInputElement).value);
  }
}
