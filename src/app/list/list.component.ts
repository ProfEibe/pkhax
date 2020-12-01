import {Component, OnInit} from '@angular/core';
import {GameService} from '../game.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  games = [];
  selectedGame: any;

  constructor(private gameService: GameService, private router: Router) {
  }

  ngOnInit(): void {
    this.gameService.getGames().subscribe(games => this.games = games);
  }

  onRowSelect($event: any): void {
    this.router.navigate(['/' + this.selectedGame.id]);
  }
}
