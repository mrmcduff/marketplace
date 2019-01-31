import { ConsumerStrategyStyle, buildConsumerStrategy } from '../../../src/market/factories/consumerStrategyFactory';
import { ConsumerStrategy, RawConsumerStrategy, RandomConsumerStrategy, HistoricalRandomConsumerStrategy } from '../../../src/market/strategies/consumer';

let strategy: ConsumerStrategy;

describe('ConsumerStrategyFactory build tests', () => {
  it('returns null for unknown type', () => {
    expect(buildConsumerStrategy(ConsumerStrategyStyle.UNKNOWN)).toBeNull();
  });

  it('builds raw consumer strategy factory as expected', () => {
    strategy = buildConsumerStrategy(ConsumerStrategyStyle.RAW);
    expect(strategy instanceof RawConsumerStrategy).toBeTruthy();
  });

  it('returns null if no consumer params given for random or historical strategies', () => {
    expect(buildConsumerStrategy(ConsumerStrategyStyle.RANDOM)).toBeNull();
    expect(buildConsumerStrategy(ConsumerStrategyStyle.HISTORICAL_RANDOM)).toBeNull();
  });

  it('builds a Random strategy with or without random params', () => {
    strategy = buildConsumerStrategy(ConsumerStrategyStyle.RANDOM,
      { name: 'foo', basePrice: 10, baseBidQuantity: 5, baseQuantity: 5});
    expect(strategy).toBeTruthy();
    expect(strategy instanceof RandomConsumerStrategy).toBeTruthy();

    strategy = buildConsumerStrategy(ConsumerStrategyStyle.RANDOM,
      { name: 'foo', basePrice: 10, baseBidQuantity: 5, baseQuantity: 5},
      { priceRange: 3, quantityRange: 5, bidQuantityRange: 10 });
    expect(strategy).toBeTruthy();
    expect(strategy instanceof RandomConsumerStrategy).toBeTruthy();
  });

  it('returns null if trying to build a historical strategy without random params or historical params', () =>{
    strategy = buildConsumerStrategy(ConsumerStrategyStyle.HISTORICAL_RANDOM,
      { name: 'foo', basePrice: 10, baseBidQuantity: 5, baseQuantity: 5 });
    expect(strategy).toBeNull();

    strategy = buildConsumerStrategy(ConsumerStrategyStyle.HISTORICAL_RANDOM,
      { name: 'foo', basePrice: 10, baseBidQuantity: 5, baseQuantity: 5 },
      { priceRange: 3, quantityRange: 5, bidQuantityRange: 10 });
    expect(strategy).toBeNull();
  });

  it('returns a historical random strategy if consumer, random, and historical params are all present', () => {
    strategy = buildConsumerStrategy(ConsumerStrategyStyle.HISTORICAL_RANDOM,
      { name: 'foo', basePrice: 10, baseBidQuantity: 5, baseQuantity: 5 },
      { priceRange: 3, quantityRange: 5, bidQuantityRange: 10 },
      { salesTurns: 2, bidTurns: 1, listingTurns: 5 });
    expect(strategy).toBeTruthy();
    expect(strategy instanceof HistoricalRandomConsumerStrategy).toBeTruthy();
  });
});
