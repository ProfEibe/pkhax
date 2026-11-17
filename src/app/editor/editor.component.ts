import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
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
import { ToastModule } from '@openng/optimus-ui/toast';
import { InputTextModule } from '@openng/optimus-ui/inputtext';
import { TextareaModule } from '@openng/optimus-ui/textarea';
import { CheckboxModule } from '@openng/optimus-ui/checkbox';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  providers: [MessageService],
  imports: [
    ButtonModule,
    FormsModule,
    EditorModule,
    Select,
    MultiSelectModule,
    InputNumberModule,
    RouterLink,
    ToastModule,
    InputTextModule,
    TextareaModule,
    CheckboxModule,
  ],
})
export class EditorComponent implements OnInit {
  game = signal<Game | undefined>(undefined);
  baseroms = signal<Baserom[]>([]);
  consoles = signal<Choice[]>([]);
  status = signal<Choice[]>([]);
  fakemon = signal<Choice[]>([]);
  stories = signal<Choice[]>([]);
  difficulties = signal<Difficulty[]>([]);

  baseUrl = environment.baseUrl;
  linkExists = signal(false);

  private route = inject(ActivatedRoute);
  private gameService = inject(GameService);
  private router = inject(Router);
  private http = inject(HttpClient);
  private messageService = inject(MessageService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.http.get<Baserom[]>(this.baseUrl + '/baseroms/').subscribe((list) => this.baseroms.set(list));
    this.http.get<Choice[]>(this.baseUrl + '/consoles/').subscribe((list) => this.consoles.set(list));
    this.http.get<Choice[]>(this.baseUrl + '/status/').subscribe((list) => this.status.set(list));
    this.http.get<Choice[]>(this.baseUrl + '/stories/').subscribe((list) => this.stories.set(list));
    this.http.get<Choice[]>(this.baseUrl + '/fakemon/').subscribe((list) => this.fakemon.set(list));
    this.http.get<Difficulty[]>(this.baseUrl + '/difficulties/').subscribe((list) => this.difficulties.set(list));

    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const id = Number(params.get('id'));
      if (id) {
        this.gameService.getGame(id).subscribe({
          next: (game) => this.game.set(game),
          error: () => this.showError('Game could not be loaded'),
        });
      } else {
        this.game.set(new Game());
      }
    });
  }

  updateGame(): void {
    const current = this.game();
    if (!current) {
      return;
    }
    this.gameService.updateGame(current).subscribe({
      next: (game) => {
        this.game.set(game);
        this.messageService.add({ severity: 'success', summary: 'Saved', detail: 'Game updated' });
      },
      error: (error) => this.showError('An error occured', error),
    });
  }

  createGame(): void {
    const current = this.game();
    if (!current) {
      return;
    }
    this.gameService.createGame(current).subscribe({
      next: (game) => {
        this.game.set(game);
        this.router.navigate(['/editor', game.id]);
        this.messageService.add({ severity: 'success', summary: 'Saved', detail: 'Game created' });
      },
      error: (error) => this.showError('An error occured', error),
    });
  }

  checkLink(): void {
    const current = this.game();
    const newLink = this.trim(current?.link?.trim() ?? '', '/');
    this.gameService.getGames().subscribe((games) => {
      this.linkExists.set(
        newLink !== '' &&
          games.some(
            (game) => game.id !== current?.id && game.link != null && this.trim(game.link.trim(), '/') === newLink,
          ),
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
