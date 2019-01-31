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

  constructor(
    name: string,
    basePrice: number,
    baseQuantity: number,
    baseBidQuantity: number,
    randomParams: RandomParams,
    historicalParams: HistoricalParams,
  ) {
    super(name, basePrice, baseQuantity, baseBidQuantity, randomParams);
    this.historicalParams = historicalParams;
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

  calculateStartingBids(historicalTotals: [number, number, number], salesHistory: SalesRecord[]): [number, number, number] {
    const startingPrice = historicalTotals !== null && historicalTotals[1] !== 0
      ? Math.floor(historicalTotals[0] / historicalTotals[1])
      : this.basePrice;

    const startingQuantity = historicalTotals !== null && salesHistory.length > 0
      ? Math.floor[historicalTotals[1] / salesHistory.length]
      : this.baseQuantity;
    
    const startingBidQuantity = historicalTotals !== null && salesHistory.length > 0
      ? Math.floor[historicalTotals[2] / salesHistory.length]
      : this.baseBidQuantity;
    
    return [startingPrice, startingQuantity, startingBidQuantity];
  }

  getHistoricalTotals(salesHistory: SalesRecord[]): [number, number, number] {
    if (salesHistory.length === 0) {
      return null;
    }
    const [volume, quantity, salesQuantity] = salesHistory.reduce<[number, number, number]>(
      ([totalVolume, totalQuantity, totalSalesQuantity], salesRecord) => {
        return [totalVolume + salesRecord.volume,
          totalQuantity + salesRecord.quantity,
          totalSalesQuantity + salesRecord.sales.length];
      }, [0, 0, 0]);
  }
}
