import {Component, OnInit} from '@angular/core';
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
export class DetailComponent implements OnInit {
  game: Game;
  comments: Comment[] = [];
  selectedComment: number;
  rootCommentBox: string;

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
    });
  }
}
