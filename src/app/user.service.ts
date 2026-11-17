import { Injectable, inject } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, combineLatest, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '@auth0/auth0-angular';
import { User } from './user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private refresh$ = new BehaviorSubject<void>(undefined);

  baseUrl = environment.baseUrl;

  /**
   * The backend user of the logged-in visitor; `undefined` for anonymous visitors.
   * Only requested once authenticated, and reloaded after the display name changes.
   */
  currentUser = toSignal(
    combineLatest([this.auth.isAuthenticated$, this.refresh$]).pipe(
      switchMap(([authenticated]) =>
        authenticated ? this.getCurrentUser().pipe(catchError(() => of(undefined))) : of(undefined),
      ),
    ),
  );

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(this.baseUrl + '/user');
  }

  updateUserName(user: User): Observable<User> {
    return this.http.put<User>(this.baseUrl + '/user', user).pipe(tap(() => this.refresh$.next()));
  }
}
