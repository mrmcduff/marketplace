import { Sim } from "../../sims";
import { GoodName } from "../../goods";

export interface SimEvaluationStrategy {
  evaluateSimTurns(sim: Sim, good: GoodName) : number;
}
