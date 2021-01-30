import {Component, Input, OnInit} from '@angular/core';
import {Comment} from '../../comment';
import {CommentService} from '../../comment.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
  @Input() comment: Comment;
  showReply = false;
  reply: string;

  constructor(private service: CommentService) { }

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
    });
    this.showReply = false;
  }
}
