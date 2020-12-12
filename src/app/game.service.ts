import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../environments/environment';
import {Game} from './game';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {
  }

  getGames(): Observable<Game[]> {
    return this.http.get<Game[]>(this.baseUrl + '/games');
  }

  getGame(id: number): Observable<Game> {
    return this.http.get<Game>(this.baseUrl + '/games/' + id);
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
