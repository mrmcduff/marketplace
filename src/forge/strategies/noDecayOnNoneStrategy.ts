import { TrainingStrategy } from "./trainingStrategy";
import { Sim } from "../../sims";
import { SimAssignment } from "../forgeAccount";
import { GoodName } from "../../goods";

export class NoDecayOnNoneStrategy extends TrainingStrategy {
  trainAndDecaySim(sim: Sim, assignment: SimAssignment) {
    if (assignment === 'none') {
      return;
    } else {
      const good: GoodName = assignment as GoodName;
      sim.decayExcept(good, this.decayFactor);
      sim.trainCertification(good, this.trainingFactor);
    }
  }
}
