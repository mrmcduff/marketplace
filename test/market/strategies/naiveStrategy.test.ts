import NaiveStrategy from '../../../src/market/strategies/naiveStrategy';
import Ledger from '../../../src/ledger/ledger';
import TestLedger from '../../testClasses/testLedger';
import { SalesRecord } from '../../../src/market/interfaces';

let strategy: NaiveStrategy;
let ledger: Ledger;
let records: SalesRecord[];

let mockGetSalesRecords;

describe('Naive Sales Evaluation Tests', () => {
  beforeEach(() => {
    mockGetSalesRecords = jest.fn();
    ledger = new TestLedger({ mockGetSalesRecords });
    strategy = new NaiveStrategy();
  });

  it('returns a default for an empty array', () => {
    mockGetSalesRecords.mockReturnValueOnce([]);
    expect(strategy.evaluateSales(ledger)).toEqual([1,0]);
  });

  it('returns a default in case the quantity is zero', () => {
    // this is an invalid record
    let singleRecord: SalesRecord = {
      turn: 1,
      quantity: 0,
      sales: [{price: 10, quantity: 0, buyerId: 'foo', sellerId: 'bar'}],
      volume: 20,
    };
    mockGetSalesRecords.mockReturnValueOnce([singleRecord])
    expect(strategy.evaluateSales(ledger)).toEqual([1, 0]);
  });

  it('returns the expected value from a simple record array', () => {
    let singleRecord: SalesRecord = {
      turn: 1,
      quantity: 2,
      sales: [{price: 10, quantity: 2, buyerId: 'foo', sellerId: 'bar'}],
      volume: 20,
    };
    mockGetSalesRecords.mockReturnValueOnce([singleRecord])
    expect(strategy.evaluateSales(ledger)).toEqual([10, 2]);
  });
});
