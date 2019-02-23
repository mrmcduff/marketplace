import { TrainingStrategy } from "./trainingStrategy";
import { Sim } from "../../sims";
import { SimAssignment } from "../forgeAccount";
import { GoodName } from "../../goods";

export class AlwaysTrainAndDecayStrategy extends TrainingStrategy {
  trainAndDecaySim(sim: Sim, assignment: SimAssignment) {
    if (assignment === 'none') {
      sim.decayExcept('dollar', this.decayFactor);
    } else {
      const good: GoodName = assignment as GoodName;
      sim.decayExcept(good, this.decayFactor);
      sim.trainCertification(good, this.trainingFactor);
    }
  }
}
