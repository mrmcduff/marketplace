import { GoodName } from "../goods";
import { Worker } from "../workers";

export interface PartialWorkerGood {
  name: GoodName;
  workers: Worker[];
  completedTurns: number;
  completedWorkerTurns: number;
}
