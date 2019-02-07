import { GoodName } from "../goods";

export interface PartialGood {
  name: GoodName;
  workerTurns: number;
  completedTurns: number;
}
