import { GoodName } from "../goods";
import { ForgeGoodData } from "./forgeGoodData";
import { Sim } from "../sims";

export type SimAssignment = GoodName | 'none';

/**
 * Represents the sim-based version of forge accounts.
 * Planned to replace ForgeAccounts.
 */
export class ForgeAccount {

  // TODO: Still need the ability to assign sims to specific partial goods

  readonly id: string;
  private readonly goodData: Map<GoodName, ForgeGoodData>;
  private readonly sims: Sim[];
  private readonly assignments: Map<string, SimAssignment>;
  private createUuid: () => string;

  constructor(id: string,
    createUuid: () => string) {
    this.id = id;
    this.createUuid = createUuid;
    this.goodData = new Map<GoodName, ForgeGoodData>();
    this.sims = [];
    this.assignments = new Map<string, SimAssignment>();
  }

  public addSims(employees: Sim[], assignment?: SimAssignment) {
    const empAssignment: SimAssignment = assignment ? assignment : 'none';
    employees.forEach(emp => {
      this.sims.push(emp);
      this.assignSim(emp.id, empAssignment);
    });
  }
  
  public assignSim(simId: string, assignment: SimAssignment) {
    const foundSim: Sim = this.sims.find(wrk => wrk.id === simId);
    if (foundSim) {
      this.removeAssignment(foundSim.id);
      this.assignments.set(foundSim.id, assignment);
      if (assignment !== 'none') {
        this.addSimToGoodData(foundSim.id, assignment);
      }
    }
  }

  public removeSims(...toRemove: string[]) {
    let removeIndex = -1;
    let removeSim: Sim = null;
    let assignment: SimAssignment;
    let goodSimData: ForgeGoodData;
    toRemove.forEach(removableId => {
      removeIndex = this.sims.findIndex(wrkr => wrkr.id === removableId);
      if (removeIndex >= 0) {
        [removeSim] = this.sims.splice(removeIndex, 1);
        assignment = this.assignments.get(removeSim.id) || 'none';
        this.assignments.delete(removeSim.id);
        if (assignment !== 'none') {
          goodSimData = this.goodData.get(assignment);
          goodSimData.removeSim(removeSim.id);
        }
      }
    });
  }

  public incrementTurn(): void {
    this.sims.forEach(emp => {
      const assignment = this.assignments.get(emp.id);
      if (!assignment || assignment === 'none') {
        return;
      }

      const forgeGoodData = this.goodData.get(assignment);
      // Not possible until we start completing and removing items.
      if (!forgeGoodData) {
        return;
      }

      // TODO Need to get a ForgeTurnStrategy & AccountTrainingStrategy here to get the sim output
      // And also update the sims's training/decay.
      forgeGoodData.addSimInput(emp.id, 1);
    });
  }

  public inquireSims(): Sim[] {
    return this.sims.map<Sim>(sim => sim.clone());
  }

  public inquireGoodData(item: GoodName) : ForgeGoodData {
    const data = this.goodData.get(item);
    if (!data) {
      return null;
    }
    return data.clone();
  }

  private removeAssignment(simId: string) {
    const previousAssignment = this.assignments.get(simId);
    if (previousAssignment !== 'none') {
      const previousGoodData = this.goodData.get(previousAssignment);
      if (previousGoodData) {
        previousGoodData.removeSim(simId);
      }
    }
    this.assignments.set(simId, 'none');
  }

  private addSimToGoodData(simId: string, name: GoodName) {
    let existingData = this.goodData.get(name);
    if (!existingData) {
      existingData = this.createForgeGoodData(name);
      this.goodData.set(name, existingData);
    }
    existingData.assign(simId);
  }

  private createForgeGoodData(name: GoodName): ForgeGoodData {
    return new ForgeGoodData(name, this.createUuid);
  }
}
