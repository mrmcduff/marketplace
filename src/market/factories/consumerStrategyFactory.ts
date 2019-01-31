import { 
  RandomParams,
  HistoricalParams,
  ConsumerStrategy,
  RawConsumerStrategy,
  RandomConsumerStrategy,
  ConsumerParams,
  HistoricalRandomConsumerStrategy
} from "../strategies/consumer";
import { getHistoricalTotals } from '../utils/salesHistoryUtils';

export enum ConsumerStrategyStyle {
  RAW,
  RANDOM,
  HISTORICAL_RANDOM,
  UNKNOWN,
}

export function buildConsumerStrategy(
  style: ConsumerStrategyStyle,
  consumerParams?: ConsumerParams,
  randomParams?: RandomParams,
  historicalParams?: HistoricalParams
  ) : ConsumerStrategy {
  switch(style) {
    case ConsumerStrategyStyle.RAW:
      return new RawConsumerStrategy();
    case ConsumerStrategyStyle.RANDOM:
      if (!consumerParams) {
        return null;
      }
      return new RandomConsumerStrategy(consumerParams, randomParams);
    case ConsumerStrategyStyle.HISTORICAL_RANDOM:
      if (!(consumerParams && randomParams && historicalParams)) {
        return null;
      }
      return new HistoricalRandomConsumerStrategy(consumerParams, randomParams, historicalParams, getHistoricalTotals);
  }
  return null;
}
