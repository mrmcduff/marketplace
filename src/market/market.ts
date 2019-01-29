import { Exchange, Sale, SalesRecord } from './interfaces';
import Ledger from '../ledger/ledger';
import SettlementStrategy from './strategies/settlementStrategy';
import SingleSidedSettlementStrategy from './strategies/singleSidedSettlementStrategy';

export default class Market {

  price: number;
  good: string;
  turn: number;
  offers: Map<string, Exchange>;
  listings: Map<string, Exchange>;
  ledger: Ledger;
  settlementStrategy: SettlementStrategy;

  constructor(
    price: number,
    good: string,
    startIndex: number,
    ledger: Ledger,
    settlementStrategy: SettlementStrategy) {
    this.price = price;
    this.good = good;
    this.listings = new Map();
    this.offers = new Map();
    this.turn = startIndex ? startIndex: 0;
    this.ledger = ledger;
    this.settlementStrategy = settlementStrategy;
  }

  list(listing: Exchange) : Exchange {
    if (!listing) {
      return null;
    }
    this.listings[listing.id] = {...listing};
    return this.listings[listing.id];
  }

  offer(bid: Exchange) : Exchange {
    if (!bid) {
      return null;
    }
    this.offers[bid.id] = {...bid};
    return this.offers[bid.id];                                     
  }

  settle() {
    const sortedBids = this.orderByValue(this.offers);
    const sortedListings = this.orderByValue(this.listings);
    this.ledger.recordBids(this.turn, sortedBids);
    this.ledger.recordListings(this.turn, sortedListings);
    const sales: Sale[] = this.settlementStrategy.makeSales(sortedBids, sortedListings);
    this.ledger.recordSales(this.turn, sales);
    this.evaluateEstimates();
    return sales;
  }

  evaluateEstimates() {

  }

  orderByValue(itemMap: Map<string, Exchange>): Exchange[] {
    const items = Object.keys(itemMap).map( id => {
      return {...itemMap[id]}
    });
    items.sort((a, b) => b.value - a.value );
    return items;
  }
}
