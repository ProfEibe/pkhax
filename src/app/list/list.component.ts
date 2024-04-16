import {Component, HostListener, Input, OnInit, ViewChild} from '@angular/core';
import {GameService} from '../game.service';
import {Router} from '@angular/router';
import {Table} from 'primeng/table';
import {GlobalFilterService} from '../global-filter.service';
import {Baserom, Choice, Difficulty, Game} from '../game';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {FilterService, SortEvent} from 'primeng/api';

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
  fakemon: Choice[];
  status: Choice[];
  difficulties: Difficulty[];
  baseUrl = environment.baseUrl;
  innerWidth = 0;
  @ViewChild('dt', {static: false}) private dt: Table | undefined;
  mobileFilter = false;
  loading = false;

  contextMenuItems = [
    {label: 'Open in new tab', icon: 'pi pi-fw pi-clone', command: () => window.open('/' + this.selectedGame.id, '_blank')},
    {label: 'Editor', icon: 'pi pi-fw pi-pencil', command: () => this.router.navigate(['/editor/' + this.selectedGame.id])}
  ];

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.innerWidth = event.target.innerWidth;
  }

  constructor(private gameService: GameService,
              private router: Router,
              private globalFilterService: GlobalFilterService,
              private filterService: FilterService,
              private http: HttpClient) {
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
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
    this.loading = true;
    this.gameService.getGames().subscribe(games => {
      this.games = games;
      this.loading = false;
    });
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

    this.innerWidth = window.innerWidth;
    if (this.innerWidth > 640) {
      this.selectedColumns = [
        this.cols[0],
        this.cols[1],
        this.cols[4],
        this.cols[6],
        this.cols[7],
        this.cols[8],
        this.cols[11],
        this.cols[12],
        this.cols[13],
      ];
    } else {
      this.selectedColumns = [
        this.cols[0],
        this.cols[1],
        this.cols[11],
      ];
    }

    this.http.get<Baserom[]>(this.baseUrl + '/baseroms/').subscribe(baseroms => this.baseroms = baseroms);
    this.http.get<Choice[]>(this.baseUrl + '/stories/').subscribe(stories => this.stories = stories);
    this.http.get<Choice[]>(this.baseUrl + '/status/').subscribe(status => this.status = status);
    this.http.get<Choice[]>(this.baseUrl + '/fakemon/').subscribe(fakemon => this.fakemon = fakemon);
    this.http.get<Difficulty[]>(this.baseUrl + '/difficulties/').subscribe(difficulties => this.difficulties = difficulties);
  }

  onRowSelect($event: any): void {
    this.router.navigate(['/' + this.selectedGame.id]);
  }

  onAuxClick($event: any): void {
    $event.preventDefault();
    console.log($event);
    window.open('/' + this.selectedGame.id, '_blank');
  }

  inputFilter($event: Event, field: string, matchMode: string): void {
    if (this.dt) {
      this.dt.filter(($event.target as HTMLInputElement).value, field, matchMode);
    }
  }

  toggleFilter(): void {
    this.mobileFilter = !this.mobileFilter;
  }

  customSort(event: SortEvent) {
    if (!event.data) return;
    if (event.field === 'rating') {
      let avgs = 0;
      let count = 0;

      for (let game of event.data as Game[]) {
        if (game.rating.length === 0) continue;
        avgs += game.avgRating;
        count++;
      }

      avgs /= count;

      let m = 5;

      for (let game of event.data as Game[]) {
        if (game.rating.length === 0) continue;
        game.ranking = (game.avgRating * game.rating.length + avgs * m) / (game.rating.length + m);
      }

      event.field = 'ranking';

    }
    event.data.sort((data1, data2) => {
      if (!event.field || !event.order) return 0;
      let value1 = data1[event.field];
      let value2 = data2[event.field];
      let result = null;

      if (value1 == null && value2 != null)
        result = -1;
      else if (value1 != null && value2 == null)
        result = 1;
      else if (value1 == null && value2 == null)
        result = 0;
      else if (typeof value1 === 'string' && typeof value2 === 'string')
        result = value1.localeCompare(value2);
      else
        result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;

      return (event.order * result);
    });
  }
}
