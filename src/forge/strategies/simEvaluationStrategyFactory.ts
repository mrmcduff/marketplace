import { DoubleEvaluationStrategy } from "./doubleEvaluationStrategy";
import { HalfEvaluationStrategy } from "./halfEvaluationStrategy";

export type SimEvaluationStrategyType = 'double' | 'half';

export function generateSimEvaluationStrategy(strategyType: SimEvaluationStrategyType) {
  switch(strategyType) {
    case 'double':
      return new DoubleEvaluationStrategy();
    case 'half':
      return new HalfEvaluationStrategy();
  }
}
