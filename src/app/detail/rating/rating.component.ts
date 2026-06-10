import { Component, input, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Game, Rating } from '../../game';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '@auth0/auth0-angular';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css'],
  imports: [RatingModule, FormsModule, ButtonModule, RippleModule],
})
export class RatingComponent implements OnInit {
  private http = inject(HttpClient);
  private auth = inject(AuthService);

  game = input.required<Game>();
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
      return this.avgValue;
    }
  }

  set value(value: number) {
    console.log('set ' + value);
    this.set = true;
    this.ownValue = value;
  }

  constructor() {
    this.auth.user$.pipe(takeUntilDestroyed()).subscribe((user) => {
      if (!user) return;
      const ratings1 = this.game().rating.filter((rating) => rating.created_by?.auth0Id === user.sub);
      if (ratings1.length > 0) {
        this.ownValue = ratings1[0].value;
        this.readOnly = true;
      } else {
        this.readOnly = false;
      }
    });
  }

  ngOnInit(): void {
    this.loadAvg();
  }

  saveRating(): void {
    if (!this.readOnly) {
      this.http
        .post<Rating>(this.baseUrl + '/ratings/' + this.game().id, {
          game: this.game().id,
          value: this.ownValue,
        })
        .subscribe((rating: Rating) => {
          rating.game = this.game().id;
          this.game().rating.push(rating);
          this.readOnly = true;
          this.set = false;
          this.loadAvg();
        });
    }
  }

  private loadAvg(): void {
    let sum = 0;
    for (const rating of this.game().rating) {
      sum += rating.value;
    }
    this.avgValue = sum / this.game().rating.length;
  }
}
