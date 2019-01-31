import { HistoricalRandomConsumerStrategy, RandomParams, HistoricalParams } from '../../../../src/market/strategies/consumer';
import { TestLedger } from '../../../testClasses/testLedger';
import { Exchange, SalesRecord } from '../../../../src/market/interfaces';

let mockGetSalesRecords;
let ledger: TestLedger;
let getHistoricalTotals;

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

describe('Constructor tests for HistoricalRandomConsumerStrategy', () => {

  it('can be constructed', () => {
    getHistoricalTotals = jest.fn();
    const strategy = new HistoricalRandomConsumerStrategy('foo', 10, 3, 2, randomParams, historicalParams, getHistoricalTotals);
    expect(strategy).toBeTruthy();
  });
});

describe('Functionality tests for HistoricalRandomConsumerStrategy', () => {
  let strategy: HistoricalRandomConsumerStrategy;
  beforeEach(() => {
    mockGetSalesRecords = jest.fn();
    getHistoricalTotals = jest.fn();
    ledger = new TestLedger({ mockGetSalesRecords });
    strategy = new HistoricalRandomConsumerStrategy('foo', 10, 3, 2, randomParams, historicalParams, getHistoricalTotals);
  });

  it ('Uses defaults if the totals are null', () => {
    const salesRecords: SalesRecord[] = [];
    salesRecords.push(
      {
        turn: 1,
        quantity: 4,
        volume: 40,
        sales: []
      },
      {
        turn: 2,
        quantity: 5,
        volume: 60,
        sales: [],
      },
    );
    const [startingPrice, startingQuantity, startingBidQuantity] = strategy.calculateStartingBids(null, salesRecords);
    expect(startingPrice).toEqual(10);
    expect(startingQuantity).toEqual(3);
    expect(startingBidQuantity).toEqual(2);
  });

  it ('Uses default starting price if total quantity is zero', () => {
    const salesRecords: SalesRecord[] = [];
    salesRecords.push(
      {
        turn: 1,
        quantity: 4,
        volume: 40,
        sales: []
      },
      {
        turn: 2,
        quantity: 5,
        volume: 60,
        sales: [],
      },
    );
    const [startingPrice, , ] = strategy.calculateStartingBids([40, 0, 3], salesRecords);
    expect(startingPrice).toEqual(10);
  });

  it ('Uses default starting bid quantity if sales history length is zero', () => {
    const salesRecords: SalesRecord[] = [];
    const [ , , startingBidQuantity] = strategy.calculateStartingBids([40, 0, 3], salesRecords);
    expect(startingBidQuantity).toEqual(2);
  });

  it('Uses the default starting quantity if history length is zero OR bid quantity is zero', () => {
    const salesRecords1: SalesRecord[] = [];
    const [ , startingQuantity1, ] = strategy.calculateStartingBids([40, 2, 3], salesRecords1);
    expect(startingQuantity1).toEqual(3);

    const salesRecords2: SalesRecord[] = [];
    salesRecords2.push(
      {
        turn: 1,
        quantity: 4,
        volume: 40,
        sales: []
      },
      {
        turn: 2,
        quantity: 5,
        volume: 60,
        sales: [],
      },
    );
    const [ , startingQuantity2, ] = strategy.calculateStartingBids([40, 2, 0], salesRecords2);
    expect(startingQuantity2).toEqual(3);
  });

  it('calculates expected values with plausible data', () => {
    const salesRecords: SalesRecord[] = [];
    salesRecords.push(
      {
        turn: 1,
        quantity: 4,
        volume: 40,
        sales: []
      },
      {
        turn: 2,
        quantity: 5,
        volume: 60,
        sales: [],
      },
    );
    const [startingPrice, startingQuantity, startingBidQuantity] = strategy.calculateStartingBids([576, 48, 8], salesRecords);
    expect(startingPrice).toEqual(12);
    expect(startingQuantity).toEqual(6);
    expect(startingBidQuantity).toEqual(4);
  });

  it('generates expected bids with data', () => {
    const salesRecords: SalesRecord[] = [];
    salesRecords.push(
      {
        turn: 1,
        quantity: 4,
        volume: 40,
        sales: []
      },
      {
        turn: 2,
        quantity: 5,
        volume: 60,
        sales: [],
      },
    );
    mockGetSalesRecords.mockReturnValueOnce(salesRecords);
    getHistoricalTotals.mockReturnValueOnce([576, 48, 8]);
    const exchanges: Exchange[] = strategy.generateConsumerBids(ledger);
    expect(exchanges).toBeTruthy();
    expect(exchanges.length).toBeGreaterThanOrEqual(2);
    expect(exchanges.length).toBeLessThanOrEqual(6);
    // Our starting values will be 12 for price, 6 for quantity, and 4 for bid quantity
    // Recall that our random ranges are 5 on price, 2 on quantity, and 2 on bid quantity
    exchanges.forEach(exchange => {
      expect(exchange.id).toEqual(strategy.name);
      expect(exchange.value).toBeGreaterThanOrEqual(7);
      expect(exchange.value).toBeLessThanOrEqual(17);
      expect(exchange.quantity).toBeGreaterThanOrEqual(4);
      expect(exchange.quantity).toBeLessThanOrEqual(8);
    })
  });
});
