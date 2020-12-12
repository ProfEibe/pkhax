import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {GameService} from '../game.service';
import {Router} from '@angular/router';
import {Table} from 'primeng/table';
import {GlobalFilterService} from '../global-filter.service';
import {Game} from '../game';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  @ViewChild('dt', {static: false}) private dt: Table | undefined;

  cols: any[] = [];

  // tslint:disable-next-line:variable-name
  _selectedColumns: any[] = [];

  games: Game[] = [];
  selectedGame: Game;

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
      {field: 'original', header: 'Original'},
      {field: 'newGraphics', header: 'new Graphics'},
      {field: 'catchable', header: 'Catchable'},
      {field: 'fakemon', header: 'Fakemon'},
      {field: 'physicalSpecialSplit', header: 'physical/special-Split'},
      {field: 'builtInRandomizer', header: 'built-in Randomizer'},
      {field: 'builtInNuzlocke', header: 'built-in Nuzlocke'},
      {field: 'status', header: 'Status'},
      {field: 'difficulty', header: 'Difficulty'},
      {field: 'rating', header: 'Rating'},
    ];


    this.selectedColumns = [
      this.cols[0],
      this.cols[1],
      this.cols[4],
      this.cols[6],
      this.cols[7],
      this.cols[8],
      this.cols[11],
      this.cols[12],
    ];
  }

  onRowSelect($event: any): void {
    this.router.navigate(['/' + this.selectedGame.id]);
  }

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    // restore original order
    const asdf = this.cols.filter(col => val.includes(col));
    console.log(asdf);
    this._selectedColumns = asdf;
  }

  inputFilter($event: Event, field: string, matchMode: string): void {
    if (this.dt) {
      this.dt.filter(($event.target as HTMLInputElement).value, field, matchMode);
    }
  }
}
