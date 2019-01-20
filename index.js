const Market = require('./market');

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
  sellerId: 'foo',
  value: 12,
}
console.log(JSON.stringify(myMarket.list(secondListing)));

console.log(avg);
