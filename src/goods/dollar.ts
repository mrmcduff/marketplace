import { Good, Classification, GoodName } from "./good";

export class Dollar implements Good {
  readonly name = 'dollar';
  readonly workerTurns = 0;
  readonly absTurns = 0;
  readonly baseTraining = 0;
  readonly classifications = new Set<Classification>([ Classification.Currency ]);
  readonly requirements: Map<GoodName, number> = new Map();
}
