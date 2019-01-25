import SimpleLedger from '../../src/ledger/simpleLedger';
import { Exchange, ExchangeRecord, Sale, SalesRecord } from '../../src/market/interfaces';

let ledger: SimpleLedger;
const fooExchange: Exchange = { id: 'foo', quantity: 5, value: 10 };
const barExchange: Exchange = { id: 'bar', quantity: 7, value: 100 };
const bazExchange: Exchange = { id: 'baz', quantity: 3, value: 25 };
const zimExchange: Exchange = { id: 'zim', quantity: 1, value: 30 };
const firstSale: Sale = { buyerId: 'foo', sellerId: 'bar', quantity: 2, price: 20 };
const secondSale: Sale = { buyerId: 'bar', sellerId: 'ato', quantity: 5, price: 10 };
const thirdSale: Sale = { buyerId: 'baz', sellerId: 'inu', quantity: 10, price: 5 };
const fourthSale: Sale = { buyerId: 'zim', sellerId: 'neko', quantity: 1, price: 30 };

describe ('Simple ledger storage and retrieval tests', () => {
  beforeEach(() => {
    ledger = new SimpleLedger();
  });

  it('records listings', () => {
    const exchanges: Exchange[] = [ fooExchange, barExchange ];
    ledger.recordListings(3, exchanges);
    expect(ledger.listingHistory.length).toEqual(1);
    expect(ledger.listingHistory[0].turn).toEqual(3);
    expect(ledger.listingHistory[0].volume).toEqual(750);
    expect(ledger.listingHistory[0].quantity).toEqual(12);
    expect(ledger.listingHistory[0].exchanges.length).toEqual(2);
    expect(ledger.listingHistory[0].exchanges).not.toBe(exchanges);
    expect(ledger.listingHistory[0].exchanges[0].id).toEqual('foo');
    expect(ledger.listingHistory[0].exchanges[0]).not.toBe(fooExchange);
  });

  it('records bids', () => {
    const exchanges: Exchange[] = [ fooExchange, bazExchange ];
    ledger.recordBids(2, exchanges);
    expect(ledger.bidHistory.length).toEqual(1);
    expect(ledger.bidHistory[0].turn).toEqual(2);
    expect(ledger.bidHistory[0].volume).toEqual(125);
    expect(ledger.bidHistory[0].quantity).toEqual(8);
    expect(ledger.bidHistory[0].exchanges.length).toEqual(2);
    expect(ledger.bidHistory[0].exchanges).not.toBe(exchanges);
    expect(ledger.bidHistory[0].exchanges[0].id).toEqual('foo');
    expect(ledger.bidHistory[0].exchanges[0]).not.toBe(fooExchange);
  });

  it('records sales', () => {
    const sales: Sale[] = [ firstSale, secondSale ];
    ledger.recordSales(15, sales);
    expect(ledger.salesHistory.length).toEqual(1);
    expect(ledger.salesHistory[0].turn).toEqual(15);
    expect(ledger.salesHistory[0].volume).toEqual(90);
    expect(ledger.salesHistory[0].quantity).toEqual(7);
    expect(ledger.salesHistory[0].sales.length).toEqual(2);
    expect(ledger.salesHistory[0].sales[0].buyerId).toEqual('foo');
    expect(ledger.salesHistory[0].sales[0]).not.toBe(firstSale);
  });

  it('gets the expected listing when it contains that record', () => {
    const exchanges: Exchange[] = [ fooExchange, barExchange ];
    const moreExchanges: Exchange[] = [ bazExchange, zimExchange ];
    ledger.recordListings(2, exchanges);
    ledger.recordListings(5, moreExchanges);
    const foundRecord: ExchangeRecord = ledger.getListingRecord(2);
    expect(foundRecord).toBeTruthy();
    expect(foundRecord).not.toBe(ledger.listingHistory[0]);
    expect(foundRecord.exchanges[0].id).toEqual('foo');
    expect(foundRecord.exchanges[0]).not.toBe(fooExchange);
    expect(foundRecord.quantity).toEqual(12);
  });

  it('gets the expected bid when it contains that record', () => {
    const exchanges: Exchange[] = [ fooExchange, barExchange ];
    const moreExchanges: Exchange[] = [ bazExchange, zimExchange ];
    ledger.recordBids(3, exchanges);
    ledger.recordBids(7, moreExchanges);
    const foundRecord: ExchangeRecord = ledger.getBidRecord(7);
    expect(foundRecord).toBeTruthy();
    expect(foundRecord).not.toBe(ledger.bidHistory[1]);
    expect(foundRecord.exchanges[0].id).toEqual('baz');
    expect(foundRecord.exchanges[0]).not.toBe(bazExchange);
    expect(foundRecord.quantity).toEqual(4);
  });

  it('returns a null value when asked for an exchange that is not present', () => {
    const exchanges: Exchange[] = [ fooExchange, barExchange ];
    ledger.recordBids(3, exchanges);
    const missingRecord: ExchangeRecord = ledger.getBidRecord(5);
    expect(missingRecord).toBeFalsy();
    expect(missingRecord).toBeNull();
  });

  it('gets the expected sales record when it contains that record', () => {
    ledger.recordSales(2, [ firstSale, secondSale ]);
    ledger.recordSales(3, [ thirdSale, fourthSale ]);
    const foundRecord: SalesRecord = ledger.getSalesRecord(3);
    expect(foundRecord).toBeTruthy();
    expect(foundRecord).not.toBe(ledger.salesHistory[1]);
    expect(foundRecord.sales[0].buyerId).toEqual(thirdSale.buyerId);
    expect(foundRecord.sales[0]).not.toBe(thirdSale);
  });

  it('returns null when asked for a sales record it does not have', () => {
    ledger.recordSales(2, [ firstSale, secondSale ]);
    ledger.recordSales(3, [ thirdSale, fourthSale ]);
    const missingRecord: SalesRecord = ledger.getSalesRecord(10);
    expect(missingRecord).toBeNull();
  });

  it('returns an empty array when it has no records any number are requested', () => {
    expect(ledger.getSalesRecords(10)).toEqual([]);
    expect(ledger.getBids(2)).toEqual([]);
    expect(ledger.getListings(5000)).toEqual([]);
  });

  it('returns as many sales records as possible when too many are asked for', () => {
    ledger.recordSales(1, [ firstSale ]);
    ledger.recordSales(2, [ secondSale, thirdSale ]);
    ledger.recordSales(3, [ fourthSale ]);
    const found: SalesRecord[] = ledger.getSalesRecords(5);
    expect(found.length).toEqual(3);
    expect(found[0].turn).toEqual(1);
    expect(found[2].turn).toEqual(3);
  });

  it('returns the correct number of most recent sales', () => {
    ledger.recordSales(1, [ firstSale ]);
    ledger.recordSales(2, [ secondSale, thirdSale ]);
    ledger.recordSales(3, [ fourthSale ]);
    const found: SalesRecord[] = ledger.getSalesRecords(2);
    expect(found.length).toEqual(2);
    expect(found[0].turn).toEqual(2);
    expect(found[1].turn).toEqual(3);
  });

  it('returns the most recent sale if no number is given', () => {
    ledger.recordSales(1, [ firstSale ]);
    ledger.recordSales(2, [ secondSale, thirdSale ]);
    ledger.recordSales(3, [ fourthSale ]);
    const found: SalesRecord[] = ledger.getSalesRecords();
    expect(found.length).toEqual(1);
    expect(found[0].turn).toEqual(3);
  });

  it('returns as many exchange records as possible when too many are asked for', () => {
    ledger.recordListings(1, [ fooExchange ]);
    ledger.recordListings(2, [ barExchange, bazExchange ]);
    ledger.recordListings(3, [ zimExchange ]);
    const found: ExchangeRecord[] = ledger.getListings(5);
    expect(found.length).toEqual(3);
    expect(found[0].turn).toEqual(1);
    expect(found[2].turn).toEqual(3);
  });

  it('returns the correct number of most recent exchanges', () => {
    ledger.recordBids(1, [ bazExchange ]);
    ledger.recordBids(3, [ barExchange, fooExchange ]);
    ledger.recordBids(7, [ zimExchange ]);
    const found: ExchangeRecord[] = ledger.getBids(2);
    expect(found.length).toEqual(2);
    expect(found[0].turn).toEqual(3);
    expect(found[1].turn).toEqual(7);
  });

  it('returns the default number (one) of most recent bids', () => {
    ledger.recordBids(1, [ bazExchange ]);
    ledger.recordBids(3, [ barExchange, fooExchange ]);
    ledger.recordBids(7, [ zimExchange ]);
    const found: ExchangeRecord[] = ledger.getBids();
    expect(found.length).toEqual(1);
    expect(found[0].turn).toEqual(7);
  });

  it('returns the default number (one) of most recent listings', () => {
    ledger.recordListings(1, [ fooExchange ]);
    ledger.recordListings(2, [ barExchange, bazExchange ]);
    ledger.recordListings(3, [ zimExchange ]);
    const found: ExchangeRecord[] = ledger.getListings();
    expect(found.length).toEqual(1);
    expect(found[0].turn).toEqual(3);
  });
});
