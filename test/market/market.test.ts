import Market from '../../src/market/market';
import { Exchange } from '../../src/market/interfaces';
import Ledger from '../../src/ledger/ledger';
import SettlementStrategy from '../../src/market/strategies/settlementStrategy';
import EvaluateSalesStrategy from '../../src/market/strategies/evaluateSalesStrategy';
import TestLedger from '../testClasses/testLedger';
import TestSettlementStrategy from '../testClasses/testSettlementStrategy';
import TestEvaluateSalesStrategy from '../testClasses/testEvaluateSalesStrategy';

let market: Market;
let settlementStrategy: SettlementStrategy;
let ledger: Ledger;
let evaluateSalesStrategy: EvaluateSalesStrategy;

let mockRecordSales;
let mockRecordBids;
let mockRecordListings;
let mockMakeSales;
let mockEvaluateSales;

describe('Market testing', () => {
  beforeEach(() => {
    mockMakeSales = jest.fn();
    mockRecordSales = jest.fn();
    mockRecordBids = jest.fn();
    mockRecordListings = jest.fn();
    mockEvaluateSales = jest.fn();
    settlementStrategy = new TestSettlementStrategy({ mockMakeSales });
    evaluateSalesStrategy = new TestEvaluateSalesStrategy({ mockEvaluateSales });
    ledger = new TestLedger({ mockRecordSales, mockRecordBids, mockRecordListings });
    market =  new Market(10, 1, 'widget', 0, ledger, settlementStrategy, evaluateSalesStrategy);
  });

  it('correctly accepts a listing', () => {
    const listing = {
      id: 'foo',
      value: 177,
      quantity: 3,
    }
    const result = market.list(listing);
    expect(result).toBeTruthy();
    expect(result.quantity).toBe(3);
    expect(result.value).toEqual(177);
  });

  it('updates the value and adds quantity', () => {
    const listing = {
      id: 'foo',
      value: 177,
      quantity: 3,
    }
    const secondListing = {
      id: 'foo',
      value: 10,
      quantity: 1
    }
    const result = market.list(listing);
    const secondResult = market.list(secondListing);
    expect(result).toBeTruthy();
    expect(secondResult).toBeTruthy();
    expect(secondResult.value).toEqual(10);
    expect(secondResult.quantity).toEqual(1);
    expect(market.listings['foo']).toBeTruthy();
    expect(market.listings['foo'].value).toEqual(10);
  });

  it('accepts a bid', () => {
    const bid = {
      id: 'bar',
      value: 15,
      quantity: 1,
    };

    const secondBid = {
      id: 'baz',
      value: 17,
      quantity: 8,
    };

    const result = market.offer(bid);
    const secondResult = market.offer(secondBid);
    expect(result).toBeTruthy();
    expect(result.quantity).toEqual(1);
    expect(result.value).toEqual(15);
    expect(secondResult).toBeTruthy();
    expect(secondResult.value).toBe(17);
    expect(secondResult.quantity).toBe(8);
  });

  it('updates bid price and quantity', () => {
    const bid: Exchange = {
      id: 'bar',
      value: 15,
      quantity: 1,
    };

    const secondBid: Exchange = {
      id: 'bar',
      value: 17,
      quantity: 8,
    };

    const result = market.offer(bid);
    const secondResult = market.offer(secondBid);
    expect(result).toBeTruthy();
    expect(result.quantity).toEqual(1);
    expect(result.value).toEqual(15);
    expect(secondResult).toBeTruthy();
    expect(secondResult.value).toBe(17);
    expect(secondResult.quantity).toBe(8);
    expect(market.offers['bar']).toBeTruthy();
    expect(market.offers['bar'].value).toBe(17);
    expect(market.offers['bar'].quantity).toBe(8);
  });

  it('rejects falsy listings', () => {
    expect(market.list(undefined)).toBeNull();
  });

  it('rejects falsy offers', () => {
    expect(market.offer(null)).toBeNull();
  });

  it('correctly orders a simple itemlist', () => {
    const bid = {
      id: 'bar',
      value: 15,
      quantity: 2,
    };

    const secondBid = {
      id: 'baz',
      value: 17,
      quantity: 8,
    };

    market.offer(bid);
    market.offer(secondBid);
    const sortedList = market.orderByValue(market.offers);
    expect(sortedList.length).toEqual(2);
    expect(sortedList[0].id).toEqual('baz');
    expect(sortedList[0].value).toEqual(17);
    expect(sortedList[1].id).toEqual('bar');
    expect(sortedList[1].quantity).toEqual(2);
  });

  it('handles tied itemlists in a deterministic fashion', () => {
    const list = {
      id: 'bar',
      value: 4,
      quantity: 1,
    };

    const secondList = {
      id: 'baz',
      value: 4,
      quantity: 8,
    };
    market.list(list);
    market.list(secondList);
    const sortedListings = market.orderByValue(market.listings);
    expect(sortedListings[0].id).toEqual('bar');
    expect(sortedListings[0].quantity).toEqual(1);
    expect(sortedListings[1].id).toEqual('baz');
    expect(sortedListings[1].quantity).toEqual(8);
  });

  it('returns sales and records history and settles using strategy', () => {
    const firstListing = {
      id: 'seller1',
      value: 20,
      quantity: 3,
    };

    const secondListing = {
      id: 'seller2',
      value: 17,
      quantity: 5,
    };

    const firstOffer = {
      id: 'buyer1',
      value: 18,
      quantity: 3,
    };

    const secondOffer = {
      id: 'buyer2',
      value: 17,
      quantity: 7,
    };

    const thirdOffer = {
      id: 'buyer3',
      value: 22,
      quantity: 2,
    };

    market.list(firstListing);
    market.list(secondListing);
    market.offer(firstOffer);
    market.offer(secondOffer);
    market.offer(thirdOffer);

    const salesArray = [{ price: 5, quantity: 5, buyerId: 'foo', sellerId: 'bar' }];
    mockMakeSales.mockReturnValueOnce(salesArray);
    mockEvaluateSales.mockReturnValueOnce([5, 6]);
    const sales = market.settle();
    expect(mockRecordBids).toHaveBeenCalled();
    expect(mockRecordListings).toHaveBeenCalled();
    expect(mockRecordSales).toHaveBeenCalledWith(0, salesArray);
    expect(mockEvaluateSales).toHaveBeenCalledWith(ledger);
    expect(market.estimatedQuantity).toEqual(6);
    expect(market.estimatedPrice).toEqual(5);
    expect(market.turn).toEqual(1);
    expect(sales).toEqual(salesArray);
  });
});
