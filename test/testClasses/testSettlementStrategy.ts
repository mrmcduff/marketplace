import { Exchange, Sale } from '../../src/market/interfaces';
import SettlementStrategy from '../../src/market/strategies/settlementStrategy';

export default class TestSettlementStrategy implements SettlementStrategy {

  functionObject: any;

  constructor(initializer: {
    mockMakeSales?: (sortedBids: Exchange[], sortedListings: Exchange[]) => Sale[],
  }) {
    this.functionObject = initializer;
  }

  makeSales(sortedBids: Exchange[], sortedListings: Exchange[]) : Sale[] {
    if (this.functionObject.mockMakeSales) {
      return this.functionObject.mockMakeSales(sortedBids, sortedListings);
    }
    return null;
  }
}
