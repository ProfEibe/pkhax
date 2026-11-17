import { AfterViewChecked, Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
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
import { AsyncPipe } from '@angular/common';
import { EditorModule } from 'primeng/editor';
import { FormsModule } from '@angular/forms';
import { GalleriaModule } from 'primeng/galleria';
import { GalleriaResponsiveOptions } from 'primeng/types/galleria';
import { FieldsetModule } from 'primeng/fieldset';
import { DividerModule } from 'primeng/divider';
import { RatingComponent } from './rating/rating.component';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
  imports: [
    CommentComponent,
    RouterLink,
    AsyncPipe,
    EditorModule,
    FormsModule,
    GalleriaModule,
    FieldsetModule,
    DividerModule,
    RatingComponent,
    ButtonModule,
    CardModule,
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
  comments = signal<Comment[]>([]);
  rootCommentBox: string;

  private newComment: number | null = null;

  responsiveOptions: GalleriaResponsiveOptions[] = [
    { breakpoint: '1024px', numVisible: 8 },
    { breakpoint: '768px', numVisible: 3 },
    { breakpoint: '560px', numVisible: 1 },
  ];

  activeIndex = 0;
  displayCustom: boolean;
  images: string[] = [];

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        map((params) => Number(params.get('id'))),
        filter((id) => !!id),
        switchMap((id) => this.gameService.getGame(id)),
        tap((game) => {
          this.game.set(game);
          this.images = game.images ? game.images.split('\n').filter((image) => image.trim() !== '') : [];
        }),
        switchMap((game) => this.commentService.getCommentsByGame(game.id)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (comments) => this.comments.set(comments),
        error: (error) => console.error('Could not load game', error),
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
        itemToScrollTo.scrollIntoView({ block: 'center', behavior: 'auto' });
        setTimeout(
          () => itemToScrollTo.animate([{ backgroundColor: '#c1d4ff' }, { backgroundColor: '#FFFFFF' }], 500),
          200,
        );
      }

      this.newComment = null;
    }
  }

  imageClick(index: number): void {
    this.activeIndex = index;
    this.displayCustom = true;
  }
}
