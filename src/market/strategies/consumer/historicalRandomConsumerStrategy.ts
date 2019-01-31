import { ConsumerStrategy } from './consumerStrategy';
import { Exchange, SalesRecord } from '../../interfaces';
import { Ledger } from '../../../ledger/ledger';
import { RandomParams } from './randomParams';
import { RandomConsumerStrategy } from './randomConsumerStrategy';

export type HistoricalParams = {
  salesTurns: number,
  listingTurns: number,
  bidTurns: number,
}

export class HistoricalRandomConsumerStrategy extends RandomConsumerStrategy {

  historicalParams: HistoricalParams;
  getHistoricalTotals: (salesHistory: SalesRecord[]) => [number, number, number];

  constructor(
    name: string,
    basePrice: number,
    baseQuantity: number,
    baseBidQuantity: number,
    randomParams: RandomParams,
    historicalParams: HistoricalParams,
    getHistoricalTotals: (salesHistory: SalesRecord[]) => [number, number, number],
  ) {
    super(name, basePrice, baseQuantity, baseBidQuantity, randomParams);
    this.historicalParams = historicalParams;
    this.getHistoricalTotals = getHistoricalTotals;
  }

  generateConsumerBids(ledger: Ledger): Exchange[] {
    const consumerBids: Exchange[] = [];
    const salesHistory: SalesRecord[] = ledger.getSalesRecords(this.historicalParams.salesTurns);
    const historicalTotals = this.getHistoricalTotals(salesHistory);
    const [startingPrice, startingQuantity, startingBidQuantity] = this.calculateStartingBids(historicalTotals, salesHistory);

    const bidQuantity = this.generateValue(startingBidQuantity, this.randomParams.bidQuantityRange, 0);
    let value = 0;
    let quantity = 0;
    for(let i = 0; i < bidQuantity; i++) {
      value = this.generateValue(startingPrice, this.randomParams.priceRange, 1);
      quantity = this.generateValue(startingQuantity, this.randomParams.quantityRange, 1);
      consumerBids.push({
        id: this.name,
        value,
        quantity,
      });
    }

    return consumerBids;
  }

  /**
   * 
   * @param historicalTotals A tuple: [totalVolume, totalQuanitySold, totalNumberOfSales]
   * @param salesHistory 
   */
  calculateStartingBids(historicalTotals: [number, number, number], salesHistory: SalesRecord[]): [number, number, number] {
    if (historicalTotals == null) {
      return [this.basePrice, this.baseQuantity, this.baseBidQuantity];
    }
    const startingPrice = historicalTotals[1] !== 0
      ? Math.floor(historicalTotals[0] / historicalTotals[1])
      : this.basePrice;

    const startingBidQuantity = salesHistory.length > 0
      ? Math.floor(historicalTotals[2] / salesHistory.length)
      : this.baseBidQuantity;
    
    // This is the quantity per bid, so we should divide by bid grouping size multiplied by number of bid groups
    const startingQuantity = salesHistory.length > 0 && startingBidQuantity != 0
      ? Math.floor(historicalTotals[1] / (salesHistory.length * startingBidQuantity))
      : this.baseQuantity;
    return [startingPrice, startingQuantity, startingBidQuantity];
  }
}
