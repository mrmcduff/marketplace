import { GoodName } from "../goods";

export interface PartialGood {
  name: GoodName;
  id: string;
  completedTurns: number;
  completedWorkerTurns: number;
}
