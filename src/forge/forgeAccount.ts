import { GoodName } from "../goods";
import { ForgeGoodData } from "./forgeGoodData";
import { Sim } from "../sims";
import { TrainingStrategy, SimEvaluationStrategy } from "./strategies";

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
  private readonly trainingStrategy: TrainingStrategy;
  private readonly simEvaluationStrategy: SimEvaluationStrategy;

  constructor(id: string,
    trainingStrategy: TrainingStrategy,
    simEvaluationStrategy: SimEvaluationStrategy,
    createUuid: () => string) {
    this.id = id;
    this.createUuid = createUuid;
    this.goodData = new Map<GoodName, ForgeGoodData>();
    this.sims = [];
    this.assignments = new Map<string, SimAssignment>();
    this.trainingStrategy = trainingStrategy;
    this.simEvaluationStrategy = simEvaluationStrategy;
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
        assignment = this.assignments.get(removeSim.id);
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

      if (assignment !== 'none') {
        const forgeGoodData = this.goodData.get(assignment);
        // Note that for now, we are assuming non-null.
  
        const addedSimTurns = this.simEvaluationStrategy.evaluateSimTurns(emp, assignment);
        forgeGoodData.addSimInput(emp.id, addedSimTurns);  
      }

      this.trainingStrategy.trainAndDecaySim(emp, assignment);
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
