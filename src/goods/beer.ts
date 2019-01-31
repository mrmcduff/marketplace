import { Good } from "./good";
import { Wheat } from "./wheat";

export class Beer implements Good {

  public name: string = 'beer';
  public workerTurns: number = 6;
  public absTurns: number = 1;
  public requirements = new Map<string, number>([[Wheat.getName(), 2]]);

  public static getName(): string {
    return 'beer';
  }
}
