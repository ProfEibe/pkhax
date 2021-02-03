import {AfterViewChecked, Component, Input, OnInit} from '@angular/core';
import {Comment} from '../../comment';
import {CommentService} from '../../comment.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit, AfterViewChecked {
  @Input() comment: Comment;
  showReply = false;
  reply: string;
  private newComment: number;

  constructor(private service: CommentService) {
  }

  ngOnInit(): void {
  }

  toggleReplyEditor(): void {
    this.showReply = !this.showReply;
  }

  createReply(): void {
    const child = new Comment();
    child.content = this.reply;
    child.gameId = this.comment.gameId;
    this.service.createChildComment(child, this.comment.id).subscribe(saved => {
      this.comment.children.push(saved);
      this.reply = '';

      this.newComment = saved.id;
    });
    this.showReply = false;
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
