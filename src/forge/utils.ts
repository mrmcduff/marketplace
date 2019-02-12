import { ForgeGoodData } from "./forgeGoodData";
import { PartialGood } from "./partialGood";
import uuid from 'uuid/v1';

export function copyForgeGoodData(goodData: ForgeGoodData) : ForgeGoodData {
  return {
    name: goodData.name,
    completedUnits: goodData.completedUnits,
    inProgress: copyPartialGoods(...goodData.inProgress),
  };
}

export function copyPartialGoods(...partialGoods: PartialGood[]) : PartialGood[] {
  return partialGoods.map<PartialGood>(pg => {
    return {...pg};
  });
}

export function getUuid(): string {
  return uuid.getUuid();
}
