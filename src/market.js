
class Market {

  constructor(price, good) {
    this.price = price ? price : 1;
    this.good = good;
    this.listings = {};
    this.offers = {};
  }

  list(listing) {
    if (!listing || !listing.sellerId || !listing.value) {
      return null;
    }

    let quantity = listing.quantity ? listing.quantity : 1;

    this.listings[listing.sellerId] = {
      quantity,
      value: listing.value,
    };

    return this.listings[listing.sellerId];
  }

  offer(bid) {
    if (!bid || !bid.buyerId || !bid.value) {
      return null;
    }

    let quantity = bid.quantity ? bid.quantity : 1;

    this.offers[bid.buyerId] = {
      quantity,
      value: bid.value,
    };
    return this.offers[bid.buyerId];                                     
  }

  settle() {
    const sortedBids = this.orderByValue(this.offers);
    const sortedListings = this.orderByValue(this.listings);
    const sales = [];
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

  orderByValue(itemMap) {
    const items = Object.keys(itemMap).map( id => {
      return { id, ...itemMap[id]}
    });
    items.sort((a, b) => b.value - a.value );
    return items;
  }

  makeSale(bid, listing) {
    if (!bid || !listing || bid.value < listing.value) {
      return [ null, null, null ];
    }
    const quantity = Math.min(bid.quantity, listing.quantity);
    const sale = {
      price: listing.value,
      quantity,
      buyerId: bid.buyerId,
      sellerId: listing.sellerId,
    };
    bid.quantity -= quantity;
    listing.quantity -= quantity;
    return [ sale, bid, listing ];
  }
}

module.exports = Market;
