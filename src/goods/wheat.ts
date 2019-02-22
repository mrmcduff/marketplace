import { Good, GoodName, Classification } from "./good";

export class Wheat implements Good {
  readonly name: GoodName = 'wheat';
  readonly simTurns: number = 3;
  readonly absTurns: number = 2;
  readonly baseTraining = 2;
  readonly requirements = new Map<GoodName, number>();
  readonly classifications = new Set<Classification>([Classification.Raw]);
}
