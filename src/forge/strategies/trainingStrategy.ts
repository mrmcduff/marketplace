import { Sim } from "../../sims";
import { SimAssignment } from "../forgeAccount";

export abstract class TrainingStrategy {
  protected decayFactor: number;
  protected trainingFactor: number;

  constructor() {
    this.decayFactor = 1;
    this.trainingFactor = 1;
  }

  setDecayFactor(factor: number): void {
    this.decayFactor = factor;
  }
  setTrainingFactor(factor: number): void {
    this.trainingFactor = factor;
  }

  abstract trainAndDecaySim(sim: Sim, assignment: SimAssignment): void;
}
