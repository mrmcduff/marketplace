import { SimEvaluationStrategy } from "./simEvaluationStrategy";
import { Sim } from "../../sims";
import { GoodName } from "../../goods";

export class HalfEvaluationStrategy implements SimEvaluationStrategy {

  public evaluateSimTurns(sim: Sim, good: GoodName) : number {
    return sim.hasCertification(good) ? 1 : 0.5;
  }

}
