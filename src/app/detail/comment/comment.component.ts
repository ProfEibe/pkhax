import { AfterViewChecked, Component, input, inject, linkedSignal, signal } from '@angular/core';
import { Comment } from '../../comment';
import { CommentService } from '../../comment.service';
import { AuthService } from '@auth0/auth0-angular';
import { UserService } from '../../user.service';
import { EditorModule } from '@openng/optimus-ui/editor';
import { ButtonModule } from '@openng/optimus-ui/button';
import { AsyncPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  imports: [EditorModule, ButtonModule, AsyncPipe, FormsModule, DatePipe, RouterLink],
})
export class CommentComponent implements AfterViewChecked {
  private service = inject(CommentService);
  auth = inject(AuthService);
  userService = inject(UserService);

  comment = input.required<Comment>();
  /** Replies, including the ones posted in this session */
  children = linkedSignal(() => this.comment().children);
  showReply = signal(false);
  reply: string;
  private newComment: number | null = null;

  /** Edited noticeably after creation (ignores the few ms between both timestamps on insert) */
  diffCreateModified(): boolean {
    const { created_at, modified_at } = this.comment();
    return !!created_at && !!modified_at && modified_at.getTime() - created_at.getTime() > 60_000;
  }

  toggleReplyEditor(): void {
    this.showReply.update((show) => !show);
  }

  createReply(): void {
    const child = new Comment();
    child.content = this.reply;
    child.gameId = this.comment().gameId;
    this.service.createChildComment(child, this.comment().id).subscribe((saved) => {
      this.children.update((children) => [...children, saved]);
      this.reply = '';

      this.newComment = saved.id;
    });
    this.showReply.set(false);
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
}
