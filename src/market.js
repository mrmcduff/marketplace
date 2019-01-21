
class Market {

  constructor(price, good, startIndex) {
    this.price = price ? price : 1;
    this.good = good;
    this.listings = {};
    this.offers = {};
    this.salesHistory = [];
    this.turn = startIndex ? startIndex: 0;
  }

  list(listing) {
    if (!listing || !listing.id || !listing.value) {
      return null;
    }

    let quantity = listing.quantity ? listing.quantity : 1;

    this.listings[listing.id] = {
      quantity,
      value: listing.value,
    };

    return this.listings[listing.id];
  }

  offer(bid) {
    if (!bid || !bid.id || !bid.value) {
      return null;
    }

    let quantity = bid.quantity ? bid.quantity : 1;

    this.offers[bid.id] = {
      quantity,
      value: bid.value,
    };
    return this.offers[bid.id];                                     
  }

  settle() {
    const sortedBids = this.orderByValue(this.offers);
    const sortedListings = this.orderByValue(this.listings);
    const sales = [];
    const recordedSales = [];
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
        recordedSales.push({...sale});
      } else {
        // The bid was lower than the listing price
        listIndex++;
      }
    }
    this.salesHistory.push({
      turn: this.turn,
      sales: recordedSales,
    });
    return sales;
  }

  orderByValue(itemMap) {
    const items = Object.keys(itemMap).map( id => {
      return { id, ...itemMap[id]}
    });
    items.sort((a, b) => b.value - a.value );
    return items;
  }

  makeSale(bid, listing) {
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

module.exports = Market;
