import { HistoricalRandomConsumerStrategy, RandomParams, HistoricalParams } from '../../../../src/market/strategies/consumer';

describe('Constructor tests for HistoricalRandomConsumerStrategy', () => {

  it('has its super properties', () => {
    const randomParams: RandomParams = {
      priceRange: 5,
      quantityRange: 2,
      bidQuantityRange: 2,
    };

    const historicalParams: HistoricalParams = {
      salesTurns: 1,
      listingTurns: 0,
      bidTurns: 0,
    };

    const strategy = new HistoricalRandomConsumerStrategy('foo', 10, 3, 2, randomParams, historicalParams);
    expect(strategy).toBeTruthy();
  });
});
