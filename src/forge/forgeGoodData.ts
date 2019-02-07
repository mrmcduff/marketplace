import { GoodName } from "../goods";
import { PartialGood } from "./partialGood";

export interface ForgeGoodData {
  name: GoodName;
  completedUnits: number;
  inProgress: PartialGood[];
}
