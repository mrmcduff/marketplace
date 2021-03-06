import { Good, Classification, GoodName } from "./good";

export class Beer implements Good {
  readonly name: GoodName = 'beer';
  readonly simTurns: number = 6;
  readonly absTurns: number = 1;
  readonly baseTraining: number = 4;
  readonly requirements = new Map<GoodName, number>([['wheat', 2]]);
  readonly classifications = new Set<Classification>([Classification.Refined]);
}
