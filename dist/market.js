"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Market {
    constructor(price = 1, good = '', startIndex = 0) {
        this.price = price;
        this.good = good;
        this.listings = new Map();
        this.offers = new Map();
        this.salesHistory = [];
        this.turn = startIndex ? startIndex : 0;
    }
    list(listing) {
        if (!listing) {
            return null;
        }
        this.listings[listing.id] = Object.assign({}, listing);
        return this.listings[listing.id];
    }
    offer(bid) {
        if (!bid) {
            return null;
        }
        this.offers[bid.id] = Object.assign({}, bid);
        return this.offers[bid.id];
    }
    settle() {
        const sortedBids = this.orderByValue(this.offers);
        const sortedListings = this.orderByValue(this.listings);
        const sales = [];
        const recordedSales = [];
        let bidIndex = 0;
        let listIndex = 0;
        let totalSold = 0;
        let totalSales = 0;
        while (bidIndex < sortedBids.length && listIndex < sortedListings.length) {
            const [sale, bid, listing] = this.makeSale(sortedBids[bidIndex], sortedListings[listIndex]);
            if (sale) {
                sortedBids[bidIndex].quantity = bid.quantity;
                sortedListings[listIndex].quantity = listing.quantity;
                totalSold += sale.quantity;
                totalSales += sale.quantity * sale.price;
                if (bid.quantity > 0) {
                    listIndex++;
                }
                else {
                    bidIndex++;
                }
                sales.push(sale);
                recordedSales.push(Object.assign({}, sale));
            }
            else {
                // The bid was lower than the listing price
                listIndex++;
            }
        }
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
    orderByValue(itemMap) {
        const items = Object.keys(itemMap).map(id => {
            return Object.assign({}, itemMap[id]);
        });
        items.sort((a, b) => b.value - a.value);
        return items;
    }
    makeSale(bid, listing) {
        if (!bid || !listing || bid.value < listing.value || bid.id === listing.id) {
            return [null, null, null];
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
        return [sale, bid, listing];
    }
}
exports.Market = Market;
//# sourceMappingURL=market.js.map