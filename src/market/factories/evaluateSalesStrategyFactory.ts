import { EvaluateSalesStrategy } from '../strategies/evaluateSalesStrategy';
import { NaiveStrategy } from '../strategies/naiveStrategy';

export enum SalesStrategyType {
  NAIVE,
  UNKNOWN,
}

export function buildEvaluateSalesStrategy(strategyType: SalesStrategyType): EvaluateSalesStrategy {
  switch(strategyType) {
    case SalesStrategyType.NAIVE:
      return new NaiveStrategy();
    default:
      return null;
  }
}
