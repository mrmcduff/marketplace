import { Good, Classification, GoodName } from "./good";

export class Beer implements Good {

  readonly name: string = 'beer';
  readonly workerTurns: number = 6;
  readonly absTurns: number = 1;
  readonly requirements = new Map<GoodName, number>([['wheat', 2]]);
  readonly classifications = [ Classification.Refined ];

}
