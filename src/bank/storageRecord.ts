import { Good, GoodName } from "../goods";

export interface StorageRecord {
  readonly good: GoodName;
  quantity: number;
}
