import { GoodName } from "../goods";
import { ForgeWorkerGoodData } from "./forgeWorkerGoodData";
import { Worker } from "../workers";

export type WorkerAssignment = GoodName | 'none';
/**
 * Represents the worker-based version of forge accounts.
 * Planned to replace ForgeAccounts.
 */
export class ForgeWorkerAccount {

  readonly id: string;
  private readonly goodData: Map<GoodName, ForgeWorkerGoodData>;
  private readonly workers: Worker[];
  private readonly assignments: Map<string, WorkerAssignment>;
  private createUuid: () => string;

  constructor(id: string,
    createUuid: () => string) {
    this.id = id;
    this.createUuid = createUuid;
    this.goodData = new Map<GoodName, ForgeWorkerGoodData>();
    this.workers = [];
  }

  public addWorkers(employees: Worker[], assignment?: WorkerAssignment) {
    const empAssignment: WorkerAssignment = assignment ? assignment : 'none';
    employees.forEach(emp => {
      this.workers.push(emp);
      this.assignWorker(emp.id, empAssignment);
    });
  }
  
  public assignWorker(workerId: string, assignment: WorkerAssignment) {
    const foundWorker: Worker = this.workers.find(wrk => wrk.id === workerId);
    if (foundWorker) {
      this.removeAssignment(foundWorker.id);
      this.assignments.set(foundWorker.id, assignment);
      if (assignment !== 'none') {
        this.addWorkerToGoodData(foundWorker.id, assignment);
      }
    }
  }

  public removeWorkers(...toRemove: string[]) {
    let removeIndex = -1;
    let removeWorker: Worker = null;
    let assignment: WorkerAssignment;
    let goodWorkerData: ForgeWorkerGoodData;
    toRemove.forEach(removableId => {
      removeIndex = this.workers.findIndex(wrkr => wrkr.id === removableId);
      if (removeIndex >= 0) {
        [removeWorker] = this.workers.splice(removeIndex);
        assignment = this.assignments.get(removeWorker.id) || 'none';
        this.assignments.delete(removeWorker.id);
        if (assignment !== 'none') {
          goodWorkerData = this.goodData.get(assignment);
          goodWorkerData.removeWorker(removeWorker.id);
        }
      }
    });
  }

  public incrementTurn(): void {
    this.workers.forEach(emp => {
      const assignment = this.assignments.get(emp.id);
      if (!assignment || assignment === 'none') {
        return;
      }

      const forgeGoodData = this.goodData.get(assignment);
      if (!forgeGoodData) {
        return;
      }

      // Need to get a ForgeTurnStrategy & AccountTrainingStrategy here to get the worker output
      // And also update the worker's training/decay.
    });
  }

  public inquireWorkers(): Worker[] {
    return this.workers.map<Worker>(worker => worker.clone());
  }

  public inquireGoodData(item: GoodName) : ForgeWorkerGoodData {
    const data = this.goodData.get(item);
    if (!data) {
      return null;
    }
    return data.clone();
  }

  private removeAssignment(workerId: string) {
    const previousAssignment = this.assignments.get(workerId);
    if (previousAssignment !== 'none') {
      const previousGoodData = this.goodData.get(previousAssignment);
      if (previousGoodData) {
        previousGoodData.removeWorker(workerId);
      }
    }
  }

  private addWorkerToGoodData(workerId: string, name: GoodName) {
    let existingData = this.goodData.get(name);
    if (!existingData) {
      existingData = this.createWorkerGoodData(name);
    }
    existingData.assign(workerId);
  }

  private createWorkerGoodData(name: GoodName): ForgeWorkerGoodData {
    return new ForgeWorkerGoodData(name, this.createUuid);
  }
}
