import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {GameService} from '../game.service';
import {Router} from '@angular/router';
import {Table} from 'primeng/table';
import {GlobalFilterService} from '../global-filter.service';
import {Baserom, Choice, Game} from '../game';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {FilterService} from 'primeng/api';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  cols: any[] = [];
  games: Game[] = [];
  selectedGame: Game;
  baseroms: Baserom[];
  stories: Choice[];
  status: Choice[];
  baseUrl = environment.baseUrl;
  @ViewChild('dt', {static: false}) private dt: Table | undefined;

  constructor(private gameService: GameService,
              private router: Router,
              private globalFilterService: GlobalFilterService,
              private filterService: FilterService,
              private http: HttpClient) {
  }

  // tslint:disable-next-line:variable-name
  _selectedColumns: any[] = [];

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    // restore original order
    const asdf = this.cols.filter(col => val.includes(col));
    console.log(asdf);
    this._selectedColumns = asdf;
  }

  ngOnInit(): void {
    this.gameService.getGames().subscribe(games => this.games = games);
    this.globalFilterService.filter$.subscribe(filter => {
      if (this.dt) {
        this.dt.filterGlobal(filter, 'contains');
      }
    });

    this.filterService.register('isInBaserom', (value: Baserom[], filter: Baserom[]): boolean => {
      if (filter === undefined || filter === null) {
        return true;
      }
      if (value === undefined || value === null) {
        return false;
      }
      return filter.some(f => value.some(v => v.id === f.id));
    });

    this.filterService.register('isChoice', (value: Choice, filter: Choice): boolean => {
      if (filter === undefined || filter === null) {
        return true;
      }
      if (value === undefined || value === null) {
        return false;
      }
      return value.id === filter.id;
    });

    this.cols = [
      {field: 'title', header: 'Name'},
      {field: 'base', header: 'Baserom'},
      {field: 'creator', header: 'Creator'},
      {field: 'version', header: 'Version'},
      {field: 'story', header: 'Story'},
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

    this.http.get<Baserom[]>(this.baseUrl + '/baseroms/').subscribe(baseroms => this.baseroms = baseroms);
    this.http.get<Choice[]>(this.baseUrl + '/stories/').subscribe(stories => this.stories = stories);
    this.http.get<Choice[]>(this.baseUrl + '/status/').subscribe(status => this.status = status);
  }

  onRowSelect($event: any): void {
    this.router.navigate(['/' + this.selectedGame.id]);
  }

  inputFilter($event: Event, field: string, matchMode: string): void {
    if (this.dt) {
      this.dt.filter(($event.target as HTMLInputElement).value, field, matchMode);
    }
  }
}
