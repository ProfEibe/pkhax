import { Injectable, OnInit } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  baseUrl = environment.baseUrl;

  currentUser: Observable<User>;

  constructor(private http: HttpClient) {
    this.currentUser = this.http.get<User>(this.baseUrl + '/user');
  }

  getCurrentUser(): Observable<User> {
    return this.currentUser;
  }

  updateUserName(user: User): Observable<User> {
    return this.http.put<User>(this.baseUrl + '/user', user);
  }
}
