import {Component, Input, OnInit} from '@angular/core';
import {GameService} from '../game.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {


  cols: any[] = [];

  _selectedColumns: any[] = [];

  games = [];
  selectedGame: any;

  constructor(private gameService: GameService, private router: Router) {
  }

  ngOnInit(): void {
    this.gameService.getGames().subscribe(games => this.games = games);

    this.cols = [
      { field: 'title', header: 'Name' },
      { field: 'creator', header: 'Creator' },
      { field: 'base', header: 'Baserom' },
      { field: 'version', header: 'Version' },
      { field: 'newStory', header: 'new Story' },
      { field: 'newGraphics', header: 'new Graphics' },
      { field: 'catchable', header: 'Catchable' },
      { field: 'fakemon', header: 'Fakemon' },
      { field: 'physicalSpecialSplit', header: 'physical/special-Split' },
      { field: 'builtinRandomzier', header: 'built-in Randomizer' },
      { field: 'builtinNuzlocke', header: 'built-in Nuzlocke' },
      { field: 'difficulty', header: 'Difficulty' },
      { field: 'rating', header: 'Rating' },
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
}
