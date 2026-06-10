import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Game, GameAdapter } from './game';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private http = inject(HttpClient);
  private adapter = inject(GameAdapter);

  baseUrl = environment.baseUrl;

  getGames(): Observable<Game[]> {
    console.log('GameService: Fetching games from', this.baseUrl + '/games/');
    return this.http
      .get<Game[]>(this.baseUrl + '/games/')
      .pipe(
        map((list) => {
          console.log('GameService: Received', list.length, 'games');
          return list.map((game) => this.adapter.adapt(game));
        })
      );
  }

  getGame(id: number): Observable<Game> {
    return this.http.get<Game>(this.baseUrl + '/games/' + id).pipe(map((item: any) => this.adapter.adapt(item)));
  }

  createGame(game: any): Observable<Game> {
    return this.http.post<Game>(this.baseUrl + '/games/', game);
  }

  updateGame(game: any): Observable<Game> {
    return this.http.put<Game>(this.baseUrl + '/games/' + game.id, game);
  }

  deleteGame(id: number): Observable<any> {
    return this.http.delete(this.baseUrl + '/games/' + id);
  }
}
