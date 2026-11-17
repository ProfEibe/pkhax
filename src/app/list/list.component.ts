import { Component, OnInit, inject, signal } from '@angular/core';
import { DecimalPipe, NgTemplateOutlet } from '@angular/common';
import { GameService } from '../game.service';
import { Router, RouterLink } from '@angular/router';
import { TableModule } from '@openng/optimus-ui/table';
import { Baserom, Choice, Difficulty, Game } from '../game';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { FilterService, SortEvent } from '@openng/optimus-ui/api';
import { MultiSelect } from '@openng/optimus-ui/multiselect';
import { Select } from '@openng/optimus-ui/select';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from '@openng/optimus-ui/button';
import { ContextMenuModule } from '@openng/optimus-ui/contextmenu';
import { InputTextModule } from '@openng/optimus-ui/inputtext';
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
    ContextMenuModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    SkeletonModule,
    DecimalPipe,
    NgTemplateOutlet,
    RouterLink,
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
  loading = signal<boolean>(false);

  readonly sortable: string[] = ['title', 'catchable', 'rating'];
  readonly filterable: string[] = ['base', 'story', 'status', 'difficulty', 'fakemon'];
  readonly booleanFields: string[] = ['newGraphics', 'physicalSpecialSplit', 'builtInRandomizer', 'builtInNuzlocke'];

  contextMenuItems = [
    {
      label: 'Open in new tab',
      icon: 'pi pi-external-link',
      command: () => window.open('/' + this.selectedGame.id, '_blank'),
    },
    {
      label: 'Edit',
      icon: 'pi pi-pencil',
      command: () => this.router.navigate(['/editor/' + this.selectedGame.id]),
    },
  ];

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
      { field: 'newGraphics', header: 'New graphics' },
      { field: 'catchable', header: 'Catchable' },
      { field: 'fakemon', header: 'Fakemon' },
      { field: 'physicalSpecialSplit', header: 'Phys/Spec split' },
      { field: 'builtInRandomizer', header: 'Randomizer' },
      { field: 'builtInNuzlocke', header: 'Nuzlocke mode' },
      { field: 'status', header: 'Status' },
      { field: 'difficulty', header: 'Difficulty' },
      { field: 'rating', header: 'Rating' },
    ];

    this.selectedColumns.set(
      ['title', 'base', 'story', 'catchable', 'physicalSpecialSplit', 'status', 'rating'].map(
        (field) => this.cols.find((col) => col.field === field)!,
      ),
    );

    this.http.get<Baserom[]>(this.baseUrl + '/baseroms/').subscribe((baseroms) => this.baseroms.set(baseroms));
    this.http.get<Choice[]>(this.baseUrl + '/stories/').subscribe((stories) => this.stories.set(stories));
    this.http.get<Choice[]>(this.baseUrl + '/status/').subscribe((status) => this.status.set(status));
    this.http.get<Choice[]>(this.baseUrl + '/fakemon/').subscribe((fakemon) => this.fakemon.set(fakemon));
    this.http
      .get<Difficulty[]>(this.baseUrl + '/difficulties/')
      .subscribe((difficulties) => this.difficulties.set(difficulties));
  }

  choiceOptions(field: string): Choice[] {
    switch (field) {
      case 'story':
        return this.stories();
      case 'status':
        return this.status();
      case 'difficulty':
        return this.difficulties();
      default:
        return this.fakemon();
    }
  }

  onRowSelect(): void {
    this.router.navigate(['/' + this.selectedGame.id]);
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
