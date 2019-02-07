import { ForgeGoodData } from "./forgeGoodData";
import { GoodName } from "../goods";
import { copyForgeGoodData } from "./utils";
import { PartialGood } from "./partialGood";

export class ForgeAccount {
  readonly id: string;
  private readonly goodData: Map<GoodName, ForgeGoodData>;

  constructor(id: string) {
    this.id = id;
    this.goodData = new Map<GoodName, ForgeGoodData>();
  }

  public addNew(item: GoodName, workerTurns: number) : ForgeGoodData {
    let currentData = this.goodData.get(item);
    if(!currentData) {
      currentData = this.generateNewData(item);
    }
    const partialGood = this.generateNewPartialGood(item);
    partialGood.workerTurns = workerTurns;
    currentData.inProgress.push(partialGood);
    this.goodData.set(item, currentData);
    return copyForgeGoodData(currentData);
  }

  public add(item: GoodName, workerTurns: number, index?: number) : ForgeGoodData {
    if((!index && !(index === 0)) || index < 0) {
      return this.addNew(item, workerTurns);
    }
    let currentData = this.goodData.get(item);
    if(!currentData || !Number.isInteger(index) || index >= currentData.inProgress.length) {
      return this.addNew(item, workerTurns);
    }

    const partialGood = currentData.inProgress[index];
    partialGood.workerTurns += workerTurns;
    currentData[index] = partialGood;
    this.goodData.set(item, currentData);
    return copyForgeGoodData(currentData);
  }

  public inquire(item: GoodName) : ForgeGoodData {
    const data = this.goodData.get(item);
    if (!data) {
      return null;
    }
    return copyForgeGoodData(data);
  }

  private generateNewData(item: GoodName) : ForgeGoodData {
    return {
      name: item,
      completedUnits: 0,
      inProgress: [],
    };
  }

  private generateNewPartialGood(item: GoodName) : PartialGood {
    return {
      name: item,
      workerTurns: 0,
      completedTurns: 0,
    };
  }
}
