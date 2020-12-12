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

export class Game {
  public id: number;
  public title: string;
  public link: string;
  public discord: string;
  public creator: string;
  public version: string;
  public description: string;
  public original: boolean;
  public newGraphics: boolean;
  public lastUpdate: Date;
  public catchable: number;
  public fakemon: boolean;
  public physicalSpecialSplit: boolean;
  public builtInRandomizer: boolean;
  public builtInNuzlocke: boolean;
  public difficulty: number;

  public base: Baserom[];
  public console: Choice;
  public status: Choice;
  public rating: number;
}
