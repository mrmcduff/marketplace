import { ForgeGoodData } from "./forgeGoodData";
import { PartialGood } from "./partialGood";
import { ForgeWorkerGoodData } from "./forgeWorkerGoodData";
import { PartialWorkerGood } from "./partialWorkerGood";
import { Worker } from "../workers";

export function copyForgeGoodData(goodData: ForgeGoodData) : ForgeGoodData {
  return {
    name: goodData.name,
    completedUnits: goodData.completedUnits,
    inProgress: copyPartialGoods(...goodData.inProgress),
  };
}

export function copyForgeWorkerGoodData(goodData: ForgeWorkerGoodData) : ForgeWorkerGoodData {
  return {
    good: goodData.good,
    completedUnits: goodData.completedUnits,
    inProgress: copyPartialWorkerGoods( ...goodData.inProgress)
  };
}

export function copyPartialGoods(...partialGoods: PartialGood[]) : PartialGood[] {
  return partialGoods.map<PartialGood>(pg => {
    return {...pg};
  });
}

export function copyPartialWorkerGoods(...partialWorkerGoods: PartialWorkerGood[]): PartialWorkerGood[] {
  return partialWorkerGoods.map<PartialWorkerGood>(pwg => {
    const copiedWorkers = pwg.workers.map<Worker>(worker => worker.clone());
    return {
      name: pwg.name,
      workers: copiedWorkers,
      completedTurns: pwg.completedTurns,
      completedWorkerTurns: pwg.completedWorkerTurns,
    };
  });
}
