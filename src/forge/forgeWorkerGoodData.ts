import { GoodName } from "../goods";
import { PartialWorkerGood } from "./partialWorkerGood";

export interface ForgeWorkerGoodData {
  good: GoodName;
  completedUnits: number;
  inProgress: PartialWorkerGood[];
}
