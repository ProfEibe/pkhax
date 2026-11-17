import { AfterViewChecked, Component, input, inject } from '@angular/core';
import { Comment } from '../../comment';
import { CommentService } from '../../comment.service';
import { AuthService } from '@auth0/auth0-angular';
import { UserService } from '../../user.service';
import { EditorModule } from '@openng/optimus-ui/editor';
import { ButtonModule } from '@openng/optimus-ui/button';
import { RippleModule } from '@openng/optimus-ui/ripple';
import { AsyncPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css'],
  imports: [EditorModule, ButtonModule, RippleModule, AsyncPipe, FormsModule, DatePipe, RouterLink],
})
export class CommentComponent implements AfterViewChecked {
  private service = inject(CommentService);
  auth = inject(AuthService);
  userService = inject(UserService);

  comment = input.required<Comment>();
  showReply = false;
  reply: string;
  private newComment: number | null = null;

  diffCreateModified(): boolean {
    return (
      new Date(this.comment().created_at).getMilliseconds() !== new Date(this.comment().modified_at).getMilliseconds()
    );
  }

  toggleReplyEditor(): void {
    this.showReply = !this.showReply;
  }

  createReply(): void {
    const child = new Comment();
    child.content = this.reply;
    child.gameId = this.comment().gameId;
    this.service.createChildComment(child, this.comment().id).subscribe((saved) => {
      this.comment().children.push(saved);
      this.reply = '';

      this.newComment = saved.id;
    });
    this.showReply = false;
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
}
