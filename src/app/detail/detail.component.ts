import { AfterViewChecked, Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { GameService } from '../game.service';
import { Game } from '../game';
import { Comment } from '../comment';
import { CommentService } from '../comment.service';
import { AuthService } from '@auth0/auth0-angular';
import { UserService } from '../user.service';
import { CommentComponent } from './comment/comment.component';
import { AsyncPipe, DatePipe } from '@angular/common';
import { EditorModule } from '@openng/optimus-ui/editor';
import { FormsModule } from '@angular/forms';
import { GalleriaModule } from '@openng/optimus-ui/galleria';
import { GalleriaResponsiveOptions } from '@openng/optimus-ui/types/galleria';
import { RatingComponent } from './rating/rating.component';
import { ButtonModule } from '@openng/optimus-ui/button';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  imports: [
    CommentComponent,
    RouterLink,
    AsyncPipe,
    EditorModule,
    FormsModule,
    GalleriaModule,
    RatingComponent,
    ButtonModule,
    DatePipe,
  ],
})
export class DetailComponent implements OnInit, AfterViewChecked {
  private route = inject(ActivatedRoute);
  private gameService = inject(GameService);
  private commentService = inject(CommentService);
  userService = inject(UserService);
  auth = inject(AuthService);

  private destroyRef = inject(DestroyRef);

  game = signal<Game | undefined>(undefined);
  notFound = signal(false);
  comments = signal<Comment[]>([]);
  rootCommentBox: string;

  private newComment: number | null = null;

  responsiveOptions: GalleriaResponsiveOptions[] = [
    { breakpoint: '1024px', numVisible: 8 },
    { breakpoint: '768px', numVisible: 3 },
    { breakpoint: '560px', numVisible: 1 },
  ];

  readonly features: {
    key: 'physicalSpecialSplit' | 'builtInNuzlocke' | 'builtInRandomizer' | 'newGraphics';
    label: string;
  }[] = [
    { key: 'physicalSpecialSplit', label: 'Physical/special split' },
    { key: 'newGraphics', label: 'New graphics' },
    { key: 'builtInNuzlocke', label: 'Built-in Nuzlocke mode' },
    { key: 'builtInRandomizer', label: 'Built-in randomizer' },
  ];

  activeIndex = 0;
  displayCustom = false;
  images = computed(() =>
    (this.game()?.images ?? '')
      .split('\n')
      .map((image) => image.trim())
      .filter((image) => image !== ''),
  );

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        map((params) => Number(params.get('id'))),
        filter((id) => !!id),
        switchMap((id) => this.gameService.getGame(id)),
        tap((game) => this.game.set(game)),
        switchMap((game) => this.commentService.getCommentsByGame(game.id)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (comments) => this.comments.set(comments),
        error: (error) => {
          this.notFound.set(true);
          console.error('Could not load game', error);
        },
      });
  }

  saveRootComment(): void {
    const comment = new Comment();
    const game = this.game();
    if (!game) return;
    comment.gameId = game.id;
    comment.content = this.rootCommentBox;
    this.commentService.createComment(comment).subscribe((saved) => {
      this.comments.update((prev) => [...prev, saved]);
      this.rootCommentBox = '';

      this.newComment = saved.id;
    });
  }

  ngAfterViewChecked(): void {
    if (this.newComment !== null) {
      const itemToScrollTo = document.getElementById('comment-' + this.newComment);
      if (itemToScrollTo) {
        itemToScrollTo.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }

      this.newComment = null;
    }
  }

  imageClick(index: number): void {
    this.activeIndex = index;
    this.displayCustom = true;
  }
}
