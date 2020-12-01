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
    return this.http.get('http://localhost:3000/games');
  }

  getGame(id: number): Observable<any> {
    return this.http.get('http://localhost:3000/games/' + id);
  }
}
