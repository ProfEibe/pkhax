import {Component, Input, OnInit} from '@angular/core';
import {Game, Rating} from '../../game';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {AuthService} from '@auth0/auth0-angular';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css']
})
export class RatingComponent implements OnInit {
  @Input() game: Game;
  private set: boolean;
  readOnly = true;

  baseUrl = environment.baseUrl;

  private avgValue: number;
  ownValue: number;
  hover = false;

  get value(): number {
    if (this.hover || this.set) {
      return this.ownValue;
    } else {
      return this.avgValue - 0.49;
    }
  }

  set value(value: number) {
    console.log('set ' + value);
    this.set = true;
    this.ownValue = value;
  }

  constructor(private http: HttpClient, private auth: AuthService) {
  }

  ngOnInit(): void {
    this.loadAvg();

    this.auth.user$.subscribe(user => {
      if (!user) return;
      const ratings1 = this.game.rating.filter(rating => rating.created_by?.auth0Id === user.sub);
      if (ratings1.length > 0) {
        this.ownValue = ratings1[0].value;
        this.readOnly = true;
      } else {
        this.readOnly = false;
      }
    });
  }

  saveRating(): void {
    if (!this.readOnly) {

      this.http.post<Rating>(this.baseUrl + '/ratings/' + this.game.id,
        {game: this.game.id, value: this.ownValue}).subscribe((rating: Rating) => {
        rating.game = this.game.id;
        this.game.rating.push(rating);
        this.readOnly = true;
        this.set = false;
        this.loadAvg();
      });
    }
  }

  private loadAvg(): void {
    let sum = 0;
    for (const rating of this.game.rating) {
      sum += rating.value;
    }
    this.avgValue = sum / this.game.rating.length;
  }
}
