import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient, withXhr } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { AuthService } from '@auth0/auth0-angular';
import { BehaviorSubject } from 'rxjs';

import { RatingComponent } from './rating.component';
import { Game, Rating } from '../../game';
import { environment } from '../../../environments/environment';

describe('RatingComponent', () => {
  let component: RatingComponent;
  let fixture: ComponentFixture<RatingComponent>;
  let user$: BehaviorSubject<{
    sub: string;
  } | null>;

  function rating(value: number, auth0Id?: string): Rating {
    return { id: value, game: 1, value, created_by: auth0Id ? { id: 1, auth0Id, displayName: '' } : null } as Rating;
  }

  function createWith(ratings: Rating[]): Game {
    const game = new Game();
    game.id = 1;
    game.rating = ratings;
    fixture = TestBed.createComponent(RatingComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('game', game);
    fixture.detectChanges();
    return game;
  }

  beforeEach(async () => {
    // BehaviorSubject emits synchronously on subscribe – the case that used to throw NG0950
    user$ = new BehaviorSubject<{
      sub: string;
    } | null>({ sub: 'auth0|me' });
    await TestBed.configureTestingModule({
      imports: [RatingComponent],
      providers: [
        provideHttpClient(withXhr()),
        provideHttpClientTesting(),
        provideAnimationsAsync(),
        { provide: AuthService, useValue: { user$ } },
      ],
    }).compileComponents();
  });

  it('creates for a logged-in user without throwing', () => {
    createWith([]);
    expect(component).toBeTruthy();
    expect(component.avgValue()).toBe(0);
    expect(component.readOnly()).toBe(false);
  });

  it('is read-only for anonymous visitors', () => {
    user$.next(null);
    createWith([rating(4)]);
    expect(component.readOnly()).toBe(true);
  });

  it('shows the average and is read-only when the user already rated', () => {
    createWith([rating(2), rating(4, 'auth0|me')]);
    expect(component.avgValue()).toBe(3);
    expect(component.readOnly()).toBe(true);
    expect(component.ownValue()).toBe(4);
  });

  it('saves a rating and becomes read-only', () => {
    const game = createWith([rating(2)]);
    const http = TestBed.inject(HttpTestingController);

    component.value = 4;
    component.saveRating();
    const req = http.expectOne(environment.baseUrl + '/ratings/1');
    expect(req.request.body).toEqual({ game: 1, value: 4 });
    req.flush(rating(4));

    expect(component.readOnly()).toBe(true);
    expect(component.ratings().length).toBe(2);
    expect(game.rating.length).toBe(2);
    expect(component.avgValue()).toBe(3);
    http.verify();
  });
});
