import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Comment, CommentAdapter} from './comment';
import {Observable} from 'rxjs';
import {environment} from '../environments/environment';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient, private adapter: CommentAdapter) { }

  public getCommentsByGame(id: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(this.baseUrl + '/games/' + id + '/comments').pipe(
      map((list) => list.map(comment => this.adapter.adapt(comment)))
    );
  }

  public createComment(comment: Comment): Observable<Comment> {
    return this.http.post(this.baseUrl + '/games/' + comment.gameId + '/comments', comment).pipe(
      map((item: any) => this.adapter.adapt(item))
    );
  }

  public createChildComment(comment: Comment, parentId: number): Observable<Comment> {
    return this.http.post(this.baseUrl + '/games/' + comment.gameId + '/comments/' + parentId, comment).pipe(
      map((item: any) => this.adapter.adapt(item))
    );
  }
}
