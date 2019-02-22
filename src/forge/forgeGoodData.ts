import { GoodName, good, Good } from "../goods";
import { PartialGood } from "./partialGood";

export class ForgeGoodData {
  readonly name: GoodName;
  private completedUnits: number;
  private partialGoods: PartialGood[];
  private partialMapBySim: Map<string, number>;
  private partialMapById: Map<string, number>;

  private createUuid: () => string;

  constructor(name: GoodName,
    createUuid: () => string) {
    this.name = name;
    this.completedUnits = 0;
    this.partialGoods = [];
    this.partialMapBySim = new Map<string, number>();
    this.partialMapById = new Map<string, number>();
    this.createUuid = createUuid;
  }

  public assign(simId: string, goodId?: string): boolean {
    if (goodId) {
      return this.assignToExisting([simId], goodId);
    }
    return this.assignToNew([simId]);
  }

  public assignGroup(sims: string[], goodId?: string): boolean {
    if (goodId) {
      return this.assignToExisting(sims, goodId);
    }
    return this.assignToNew(sims);
  }

  public addSimInput(simId: string, simTurns: number): boolean {
    if (!this.partialMapBySim.has(simId)) {
      return false;
    }
    const partialGood = this.partialGoods[this.partialMapBySim.get(simId)];
    partialGood.completedSimTurns += simTurns;
    return true;
  }

  public inquirePartialGoods(): PartialGood[] {
    return [...this.partialGoods];
  }

  public inquireSimAssignments(): Map<string, string> {
    const simToGoodIdMap = new Map<string, string>();
    this.partialMapBySim.forEach((index, simId) => {
      simToGoodIdMap.set(simId, this.partialGoods[index].id);
    }, this);
    return simToGoodIdMap;
  }

  public removeSim(simId: string): boolean {
    return this.partialMapBySim.delete(simId);
  }

  public removeSims(...simIds: string[]) {
    simIds.forEach(id => {
      this.partialMapBySim.delete(id);
    }, this);
  }

  public getCompletedUnits(): number {
    return this.completedUnits;
  }

  public incrementTurn(): void {
    const goodInstance: Good = good(this.name);
    this.partialGoods.forEach(partial => partial.completedTurns += 1);
    const completed = this.partialGoods.filter(partial => {
      return (partial.completedTurns >= goodInstance.absTurns &&
        partial.completedSimTurns >= goodInstance.simTurns);
    });

    // If completed length is > 0, then we need to remove them from the records.
    if(completed.length > 0) {
      const inProgress = this.partialGoods.filter(partial => {
        return (partial.completedTurns < goodInstance.absTurns ||
          partial.completedSimTurns < goodInstance.simTurns);
      });
      const removedIndices: number[] = completed.map(completePartial => this.partialMapById.get(completePartial.id));
      completed.forEach(completedPartial => { this.partialMapById.delete(completedPartial.id) }, this);
      this.partialMapBySim.forEach( (index, simId, map) => {
        if (removedIndices.includes(index)) {
          map.delete(simId);
        }
      }, this);

      // Now we need to re-index the remaining partials to the still-in-progress.
      const changedIndices = new Map<number, number>();
      inProgress.forEach((partial, index) => {
        changedIndices.set(this.partialMapById.get(partial.id), index);
        this.partialMapById.set(partial.id, index);
      }, this);
      this.partialMapBySim.forEach((index, simId, map) => {
        map.set(simId, changedIndices.get(index));
      });

      // Now we can fully convert
      this.partialGoods = inProgress;
      this.completedUnits += completed.length;
    }
  }

  private assignToExisting(simIds: string[], goodId: string): boolean {
    if (!this.partialMapById.has(goodId)) {
      return false;
    }

    simIds.forEach(id => {
      this.partialMapBySim.set(id, this.partialMapById.get(goodId));
    }, this);
    return true;
  }

  private assignToNew(simIds: string[]) : boolean {
    const partialGood = this.generateNewPartialGood();
    // Push returns the number of elements in the array.
    const index = this.partialGoods.push(partialGood) - 1;
    this.partialMapById.set(partialGood.id, index);
    simIds.forEach(id => {
      this.partialMapBySim.set(id, index);
    }, this);
    return true;
  }

  private generateNewPartialGood(): PartialGood {
    return {
      name: this.name,
      id: this.createUuid(),
      completedTurns: 0,
      completedSimTurns: 0,
    };
  }

  public clone(): ForgeGoodData {
    return new ForgeGoodData(this.name, this.createUuid)
      .setCompletedUnits(this.completedUnits)
      .setPartialMapBySim(this.partialMapBySim)
      .setPartialMapById(this.partialMapById)
      .setPartialGoods(this.partialGoods);
  }

  private setCompletedUnits(units: number): ForgeGoodData {
    this.completedUnits = units;
    return this;
  }

  private setPartialGoods(goods: PartialGood[]): ForgeGoodData {
    this.partialGoods = [...goods];
    return this;
  }

  private setPartialMapBySim(partialMap: Map<string, number>): ForgeGoodData {
    this.partialMapBySim = new Map(partialMap);
    return this;
  }

  private setPartialMapById(partialMap: Map<string, number>): ForgeGoodData {
    this.partialMapById = new Map(partialMap);
    return this;
  }
}
