import { SingleSidedSettlementStrategy } from '../../../src/market/strategies/singleSidedSettlementStrategy';
import { Exchange, Sale } from '../../../src/market/interfaces';
import { SettlementStrategy } from '../../../src/market/strategies/settlementStrategy';

let strategy: SingleSidedSettlementStrategy;

describe('Single-sided settlement strategy tests', () => {
  beforeEach(() => {
    strategy = new SingleSidedSettlementStrategy(true);
  });

  it('rejects sales without a bid and a listing', () => {
    let sale: Sale;
    let bid, listing: Exchange;
    [sale, bid, listing] = strategy.makeSale(null, null);
    expect(sale).toBeNull();
    expect(bid).toBeNull();
    expect(listing).toBeNull();

    const realBid: Exchange = {
      id: 'foo',
      value: 10,
      quantity: 1,
    };

    const realListing: Exchange = {
      id: 'bar',
      value: 5,
      quantity: 2,
    };

    [sale, bid, listing] = strategy.makeSale(realBid, null);
    expect(sale).toBeNull();
    expect(bid).toBeNull();
    expect(listing).toBeNull();

    [sale, bid, listing] = strategy.makeSale(null, realListing);
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

    const [sale, resultBid, resultListing] = strategy.makeSale(bid, listing);
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

    const [sale, resultBid, resultListing] = strategy.makeSale(bid, listing);
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

    const [sale, resultBid, resultListing] = strategy.makeSale(bid, listing);
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
    const [sale, resultBid, resultListing] = strategy.makeSale(bid, listing);
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

  it('makes sales and sorts when necessary', () => {
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

    const bids: Exchange[] = [firstOffer, secondOffer, thirdOffer];
    const listings: Exchange[] = [firstListing, secondListing];

    const sales = strategy.makeSales(bids, listings);
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
  });

  it('assigns sales to seller price when told to do so', () => {
    const sellerStrategy: SettlementStrategy = new SingleSidedSettlementStrategy(false);
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

    const bids: Exchange[] = [firstOffer, secondOffer, thirdOffer];
    const listings: Exchange[] = [firstListing, secondListing];

    const sales = sellerStrategy.makeSales(bids, listings);
    expect(sales).toBeTruthy();
    expect(sales.length).toEqual(3);
    expect(sales[0].price).toEqual(22);
    expect(sales[0].buyerId).toEqual('buyer3');
    expect(sales[0].quantity).toEqual(2);
    expect(sales[0].sellerId).toEqual('seller1');

    expect(sales[1].price).toEqual(18);
    expect(sales[1].buyerId).toEqual('buyer1');
    expect(sales[1].quantity).toEqual(3);
    expect(sales[1].sellerId).toEqual('seller2');

    expect(sales[2].price).toEqual(17);
    expect(sales[2].buyerId).toEqual('buyer2');
    expect(sales[2].quantity).toEqual(2);
    expect(sales[2].sellerId).toEqual('seller2');
  });
});
