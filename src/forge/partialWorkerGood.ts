import { GoodName } from "../goods";

export interface PartialWorkerGood {
  name: GoodName;
  id: string;
  completedTurns: number;
  completedWorkerTurns: number;
}
