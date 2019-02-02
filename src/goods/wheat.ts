import { Good, GoodName, Classification } from "./good";

export class Wheat implements Good {

  readonly name: string = 'wheat';
  readonly workerTurns: number = 3;
  readonly absTurns: number = 2;
  readonly requirements = new Map<GoodName, number>();
  readonly classifications = [ Classification.Raw ];

}
