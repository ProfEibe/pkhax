import {AfterViewChecked, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {GameService} from '../game.service';
import {Game} from '../game';
import {Comment} from '../comment';
import {CommentService} from '../comment.service';
import {AuthService} from '@auth0/auth0-angular';
import {UserService} from '../user.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit, AfterViewChecked {
  game: Game;
  comments: Comment[] = [];
  selectedComment: number;
  rootCommentBox: string;

  private newComment: number;

  responsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 8
    },
    {
      breakpoint: '768px',
      numVisible: 3
    },
    {
      breakpoint: '560px',
      numVisible: 1
    }
  ];

  activeIndex = 0;
  displayCustom: boolean;
  images: string[];

  constructor(private route: ActivatedRoute,
              private gameService: GameService,
              private commentService: CommentService,
              public userService: UserService,
              public auth: AuthService) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      if (params.has('id')) {
        // @ts-ignore
        this.gameService.getGame(+params.get('id')).subscribe(game => {
          this.game = game;
          this.commentService.getCommentsByGame(game.id).subscribe(comments => {
            this.comments = comments;
          });
          if (game.images && game.images !== '') {
            this.images = game.images.split('\n');
          }
        }, error => {
          // stop Loading, show Error
        });
      }
    });

    this.auth.user$.subscribe(auth0User => {
      this.userService.getCurrentUser().subscribe();
    });
  }

  saveComment(): void {
    const comment = this.comments[this.selectedComment];
    console.log(comment);
  }

  saveRootComment(): void {
    const comment = new Comment();
    comment.gameId = this.game.id;
    comment.content = this.rootCommentBox;
    this.commentService.createComment(comment).subscribe(saved => {
      this.comments.push(saved);
      this.rootCommentBox = '';

      this.newComment = saved.id;
    });
  }

  ngAfterViewChecked(): void {
    if (this.newComment !== null) {
      const itemToScrollTo = document.getElementById('comment-' + this.newComment);
      if (itemToScrollTo) {
        itemToScrollTo.scrollIntoView({block: 'center', behavior: 'auto'});
        setTimeout(() => itemToScrollTo.animate([{backgroundColor: '#c1d4ff'}, {backgroundColor: '#FFFFFF'}], 500), 200);
      }

      // @ts-ignore
      this.newComment = null;
    }
  }

  imageClick(index: number): void {
    this.activeIndex = index;
    this.displayCustom = true;
  }
}
