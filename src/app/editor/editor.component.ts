import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {GameService} from '../game.service';
import {HttpClient} from '@angular/common/http';
import {MessageService} from 'primeng/api';
import {environment} from '../../environments/environment';
import {Baserom, Choice, Game} from '../game';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css'],
  providers: [MessageService]
})
export class EditorComponent implements OnInit {
  game: Game | undefined;
  baseroms: Baserom[] = [];
  consoles: Choice[] = [];
  status: Choice[] = [];
  stories: Choice[];

  baseUrl = environment.baseUrl;
  linkExists = false;

  constructor(private route: ActivatedRoute,
              private gameService: GameService,
              private router: Router,
              private http: HttpClient,
              private messageService: MessageService) {
  }

  ngOnInit(): void {
    this.http.get<Baserom[]>(this.baseUrl + '/baseroms/').subscribe(baseroms => this.baseroms = baseroms);
    this.http.get<Choice[]>(this.baseUrl + '/consoles/').subscribe(consoles => this.consoles = consoles);
    this.http.get<Choice[]>(this.baseUrl + '/status/').subscribe(status => this.status = status);
    this.http.get<Choice[]>(this.baseUrl + '/stories/').subscribe(stories => this.stories = stories);

    this.route.paramMap.subscribe(params => {
      console.log(params);
      // @ts-ignore
      if (params.has('id') && params.get('id')?.length > 0) {
        // @ts-ignore
        this.gameService.getGame(+params.get('id')).subscribe(game => {
          this.game = game;
          console.log(this.game);
        }, error => {
          // stop Loading, show Error
        });
      } else {
        this.game = new Game();
      }
    });
  }

  updateGame(): void {
    console.log(this.game);
    this.gameService.updateGame(this.game).subscribe(game => {
      this.game = game;
      this.messageService.add({severity: 'success', summary: 'Saved', detail: 'Game updated'});
    }, error => {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'An error occured'});
      console.log(error);
    });
  }

  createGame(): void {
    this.gameService.createGame(this.game).subscribe(game => {
      this.game = game;
      this.router.navigate(['/editor', game.id]);
      this.messageService.add({severity: 'success', summary: 'Saved', detail: 'Game created'});
    }, error => {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'An error occured'});
      console.log(error);
    });
  }

  checkLink(): void {
    this.gameService.getGames().subscribe(games => {
      const filter = games.filter(game => {
        if (game.link != null) {
          const existingLink = this.trim(game.link.trim(), '/');
          const newLink = this.trim(this.game?.link.trim(), '/');
          return existingLink === newLink;
        } else {
          return false;
        }
      });
      if (filter.length > 0) {
        this.linkExists = true;
      } else {
        this.linkExists = false;
      }
    });
  }

  trim(s: any, c: any): string {
    if (c === ']') {
      c = '\\]';
    }
    if (c === '\\') {
      c = '\\\\';
    }
    return s.replace(new RegExp(
      '^[' + c + ']+|[' + c + ']+$', 'g'
    ), '');
  }
}
