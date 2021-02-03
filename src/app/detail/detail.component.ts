import {AfterViewChecked, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {GameService} from '../game.service';
import {Game} from '../game';
import {Comment} from '../comment';
import {CommentService} from '../comment.service';

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

  constructor(private route: ActivatedRoute, private gameService: GameService, private commentService: CommentService) {
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
        }, error => {
          // stop Loading, show Error
        });
      }
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
        itemToScrollTo.scrollIntoView({block: 'center', behavior: 'auto'} );
        setTimeout(() => itemToScrollTo.animate([{backgroundColor: '#c1d4ff'}, {backgroundColor: '#FFFFFF'}], 500), 200);
      }

      // @ts-ignore
      this.newComment = null;
    }
  }
}
