import {Adapter} from './adapter';
import {Injectable} from '@angular/core';
import {User} from './user';

export class Choice {
  public id: number;
  public name: string;
}

export class Baserom {
  public id: number;
  public name: string;
  public color: string;
  public fontColor: string;
}

export class Difficulty {
  public id: number;
  public name: string;
  public description: string;
}

export class Rating {
  public id: number;
  public game: number;
  public value: number;
  // tslint:disable-next-line:variable-name
  public created_by: User;
}

export class Game {
  public id: number;
  public title: string;
  public link: string;
  public discord: string;
  public creator: string;
  public version: string;
  public description: string;
  public newGraphics: boolean;
  public lastUpdate: Date;
  public catchable: number;
  public fakemon: boolean;
  public physicalSpecialSplit: boolean;
  public builtInRandomizer: boolean;
  public builtInNuzlocke: boolean;
  public difficulty: Difficulty;

  public base: Baserom[];
  public console: Choice;
  public status: Choice;
  public story: Choice;
  public rating: Rating[];

  public get avgRating(): number {
    if (this.rating?.length === 0) {
      return 0;
    }
    let sum = 0;
    for (const rating of this.rating) {
      sum += rating.value;
    }
    return sum / this.rating.length;
  }
}

@Injectable({
  providedIn: 'root',
})
export class GameAdapter implements Adapter<Game> {
  adapt(item: any): Game {
    const game = Object.assign(new Game(), item);
    game.lastUpdate = new Date(item.lastUpdate);
    return game;
  }
}
