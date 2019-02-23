import { SimEvaluationStrategy } from "./simEvaluationStrategy";
import { Sim } from "../../sims";
import { GoodName } from "../../goods";

export class DoubleEvaluationStrategy implements SimEvaluationStrategy {

  public evaluateSimTurns(sim: Sim, good: GoodName) : number {
    return sim.hasCertification(good) ? 2 : 1;
  }

}
