const Market = require('../src/market');

let market;

describe('Market constructor testing', () => {
  it('builds with default arguments', () => {
    market = new Market();
    expect(market.price).toEqual(1);
    expect(market.good).toBeUndefined();
    expect(market.turn).toEqual(0);
  });

  it('accepts a given value, good, and start index', () => {
    market = new Market(5, 'hammers', 8);
    expect(market.price).toEqual(5);
    expect(market.good).toEqual('hammers');
    expect(market.turn).toEqual(8);
  });
});

describe('Market testing', () => {
  beforeEach(() => {
    market =  new Market(10, 'widgets');
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

  it('uses the default quantity', () => {
    const listing = {
      id: 'foo',
      value: 177,
    }
    const result = market.list(listing);
    expect(result).toBeTruthy();
    expect(result.quantity).toBe(1);
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
    const bid = {
      id: 'bar',
      value: 15,
    };

    const secondBid = {
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
      id: 'bar',
      value: 15,
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
    expect(sortedList[1].quantity).toEqual(1);
  });

  it('handles tied itemlists in a deterministic fashion', () => {
    const list = {
      id: 'bar',
      value: 4,
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

  it('rejects sales without a bid and a listing', () => {
    let [sale, bid, listing] = market.makeSale(null, null);
    expect(sale).toBeNull();
    expect(bid).toBeNull();
    expect(listing).toBeNull();

    const realBid = {
      id: 'foo',
      value: 10,
      quantity: 1,
    };
    const realListing = {
      id: 'bar',
      value: 5,
      quantity: 2,
    }

    [sale, bid, listing] = market.makeSale(realBid, null);
    expect(sale).toBeNull();
    expect(bid).toBeNull();
    expect(listing).toBeNull();

    [sale, bid, listing] = market.makeSale(null, realListing);
    expect(sale).toBeNull();
    expect(bid).toBeNull();
    expect(listing).toBeNull();
  });

  it('rejects sales when the bid is lower than the listing', () => {
    const bid = {
      id: 'foo',
      value: 1,
      quantity: 1,
    };

    const listing = {
      id: 'bar',
      value: 4,
      quantity: 4,
    };

    const [sale, resultBid, resultListing] = market.makeSale(bid, listing);
    expect(sale).toBeNull();
    expect(resultBid).toBeNull();
    expect(resultListing).toBeNull();
  });

  it('rejects sales when the buyer and seller are the same', () => {
    const bid = {
      id: 'foo',
      value: 9,
      quantity: 1,
    };

    const listing = {
      id: 'foo',
      value: 4,
      quantity: 4,
    };

    const [sale, resultBid, resultListing] = market.makeSale(bid, listing);
    expect(sale).toBeNull();
    expect(resultBid).toBeNull();
    expect(resultListing).toBeNull();
  });

  it('makes a sale and updates quantities correctly', () => {
    const bid = {
      id: 'foo',
      value: 10,
      quantity: 1,
    };

    const listing = {
      id: 'bar',
      value: 4,
      quantity: 4,
    };
    const [sale, resultBid, resultListing] = market.makeSale(bid, listing);
    expect(sale).toBeTruthy();
    expect(sale.price).toEqual(4);
    expect(sale.quantity).toEqual(1);
    expect(sale.buyerId).toEqual('foo');
    expect(sale.sellerId).toEqual('bar');
    expect(resultBid).toBeTruthy();
    expect(resultBid.quantity).toEqual(0);
    expect(resultListing).toBeTruthy();
    expect(resultListing.quantity).toEqual(3);
  });

  it('makes a sale and updates when the bid offer quantity is greater', () => {
    const bid = {
      id: 'foo',
      value: 10,
      quantity: 3,
    };

    const listing = {
      id: 'bar',
      value: 7,
      quantity: 2,
    };
    const [sale, resultBid, resultListing] = market.makeSale(bid, listing);
    expect(sale).toBeTruthy();
    expect(sale.price).toEqual(7);
    expect(sale.quantity).toEqual(2);
    expect(sale.buyerId).toEqual('foo');
    expect(sale.sellerId).toEqual('bar');
    expect(resultBid).toBeTruthy();
    expect(resultBid.quantity).toEqual(1);
    expect(resultListing).toBeTruthy();
    expect(resultListing.quantity).toEqual(0);
  });
});

describe('Market settling tests', () => {
  it('returns sales', () => {
    market = new Market();
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
    const sales = market.settle();
    expect(sales).toBeTruthy();
    expect(sales.length).toEqual(3);
    expect(sales[0].price).toEqual(20);
    expect(sales[0].buyerId).toEqual('buyer3');
    expect(sales[0].quantity).toEqual(2);
    expect(sales[0].sellerId).toEqual('seller1');

    expect(sales[1].price).toEqual(17);
    expect(sales[1].buyerId).toEqual('buyer1');
    expect(sales[1].quantity).toEqual(3);
    expect(sales[1].sellerId).toEqual('seller2');

    expect(sales[2].price).toEqual(17);
    expect(sales[2].buyerId).toEqual('buyer2');
    expect(sales[2].quantity).toEqual(2);
    expect(sales[2].sellerId).toEqual('seller2');

    expect(market.salesHistory.length).toEqual(1);
    expect(market.salesHistory[0].sales).toBeTruthy();
    expect(market.salesHistory[0].sales.length).toEqual(3);
    expect(market.salesHistory[0].sales[0]).not.toBe(sales[0]);
  });
});
