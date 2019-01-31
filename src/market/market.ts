import { Exchange, Sale, SalesRecord } from './interfaces';
import { Ledger } from '../ledger/ledger';
import { SettlementStrategy } from './strategies/settlementStrategy';
import { EvaluateSalesStrategy } from './strategies/evaluateSalesStrategy';
import { ConsumerStrategy } from './strategies/consumer';

export class Market {

  estimatedPrice: number;
  estimatedQuantity: number;
  good: string;
  turn: number;
  offers: Map<string, Exchange>;
  listings: Map<string, Exchange>;
  ledger: Ledger;
  settlementStrategy: SettlementStrategy;
  evaluateSalesStrategy: EvaluateSalesStrategy;
  consumerStrategy: ConsumerStrategy;

  constructor(
    initialPrice: number,
    initialQuantity: number,
    good: string,
    startIndex: number,
    ledger: Ledger,
    settlementStrategy: SettlementStrategy,
    evaluateSalesStrategy: EvaluateSalesStrategy,
    consumerStrategy: ConsumerStrategy
    ) {
    this.estimatedPrice = initialPrice;
    this.estimatedQuantity = initialQuantity;
    this.good = good;
    this.listings = new Map();
    this.offers = new Map();
    this.turn = startIndex ? startIndex: 0;
    this.ledger = ledger;
    this.settlementStrategy = settlementStrategy;
    this.evaluateSalesStrategy = evaluateSalesStrategy;
    this.consumerStrategy = consumerStrategy;
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
    const consumerBids = this.consumerStrategy.generateConsumerBids(this.ledger);
    consumerBids.forEach(bid => {
      this.offer(bid);
    });
    const sortedBids = this.orderByValue(this.offers);
    const sortedListings = this.orderByValue(this.listings);
    this.ledger.recordBids(this.turn, sortedBids);
    this.ledger.recordListings(this.turn, sortedListings);
    const sales: Sale[] = this.settlementStrategy.makeSales(sortedBids, sortedListings);
    this.ledger.recordSales(this.turn, sales);
    this.evaluateEstimates();
    this.turn += 1;
    return sales;
  }

  evaluateEstimates() {
    [this.estimatedPrice, this.estimatedQuantity] = this.evaluateSalesStrategy.evaluateSales(this.ledger);
  }

  orderByValue(itemMap: Map<string, Exchange>): Exchange[] {
    const items = Object.keys(itemMap).map( id => {
      return {...itemMap[id]}
    });
    items.sort((a, b) => b.value - a.value );
    return items;
  }
}
