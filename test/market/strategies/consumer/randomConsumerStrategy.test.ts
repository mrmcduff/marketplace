import { RandomConsumerStrategy, RandomParams } from '../../../../src/market/strategies/consumer/randomConsumerStrategy';
import { TestLedger } from '../../../testClasses/testLedger';
import { Ledger } from '../../../../src/ledger/ledger';
import { Exchange } from '../../../../src/market/interfaces';

let ledger: Ledger;
let strategy: RandomConsumerStrategy;

describe('RandomConsumerStrategy constructor tests', () => {
  beforeEach(() => {
    ledger = new TestLedger({});
  });

  it('uses correct default random arguments', () => {
    const randomConsumerStrategy = new RandomConsumerStrategy('name', 10, 5, 2);

    expect(randomConsumerStrategy.randomParams).toBeTruthy();
    expect(randomConsumerStrategy.randomParams.priceRange).toEqual(5);
    expect(randomConsumerStrategy.randomParams.bidQuantityRange).toEqual(2);
    expect(randomConsumerStrategy.randomParams.quantityRange).toEqual(5);
  });

  it('accepts manually input parameters', () => {
    const randomParams: RandomParams = {
      priceRange: 777,
      quantityRange: 888,
      bidQuantityRange: 111,
    }
    const randomConsumerStrategy = new RandomConsumerStrategy('name', 10, 5, 2, randomParams);

    expect(randomConsumerStrategy.randomParams).toBeTruthy();
    expect(randomConsumerStrategy.randomParams.priceRange).toEqual(randomParams.priceRange);
    expect(randomConsumerStrategy.randomParams.bidQuantityRange).toEqual(randomParams.bidQuantityRange);
    expect(randomConsumerStrategy.randomParams.quantityRange).toEqual(randomParams.quantityRange);
  });
});

describe('RandomConsumerStrategy tests', () => {
  beforeEach(() => {
    ledger = new TestLedger({});
    strategy = new RandomConsumerStrategy('name', 10, 5, 2);
  });

  it('does not generate range lower than minimum', () => {
    // This should generate a random value between -7 and -3, then assign to the min value of 10.
    expect(strategy.generateValue(-5, 2, 10)).toEqual(10);
  });

  it('generates random numbers within the parameters', () => {
    const generatedValue = strategy.generateValue(5, 2, 2);
    expect(generatedValue).toBeLessThanOrEqual(7);
    expect(generatedValue).toBeGreaterThanOrEqual(3);
  });

  it('generates expected Exchange array with input', () => {
    // Setting the range to zero on these makes every bid the same.
    strategy.randomParams = {
      priceRange: 0,
      quantityRange: 0,
      bidQuantityRange: 0,
    };
    const expectedArray: Exchange[] = [
      {
        id: 'name',
        value: 10,
        quantity: 5,
      },
      {
        id: 'name',
        value: 10,
        quantity: 5,
      },
    ];
    expect(strategy.generateConsumerBids(ledger)).toEqual(expectedArray);
  });
});
