import {User} from './user';
import {Injectable} from '@angular/core';
import {Adapter} from './adapter';
import {Game} from './game';

export class Comment {
  id: number;
  content: string;
  gameId: number;
  children: Comment[];
  created_at: Date;
  modified_at: Date;
  created_by: User;
  modified_by: User;
}

@Injectable({
  providedIn: 'root',
})
export class CommentAdapter implements Adapter<Comment> {
  adapt(item: any): Comment {
    const comment = Object.assign(new Comment(), item);
    comment.created_at = new Date(item.created_at);
    comment.modified_at = new Date(item.modified_at);
    return comment;
  }
}
