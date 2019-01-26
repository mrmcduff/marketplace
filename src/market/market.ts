import { Exchange, Sale, SalesRecord } from './interfaces';
import Ledger from '../ledger/ledger';

export default class Market {

  price: number;
  good: string;
  turn: number;
  offers: Map<string, Exchange>;
  listings: Map<string, Exchange>;
  salesHistory: SalesRecord[];
  ledger: Ledger;

  constructor(
    price: number,
    good: string,
    startIndex: number,
    ledger: Ledger) {
    this.price = price;
    this.good = good;
    this.listings = new Map();
    this.offers = new Map();
    this.salesHistory = [];
    this.turn = startIndex ? startIndex: 0;
    this.ledger = ledger;
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
    const sales: Sale[] = [];
    const recordedSales: Sale[] = [];
    let bidIndex = 0;
    let listIndex = 0;
    let totalSold = 0;
    let totalSales = 0;
    while(bidIndex < sortedBids.length && listIndex < sortedListings.length) {
      const [ sale, bid, listing ] = this.makeSale(sortedBids[bidIndex], sortedListings[listIndex]);
      if (sale) {
        sortedBids[bidIndex].quantity = bid.quantity;
        sortedListings[listIndex].quantity = listing.quantity;
        totalSold += sale.quantity;
        totalSales += sale.quantity * sale.price;
        if (bid.quantity > 0) {
          listIndex++;
        } else {
          bidIndex++;
        }
        sales.push(sale);
        recordedSales.push({...sale});
      } else {
        // The bid was lower than the listing price
        listIndex++;
      }
    }
    //TODO: remove salesHistory
    this.ledger.recordSales(this.turn, sales);
    this.salesHistory.push({
      turn: this.turn,
      sales: recordedSales,
      quantity: totalSold,
      volume: totalSales,
    });
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

  makeSale(bid: Exchange, listing: Exchange): [ Sale, Exchange, Exchange ] {
    if (!bid || !listing || bid.value < listing.value || bid.id === listing.id) {
      return [ null, null, null ];
    }
    const quantity = Math.min(bid.quantity, listing.quantity);
    const sale = {
      price: listing.value,
      quantity,
      buyerId: bid.id,
      sellerId: listing.id,
    };
    bid.quantity -= quantity;
    listing.quantity -= quantity;
    return [ sale, bid, listing ];
  }
}
