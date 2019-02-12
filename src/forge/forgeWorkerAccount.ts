import { GoodName } from "../goods";
import { ForgeWorkerGoodData } from "./forgeWorkerGoodData";

/**
 * Represents the worker-based version of forge accounts.
 * Planned to replace ForgeAccounts.
 */
export class ForgeWorkerAccount {

  readonly id: string;
  private readonly goodData: Map<GoodName, ForgeWorkerGoodData>;

  constructor(id: string) {
    this.id = id;
    this.goodData = new Map<GoodName, ForgeWorkerGoodData>();
  }

  public inquire(item: GoodName) : ForgeWorkerGoodData {
    const data = this.goodData.get(item);
    if (!data) {
      return null;
    }
    return null;
    // return copyForgeGoodData(data);
  }
}
