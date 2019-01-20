
class Market {

  constructor(price) {
    this.price = price;
    this.listings = {};
    this.offers = {};
  }

  list(listing) {
    if (!listing || !listing.sellerId || !listing.value) {
      return false;
    }

    let quantity = listing.quantity ? listing.quantity : 1;
    if (this.listings[listing.sellerId]) {
      quantity += this.listings[listing.sellerId].quantity;
    }

    this.listings[listing.sellerId] = {
      quantity,
      value: listing.value,
    };

    return this.listings[listing.sellerId];
  }

  offer(bid) {
    if (!bid || !bid.buyerId || !buyer.value) {
      return false;
    }
    let quantity = bid.quantity ? bid.quantity : 1;
    if (this.offers[bid.buyerId]) {
      quantity += this.offers[bid.buyerId].quantity;
    }

    this.offers[bid.buyerId] = {
      quantity,
      value: bid.value,
    };
    return this.offers[bid.buyerId];
  }
}

module.exports = Market;
