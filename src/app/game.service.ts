import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(private http: HttpClient) {
  }

  getGames(): Observable<any> {
    return this.http.get('http://localhost:996/api/games');
  }

  getGame(id: number): Observable<any> {
    return this.http.get('http://localhost:996/api/games/' + id);
  }

  createGame(game: any): Observable<any> {
    return this.http.post('http://localhost:996/api/games/', game);
  }

  updateGame(game: any): Observable<any> {
    return this.http.put('http://localhost:996/api/games/' + game.id, game);
  }

  deleteGame(id: number): Observable<any> {
    return this.http.delete('http://localhost:996/api/games/' + id);
  }
}
