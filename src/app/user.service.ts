import { Injectable, OnInit } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './user';
import { shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  baseUrl = environment.baseUrl;

  private currentUser$: Observable<User> | undefined;

  constructor(private http: HttpClient) { }

  get currentUser(): Observable<User> {
    if (!this.currentUser$) {
      this.currentUser$ = this.getCurrentUser().pipe(shareReplay(1));
    }
    return this.currentUser$;
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(this.baseUrl + '/user');
  }

  updateUserName(user: User): Observable<User> {
    return this.http.put<User>(this.baseUrl + '/user', user);
  }
}
