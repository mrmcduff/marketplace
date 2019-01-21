const Market = require('../src/market');

let market;
describe('Market testing', () => {
  beforeEach(() => {
    market =  new Market();
  });

  it('correctly accepts a listing', () => {
    const listing = {
      sellerId: 'foo',
      value: 177,
      quantity: 3,
    }
    const result = market.list(listing);
    expect(result).toBeTruthy();
    expect(result.quantity).toBe(3);
    expect(result.value).toEqual(177);
  });

  it('uses the default quantity', () => {
    const listing = {
      sellerId: 'foo',
      value: 177,
    }
    const result = market.list(listing);
    expect(result).toBeTruthy();
    expect(result.quantity).toBe(1);
    expect(result.value).toEqual(177);
  });

  it('updates the value and adds quantity', () => {
    const listing = {
      sellerId: 'foo',
      value: 177,
      quantity: 3,
    }
    const secondListing = {
      sellerId: 'foo',
      value: 10,
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
      buyerId: 'bar',
      value: 15,
    };

    const secondBid = {
      buyerId: 'baz',
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
    const bid = {
      buyerId: 'bar',
      value: 15,
    };

    const secondBid = {
      buyerId: 'bar',
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

  it('rejects improper listings', () => {
    expect(market.list(undefined)).toBeNull();
    expect(market.list({ value: 15, quantity: 4})).toBeNull();
    expect(market.list({ buyerId: 'foo', quantity: 4})).toBeNull();
  });

  it('rejects improper offers', () => {
    expect(market.offer(0)).toBeNull();
    expect(market.offer({ value: 16, quantity: 2})).toBeNull();
    expect(market.offer({ buyerId: 'hello', quantity: 7})).toBeNull();
  });

  it('correctly orders a simple itemlist', () => {
    const bid = {
      buyerId: 'bar',
      value: 15,
    };

    const secondBid = {
      buyerId: 'baz',
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
    expect(sortedList[1].quantity).toEqual(1);
  });
});
