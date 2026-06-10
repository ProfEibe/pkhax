import { Injectable, inject } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './user';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);

  baseUrl = environment.baseUrl;

  currentUser = toSignal(this.getCurrentUser());

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(this.baseUrl + '/user');
  }

  updateUserName(user: User): Observable<User> {
    return this.http.put<User>(this.baseUrl + '/user', user);
  }
}
