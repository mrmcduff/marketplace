import Market from '../market';

export function buildMarket(
  price: number = 1,
  good: string = '',
  startIndex: number = 0
  ): Market {
  return new Market(price, good, startIndex);
}
