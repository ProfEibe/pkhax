import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GameService } from '../game.service';
import { HttpClient } from '@angular/common/http';
import { MessageService } from '@openng/optimus-ui/api';
import { environment } from '../../environments/environment';
import { Baserom, Choice, Difficulty, Game } from '../game';
import { ButtonModule } from '@openng/optimus-ui/button';
import { FormsModule } from '@angular/forms';
import { EditorModule } from '@openng/optimus-ui/editor';
import { Select } from '@openng/optimus-ui/select';
import { MultiSelectModule } from '@openng/optimus-ui/multiselect';
import { InputNumberModule } from '@openng/optimus-ui/inputnumber';
import { MessageModule } from '@openng/optimus-ui/message';
import { CardModule } from '@openng/optimus-ui/card';
import { ToastModule } from '@openng/optimus-ui/toast';
import { InputTextModule } from '@openng/optimus-ui/inputtext';
import { TextareaModule } from '@openng/optimus-ui/textarea';
import { CheckboxModule } from '@openng/optimus-ui/checkbox';
import { InputGroupModule } from '@openng/optimus-ui/inputgroup';
import { InputGroupAddonModule } from '@openng/optimus-ui/inputgroupaddon';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css'],
  providers: [MessageService],
  imports: [
    ButtonModule,
    FormsModule,
    EditorModule,
    Select,
    MultiSelectModule,
    InputNumberModule,
    MessageModule,
    RouterLink,
    CardModule,
    ToastModule,
    InputTextModule,
    TextareaModule,
    CheckboxModule,
    InputGroupModule,
    InputGroupAddonModule,
  ],
})
export class EditorComponent implements OnInit {
  game: Game | undefined;
  baseroms: Baserom[] = [];
  consoles: Choice[] = [];
  status: Choice[] = [];
  fakemon: Choice[] = [];
  stories: Choice[] = [];
  difficulties: Difficulty[] = [];

  baseUrl = environment.baseUrl;
  linkExists = false;

  private route = inject(ActivatedRoute);
  private gameService = inject(GameService);
  private router = inject(Router);
  private http = inject(HttpClient);
  private messageService = inject(MessageService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.http.get<Baserom[]>(this.baseUrl + '/baseroms/').subscribe((baseroms) => (this.baseroms = baseroms));
    this.http.get<Choice[]>(this.baseUrl + '/consoles/').subscribe((consoles) => (this.consoles = consoles));
    this.http.get<Choice[]>(this.baseUrl + '/status/').subscribe((status) => (this.status = status));
    this.http.get<Choice[]>(this.baseUrl + '/stories/').subscribe((stories) => (this.stories = stories));
    this.http.get<Choice[]>(this.baseUrl + '/fakemon/').subscribe((fakemon) => (this.fakemon = fakemon));
    this.http
      .get<Difficulty[]>(this.baseUrl + '/difficulties/')
      .subscribe((difficulties) => (this.difficulties = difficulties));

    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const id = Number(params.get('id'));
      if (id) {
        this.gameService.getGame(id).subscribe({
          next: (game) => (this.game = game),
          error: () => this.showError('Game could not be loaded'),
        });
      } else {
        this.game = new Game();
      }
    });
  }

  updateGame(): void {
    if (!this.game) {
      return;
    }
    this.gameService.updateGame(this.game).subscribe({
      next: (game) => {
        this.game = game;
        this.messageService.add({ severity: 'success', summary: 'Saved', detail: 'Game updated' });
      },
      error: (error) => this.showError('An error occured', error),
    });
  }

  createGame(): void {
    if (!this.game) {
      return;
    }
    this.gameService.createGame(this.game).subscribe({
      next: (game) => {
        this.game = game;
        this.router.navigate(['/editor', game.id]);
        this.messageService.add({ severity: 'success', summary: 'Saved', detail: 'Game created' });
      },
      error: (error) => this.showError('An error occured', error),
    });
  }

  checkLink(): void {
    const newLink = this.trim(this.game?.link?.trim() ?? '', '/');
    this.gameService.getGames().subscribe((games) => {
      this.linkExists =
        newLink !== '' &&
        games.some(
          (game) => game.id !== this.game?.id && game.link != null && this.trim(game.link.trim(), '/') === newLink,
        );
    });
  }

  trim(s: string, c: string): string {
    if (c === ']') {
      c = '\\]';
    }
    if (c === '\\') {
      c = '\\\\';
    }
    return s.replace(new RegExp('^[' + c + ']+|[' + c + ']+$', 'g'), '');
  }

  private showError(detail: string, error?: unknown): void {
    this.messageService.add({ severity: 'error', summary: 'Error', detail });
    if (error) {
      console.error(error);
    }
  }
}
