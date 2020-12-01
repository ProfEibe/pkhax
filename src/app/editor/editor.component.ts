import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {GameService} from '../game.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
  game: any;

  constructor(private route: ActivatedRoute, private gameService: GameService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      if (params.has('id')) {
        // @ts-ignore
        this.gameService.getGame(+params.get('id')).subscribe(game => {
          this.game = game;
        }, error => {
          // stop Loading, show Error
        });
      }
    });
  }

  saveGame(): void {
    this.gameService.saveGame(this.game).subscribe(game => {
      this.game = game;
    }, error => {
      console.log(error);
    });
  }
}
