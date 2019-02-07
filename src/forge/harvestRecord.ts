import { GoodName } from "../goods";

export interface HarvestRecord {
  goods: Map<GoodName, number>;
}
