const Market = require('./src/market/market');

const average = function(list) {
  if (!list) {
    return 0;
  }
  const sum = list.reduce((currentValue, nextValue) => currentValue + nextValue);
  return sum / list.length;
}


const first = [1, 2, 3, 4];

const avg = average(first);

const myMarket = new Market(10);
const listing = {
  sellerId: 'foo',
  value: 10,
  quantity: 3,
}
console.log(JSON.stringify(myMarket.list(listing)));
const secondListing = {
  sellerId: 'bar',
  value: 12,
}
console.log(JSON.stringify(myMarket.list(secondListing)));
const bid = {
  buyerId: 'baz',
  value: 11,
  quantity: 2,
}

const secondBid = {
  buyerId: 'zop',
  value: 15,
}
console.log(JSON.stringify(myMarket.offer(bid)));
console.log(JSON.stringify(myMarket.offer(secondBid)));
myMarket.settle();
console.log(avg);
