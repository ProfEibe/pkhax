import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {GameService} from '../game.service';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
  game = {};
  baseroms: any[] = [];

  constructor(private route: ActivatedRoute, private gameService: GameService, private router: Router, private http:HttpClient) { }

  ngOnInit(): void {
    this.http.get<any[]>('http://localhost:996/api/baseroms/').subscribe(baseroms => this.baseroms = baseroms);

    this.route.paramMap.subscribe(params => {
      console.log(params);
      if (params.has('id') && params.get('id')?.length > 0) {
        // @ts-ignore
        this.gameService.getGame(+params.get('id')).subscribe(game => {
          this.game = game;
        }, error => {
          // stop Loading, show Error
        });
      }
    });
  }

  updateGame(): void {
    this.gameService.updateGame(this.game).subscribe(game => {
      this.game = game;
    }, error => {
      console.log(error);
    });
  }

  createGame(): void {
    this.gameService.createGame(this.game).subscribe(game => {
      this.game = game;
      this.router.navigate(['/editor', game.id]);
    }, error => {
      console.log(error);
    });
  }
}
