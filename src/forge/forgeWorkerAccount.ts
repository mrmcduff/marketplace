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

  constructor(id: string) {
    this.id = id;
    this.goodData = new Map<GoodName, ForgeWorkerGoodData>();
    this.workers = [];
  }

  public addWorkers(employees: Worker[], assignment?: WorkerAssignment) {
    const empAssignment: WorkerAssignment = assignment ? assignment : 'none';
    employees.forEach(emp => {
      this.workers.push(emp);
      this.assignments.set(emp.id, assignment);
    });
  }
  
  public assignWorker(workerId: string, assignment: WorkerAssignment) {
    const foundWorker: Worker = this.workers.find(wrk => wrk.id === workerId);
    if (foundWorker) {
      this.assignments.set(foundWorker.id, assignment);
    }
  }

  public removeWorkers(...toRemove: string[]) {
    let removeIndex = -1;
    let removeWorker: Worker = null;
    let assignment: WorkerAssignment = 'none';
    toRemove.forEach(removableId => {
      removeIndex = this.workers.findIndex(wrkr => wrkr.id === removableId);
      if (removeIndex >= 0) {
        [removeWorker] = this.workers.splice(removeIndex);
        assignment = this.assignments.get(removeWorker.id) || 'none';
        this.assignments.delete(removeWorker.id);
        
      }
    });
  }

  public inquireWorkers() {
    return this.workers.map<Worker>(worker => worker.clone());
  }

  public inquire(item: GoodName) : ForgeWorkerGoodData {
    const data = this.goodData.get(item);
    if (!data) {
      return null;
    }
    return data.clone();
  }
}
