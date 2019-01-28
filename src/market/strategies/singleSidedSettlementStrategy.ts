import { Exchange, Sale } from '../interfaces';
import SettlementStrategy from './settlementStrategy';

export default class SingleSidedSettlementStrategy implements SettlementStrategy {

  useSellerPrice = false;
  constructor(useSellerPrice: boolean) {
    this.useSellerPrice = useSellerPrice;
  }

  makeSales(sortedBids: Exchange[], sortedListings: Exchange[]) : Sale[] {
    const sales: Sale[] = [];
    this.sortIfNecessary(sortedBids);
    this.sortIfNecessary(sortedListings);
    let bidIndex = 0;
    let listIndex = 0;
    while(bidIndex < sortedBids.length && listIndex < sortedListings.length) {
      const [ sale, bid, listing ] = this.makeSale(sortedBids[bidIndex], sortedListings[listIndex]);
      if (sale) {
        sortedBids[bidIndex].quantity = bid.quantity;
        sortedListings[listIndex].quantity = listing.quantity;
        if (bid.quantity > 0) {
          listIndex++;
        } else {
          bidIndex++;
        }
        sales.push(sale);
      } else {
        // The bid was lower than the listing price
        listIndex++;
      }
    }
    return sales;
  }

  makeSale(bid: Exchange, listing: Exchange): [ Sale, Exchange, Exchange ] {
    if (!bid || !listing || bid.value < listing.value || bid.id === listing.id) {
      return [ null, null, null ];
    }
    const quantity = Math.min(bid.quantity, listing.quantity);
    const sale = {
      price: this.useSellerPrice? listing.value : bid.value,
      quantity,
      buyerId: bid.id,
      sellerId: listing.id,
    };
    bid.quantity -= quantity;
    listing.quantity -= quantity;
    return [ sale, bid, listing ];
  }

  sortIfNecessary(exchanges: Exchange[]): void {
    if (!this.validateExchangesSortedDescendingByValue(exchanges)) {
      this.orderDescendingByValue(exchanges);
    }
  }

  validateExchangesSortedDescendingByValue(exchanges: Exchange[]): boolean {
    let value: number = Number.MAX_SAFE_INTEGER;
    for (let i = 0; i < exchanges.length; i++) {
      if (value >= exchanges[i].value) {
        value = exchanges[i].value;
        continue;
      }
      return false;
    }
    return true;
  }

  orderDescendingByValue(exchanges: Exchange[]): void {
    exchanges.sort((a, b) => b.value - a.value);
  }
}
