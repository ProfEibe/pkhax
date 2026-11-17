import { Component, computed, inject, input, linkedSignal, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Game, Rating } from '../../game';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '@auth0/auth0-angular';
import { RatingModule } from '@openng/optimus-ui/rating';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from '@openng/optimus-ui/button';
import { RippleModule } from '@openng/optimus-ui/ripple';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css'],
  imports: [RatingModule, FormsModule, ButtonModule, RippleModule],
})
export class RatingComponent {
  private http = inject(HttpClient);
  private auth = inject(AuthService);

  game = input.required<Game>();

  private baseUrl = environment.baseUrl;
  private user = toSignal(this.auth.user$);

  /** Local copy of the game's ratings, reset whenever a different game is passed in. */
  ratings = linkedSignal(() => this.game().rating ?? []);

  /** Star value the user picked but has not saved yet. */
  private selected = linkedSignal<Game, number | undefined>({ source: this.game, computation: () => undefined });
  private saving = signal(false);
  /** Set after a successful save; the API does not always return `created_by` to match on. */
  private rated = linkedSignal({ source: this.game, computation: () => false });
  hover = false;

  private ownRating = computed(() => {
    const user = this.user();
    return user ? this.ratings().find((rating) => rating.created_by?.auth0Id === user.sub) : undefined;
  });

  /** Anonymous visitors and users who already rated this game cannot rate. */
  readOnly = computed(() => !this.user() || !!this.ownRating() || this.rated() || this.saving());

  ownValue = computed(() => this.selected() ?? this.ownRating()?.value);

  avgValue = computed(() => {
    const ratings = this.ratings();
    return ratings.length ? ratings.reduce((sum, rating) => sum + rating.value, 0) / ratings.length : 0;
  });

  get value(): number | undefined {
    return this.hover || this.selected() !== undefined ? this.ownValue() : this.avgValue();
  }

  set value(value: number | undefined) {
    this.selected.set(value ?? undefined);
  }

  saveRating(): void {
    const value = this.ownValue();
    if (this.readOnly() || !value) {
      return;
    }
    const game = this.game();
    this.saving.set(true);
    this.http.post<Rating>(this.baseUrl + '/ratings/' + game.id, { game: game.id, value }).subscribe({
      next: (rating) => {
        rating.game = game.id;
        const updated = [...this.ratings(), rating];
        // keep the shared Game model in sync (detail page shows the vote count from it)
        game.rating = updated;
        this.ratings.set(updated);
        this.selected.set(undefined);
        this.rated.set(true);
        this.saving.set(false);
      },
      error: () => this.saving.set(false),
    });
  }
}
