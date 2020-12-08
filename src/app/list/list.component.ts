import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {GameService} from '../game.service';
import {Router} from '@angular/router';
import {Table} from 'primeng/table';
import {GlobalFilterService} from '../global-filter.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  @ViewChild('dt', {static: false}) private dt: Table | undefined;

  cols: any[] = [];

  _selectedColumns: any[] = [];

  games = [];
  selectedGame: any;

  constructor(private gameService: GameService, private router: Router, private filterService: GlobalFilterService) {
  }

  ngOnInit(): void {
    this.gameService.getGames().subscribe(games => this.games = games);
    this.filterService.filter$.subscribe(filter => {
      if (this.dt) {
        this.dt.filterGlobal(filter, 'contains');
      }
    });

    this.cols = [
      {field: 'title', header: 'Name'},
      {field: 'base', header: 'Baserom'},
      {field: 'creator', header: 'Creator'},
      {field: 'version', header: 'Version'},
      {field: 'newStory', header: 'new Story'},
      {field: 'newGraphics', header: 'new Graphics'},
      {field: 'catchable', header: 'Catchable'},
      {field: 'fakemon', header: 'Fakemon'},
      {field: 'physicalSpecialSplit', header: 'physical/special-Split'},
      {field: 'builtinRandomzier', header: 'built-in Randomizer'},
      {field: 'builtinNuzlocke', header: 'built-in Nuzlocke'},
      {field: 'difficulty', header: 'Difficulty'},
      {field: 'rating', header: 'Rating'},
    ];

    this._selectedColumns = this.cols;
  }

  onRowSelect($event: any): void {
    this.router.navigate(['/' + this.selectedGame.id]);
  }

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    // restore original order
    this._selectedColumns = this.cols.filter(col => val.includes(col));
  }

  inputFilter($event: Event, field: string, matchMode: string): void {
    if (this.dt) {
      this.dt.filter(($event.target as HTMLInputElement).value, field, matchMode);
    }
  }
}
