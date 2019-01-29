import EvaluateSalesStrategy from '../strategies/evaluateSalesStrategy';
import NaiveSalesStrategy from '../strategies/naiveStrategy';

export enum SalesStrategyType {
  NAIVE,
  UNKNOWN,
}

export function buildEvaluateSalesStrategy(strategyType: SalesStrategyType): EvaluateSalesStrategy {
  switch(strategyType) {
    case SalesStrategyType.NAIVE:
      return new NaiveSalesStrategy();
    default:
      return null;
  }
}
