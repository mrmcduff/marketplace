import { GoodName, good, Good } from "../goods";
import { PartialWorkerGood } from "./partialWorkerGood";

export class ForgeWorkerGoodData {
  readonly name: GoodName;
  private completedUnits: number;
  private partialGoods: PartialWorkerGood[];
  private partialMapByWorker: Map<string, number>;
  private partialMapById: Map<string, number>;

  private createUuid: () => string;

  constructor(name: GoodName,
    createUuid: () => string) {
    this.name = name;
    this.completedUnits = 0;
    this.partialGoods = [];
    this.partialMapByWorker = new Map<string, number>();
    this.partialMapById = new Map<string, number>();
    this.createUuid = createUuid;
  }

  public assign(workerId: string, goodId?: string): boolean {
    if (goodId) {
      return this.assignToExisting([workerId], goodId);
    }
    return this.assignToNew([workerId]);
  }

  public assignGroup(workers: string[], goodId?: string): boolean {
    if (goodId) {
      return this.assignToExisting(workers, goodId);
    }
    return this.assignToNew(workers);
  }

  public addWorkerInput(workerId: string, workerTurns: number): boolean {
    if (!this.partialMapByWorker.has(workerId)) {
      return false;
    }
    const partialGood = this.partialGoods[this.partialMapByWorker.get(workerId)];
    if (!partialGood) {
      return false;
    }
    partialGood.completedWorkerTurns += workerTurns;
    return true;
  }

  public inquirePartialGoods(): PartialWorkerGood[] {
    return [...this.partialGoods];
  }

  public inquireWorkerAssignments(): Map<string, string> {
    const workerToGoodIdMap = new Map<string, string>();
    this.partialMapByWorker.forEach((index, workerId) => {
      workerToGoodIdMap.set(workerId, this.partialGoods[index].id);
    }, this);
    return workerToGoodIdMap;
  }

  public removeWorker(workerId: string): boolean {
    return this.partialMapByWorker.delete(workerId);
  }

  public removeWorkers(...workerIds: string[]) {
    workerIds.forEach(id => {
      this.partialMapByWorker.delete(id);
    })
  }

  public incrementTurn() {
    const goodInstance: Good = good(this.name);
    this.partialGoods.forEach(partial => partial.completedTurns += 1);
    const completed = this.partialGoods.filter(partial => {
      return (partial.completedTurns >= goodInstance.absTurns &&
        partial.completedWorkerTurns >= goodInstance.workerTurns);
    });

    // If completed length is > 0, then we need to remove them from the records.
    if(completed.length > 0) {
      const inProgress = this.partialGoods.filter(partial => {
        return (partial.completedTurns < goodInstance.absTurns ||
          partial.completedWorkerTurns < goodInstance.workerTurns);
      });
      const removedIndices: number[] = completed.map(completePartial => this.partialMapById.get(completePartial.id));
      completed.forEach(completedPartial => { this.partialMapById.delete(completedPartial.id) }, this);
      this.partialMapByWorker.forEach( (index, workerId, map) => {
        if (removedIndices.includes(index)) {
          map.delete(workerId);
        }
      }, this);

      // Now we need to re-index the remaining partials to the still-in-progress.
      const changedIndices = new Map<number, number>();
      inProgress.forEach((partial, index) => {
        changedIndices.set(this.partialMapById.get(partial.id), index);
        this.partialMapById.set(partial.id, index);
      }, this);
      this.partialMapByWorker.forEach((index, workerId, map) => {
        map.set(workerId, changedIndices.get(index));
      });

      // Now we can fully convert
      this.partialGoods = inProgress;
    }
  }

  private assignToExisting(workerIds: string[], goodId: string): boolean {
    if (!this.partialMapById.has(goodId)) {
      return false;
    }

    workerIds.forEach(id => {
      this.partialMapByWorker.set(id, this.partialMapById.get(goodId));
    }, this);
    return true;
  }

  private assignToNew(workerIds: string[]) : boolean {
    const partialGood = this.generateNewPartialGood();
    // Push returns the number of elements in the array.
    const index = this.partialGoods.push(partialGood) - 1;
    this.partialMapById.set(partialGood.id, index);
    workerIds.forEach(id => {
      this.partialMapByWorker.set(id, index);
    }, this);
    return true;
  }

  private generateNewPartialGood(): PartialWorkerGood {
    return {
      name: this.name,
      id: this.createUuid(),
      completedTurns: 0,
      completedWorkerTurns: 0,
    };
  }

  public clone(): ForgeWorkerGoodData {
    return new ForgeWorkerGoodData(this.name, this.createUuid)
      .setCompletedUnits(this.completedUnits)
      .setPartialMapByWorker(this.partialMapByWorker)
      .setPartialMapById(this.partialMapById)
      .setPartialGoods(this.partialGoods);
  }

  private setCompletedUnits(units: number): ForgeWorkerGoodData {
    this.completedUnits = units;
    return this;
  }

  private setPartialGoods(goods: PartialWorkerGood[]): ForgeWorkerGoodData {
    this.partialGoods = [...goods];
    return this;
  }

  private setPartialMapByWorker(partialMap: Map<string, number>): ForgeWorkerGoodData {
    this.partialMapByWorker = new Map(partialMap);
    return this;
  }

  private setPartialMapById(partialMap: Map<string, number>): ForgeWorkerGoodData {
    this.partialMapById = new Map(partialMap);
    return this;
  }
}
