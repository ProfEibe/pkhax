import {Component, Input, OnInit} from '@angular/core';
import {Game, Rating} from '../../game';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css']
})
export class RatingComponent implements OnInit {
  @Input() game: Game;
  private locRatings: Rating[];
  private set: boolean;
  readOnly: boolean;

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

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    this.loadAvg();

    let ratings = localStorage.getItem('pk-rating');
    if (!ratings) {
      ratings = '[]';
    }
    this.locRatings = JSON.parse(ratings);
    const filter = this.locRatings.filter((rating: { 'game': number, 'value': number }) => {
      return rating.game === this.game.id && rating.value != null;
    });
    if (filter.length > 0) {
      this.ownValue = filter[0].value;
      this.readOnly = true;
    }
  }

  saveRating(): void {
    if (!this.readOnly) {

      this.http.post<Rating>(this.baseUrl + '/ratings', {game: this.game.id, value: this.ownValue}).subscribe((rating: Rating) => {
        rating.game = this.game.id;
        this.locRatings.push(rating);
        this.game.rating.push(rating);
        const newLoc: Rating[] = [];
        this.locRatings.forEach(el => {
          if (el.value != null) {
            newLoc.push(el);
          }
        });
        localStorage.setItem('pk-rating', JSON.stringify(newLoc));
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
