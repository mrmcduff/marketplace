import { NaiveStrategy } from '../../../src/market/strategies/naiveStrategy';
import { SalesRecord } from '../../../src/market/interfaces';

let strategy: NaiveStrategy;
let records: SalesRecord[];

describe('Naive Sales Evaluation Tests', () => {
  beforeEach(() => {
    strategy = new NaiveStrategy();
  });

  it('returns a default for an empty array', () => {
    records = [];
    expect(strategy.evaluateSales(records)).toEqual([1,0]);
  });

  it('returns a default in case the quantity is zero', () => {
    // this is an invalid record
    let singleRecord: SalesRecord = {
      turn: 1,
      quantity: 0,
      sales: [{price: 10, quantity: 0, buyerId: 'foo', sellerId: 'bar'}],
      volume: 20,
    };
    expect(strategy.evaluateSales([singleRecord])).toEqual([1, 0]);
  });

  it('returns the expected value from a simple record array', () => {
    let singleRecord: SalesRecord = {
      turn: 1,
      quantity: 2,
      sales: [{price: 10, quantity: 2, buyerId: 'foo', sellerId: 'bar'}],
      volume: 20,
    };
    expect(strategy.evaluateSales([singleRecord])).toEqual([10, 2]);
  });

  it('only looks at the latest record', () => {
    let first: SalesRecord = {
      turn: 1,
      quantity: 2,
      sales: [{price: 10, quantity: 2, buyerId: 'foo', sellerId: 'bar'}],
      volume: 20,
    };
    let second: SalesRecord = {
      turn: 2,
      quantity: 4,
      sales: [{price: 12, quantity: 4, buyerId: 'foo', sellerId: 'bar'}],
      volume: 48,
    };
    expect(strategy.evaluateSales([first, second])).toEqual([12, 4]);
  });
});
