import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {
  }

  getGames(): Observable<any> {
    return this.http.get(this.baseUrl + '/api/games');
  }

  getGame(id: number): Observable<any> {
    return this.http.get(this.baseUrl + '/api/games/' + id);
  }

  createGame(game: any): Observable<any> {
    return this.http.post(this.baseUrl + '/api/games/', game);
  }

  updateGame(game: any): Observable<any> {
    return this.http.put(this.baseUrl + '/api/games/' + game.id, game);
  }

  deleteGame(id: number): Observable<any> {
    return this.http.delete(this.baseUrl + '/api/games/' + id);
  }
}
