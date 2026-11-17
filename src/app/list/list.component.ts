import { Component, HostListener, OnInit, inject, signal, viewChild } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { GameService } from '../game.service';
import { Router } from '@angular/router';
import { Table, TableModule } from '@openng/optimus-ui/table';
import { Baserom, Choice, Difficulty, Game } from '../game';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { FilterService, SortEvent } from '@openng/optimus-ui/api';
import { MultiSelect } from '@openng/optimus-ui/multiselect';
import { Select } from '@openng/optimus-ui/select';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from '@openng/optimus-ui/button';
import { RippleModule } from '@openng/optimus-ui/ripple';
import { RatingModule } from '@openng/optimus-ui/rating';
import { ContextMenuModule } from '@openng/optimus-ui/contextmenu';
import { InputTextModule } from '@openng/optimus-ui/inputtext';
import { TagModule } from '@openng/optimus-ui/tag';
import { ToolbarModule } from '@openng/optimus-ui/toolbar';
import { IconFieldModule } from '@openng/optimus-ui/iconfield';
import { InputIconModule } from '@openng/optimus-ui/inputicon';
import { SkeletonModule } from '@openng/optimus-ui/skeleton';

interface Column {
  field: keyof Game & string;
  header: string;
}

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  imports: [
    TableModule,
    MultiSelect,
    Select,
    FormsModule,
    ButtonModule,
    RippleModule,
    RatingModule,
    ContextMenuModule,
    InputTextModule,
    TagModule,
    ToolbarModule,
    IconFieldModule,
    InputIconModule,
    SkeletonModule,
    DecimalPipe,
  ],
})
export class ListComponent implements OnInit {
  cols: Column[] = [];
  games = signal<Game[]>([]);
  selectedGame: Game;
  baseroms = signal<Baserom[]>([]);
  stories = signal<Choice[]>([]);
  fakemon = signal<Choice[]>([]);
  status = signal<Choice[]>([]);
  difficulties = signal<Difficulty[]>([]);
  baseUrl = environment.baseUrl;
  innerWidth = 0;
  dt = viewChild<Table>('dt');
  mobileFilter = false;
  loading = signal<boolean>(false);

  contextMenuItems = [
    {
      label: 'Open in new tab',
      icon: 'pi pi-fw pi-clone',
      command: () => window.open('/' + this.selectedGame.id, '_blank'),
    },
    {
      label: 'Editor',
      icon: 'pi pi-fw pi-pencil',
      command: () => this.router.navigate(['/editor/' + this.selectedGame.id]),
    },
  ];

  @HostListener('window:resize')
  onResize(): void {
    this.innerWidth = window.innerWidth;
    this.setColumns();
  }

  private gameService = inject(GameService);
  private router = inject(Router);
  private filterService = inject(FilterService);
  private http = inject(HttpClient);

  selectedColumns = signal<Column[]>([]);

  ngOnInit(): void {
    this.loading.set(true);
    this.gameService.getGames().subscribe({
      next: (games) => {
        this.games.set(games);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('ListComponent: Error loading games', err);
        this.loading.set(false);
      },
    });

    this.filterService.register('isInBaserom', (value: Baserom[], filter: Baserom[]): boolean => {
      if (filter === undefined || filter === null) {
        return true;
      }
      if (value === undefined || value === null) {
        return false;
      }
      return filter.some((f) => value.some((v) => v.id === f.id));
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
      { field: 'title', header: 'Name' },
      { field: 'base', header: 'Baserom' },
      { field: 'creator', header: 'Creator' },
      { field: 'version', header: 'Version' },
      { field: 'story', header: 'Story' },
      { field: 'newGraphics', header: 'new Graphics' },
      { field: 'catchable', header: 'Catchable' },
      { field: 'fakemon', header: 'Fakemon' },
      { field: 'physicalSpecialSplit', header: 'p/s-Split' },
      { field: 'builtInRandomizer', header: 'built-in Randomizer' },
      { field: 'builtInNuzlocke', header: 'built-in Nuzlocke' },
      { field: 'status', header: 'Status' },
      { field: 'difficulty', header: 'Difficulty' },
      { field: 'rating', header: 'Rating' },
    ];

    this.innerWidth = window.innerWidth;
    this.setColumns();

    this.http.get<Baserom[]>(this.baseUrl + '/baseroms/').subscribe((baseroms) => this.baseroms.set(baseroms));
    this.http.get<Choice[]>(this.baseUrl + '/stories/').subscribe((stories) => this.stories.set(stories));
    this.http.get<Choice[]>(this.baseUrl + '/status/').subscribe((status) => this.status.set(status));
    this.http.get<Choice[]>(this.baseUrl + '/fakemon/').subscribe((fakemon) => this.fakemon.set(fakemon));
    this.http
      .get<Difficulty[]>(this.baseUrl + '/difficulties/')
      .subscribe((difficulties) => this.difficulties.set(difficulties));
  }

  onRowSelect(): void {
    this.router.navigate(['/' + this.selectedGame.id]);
  }

  private setColumns(): void {
    if (this.innerWidth > 640) {
      this.selectedColumns.set([
        this.cols[0],
        this.cols[1],
        this.cols[4],
        this.cols[6],
        this.cols[7],
        this.cols[8],
        this.cols[11],
        this.cols[12],
        this.cols[13],
      ]);
    } else {
      this.selectedColumns.set([this.cols[0], this.cols[1], this.cols[11]]);
    }
  }

  inputFilter($event: Event, field: string, matchMode: string): void {
    const table = this.dt();
    if (table) {
      table.filter(($event.target as HTMLInputElement).value, field, matchMode);
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

      for (const game of event.data as Game[]) {
        if (game.rating.length === 0) continue;
        avgs += game.avgRating;
        count++;
      }

      avgs /= count;

      const m = 5;

      for (const game of event.data as Game[]) {
        if (game.rating.length === 0) continue;
        game.ranking = (game.avgRating * game.rating.length + avgs * m) / (game.rating.length + m);
      }

      event.field = 'ranking';
    }
    event.data.sort((data1, data2) => {
      if (!event.field || !event.order) return 0;
      const value1 = data1[event.field];
      const value2 = data2[event.field];
      let result = null;

      if (value1 == null && value2 != null) result = -1;
      else if (value1 != null && value2 == null) result = 1;
      else if (value1 == null && value2 == null) result = 0;
      else if (typeof value1 === 'string' && typeof value2 === 'string') result = value1.localeCompare(value2);
      else result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;

      return event.order * result;
    });
  }

  updateSelectedColumns(val: Column[]) {
    // restore original order
    const sorted = this.cols.filter((col) => val.includes(col));
    this.selectedColumns.set(sorted);
  }
}
