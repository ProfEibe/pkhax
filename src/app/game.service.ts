import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../environments/environment';
import {Game, GameAdapter} from './game';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient, private adapter: GameAdapter) {
  }

  getGames(): Observable<Game[]> {
    return this.http.get<Game[]>(this.baseUrl + '/games/').pipe(
      map((list) => list.map(game => this.adapter.adapt(game))
    ));
  }

  getGame(id: number): Observable<Game> {
    return this.http.get<Game>(this.baseUrl + '/games/' + id).pipe(
      map((item: any) => this.adapter.adapt(item))
    );
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
