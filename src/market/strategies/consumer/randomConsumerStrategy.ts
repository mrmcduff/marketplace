import { ConsumerStrategy } from "./consumerStrategy";
import { Exchange } from "../../interfaces";
import { getRandomIntInclusive } from '../../utils/random';
import { Ledger } from '../../../ledger/ledger';
import { RandomParams } from './randomParams';
import { ConsumerParams } from "./consumerParams";

export class RandomConsumerStrategy implements ConsumerStrategy {

  public consumerParams: ConsumerParams;
  public randomParams: RandomParams;

  constructor(
    consumerParams: ConsumerParams,
    randomParams?: RandomParams
    ) {
    this.consumerParams = consumerParams;
    if (randomParams) {
      this.randomParams = randomParams;
    } else {
      this.randomParams = {
        priceRange: Math.floor(this.consumerParams.basePrice / 2),
        quantityRange: this.consumerParams.baseQuantity,
        bidQuantityRange: this.consumerParams.baseBidQuantity,
      }
    }
  }

  generateConsumerBids(ledger: Ledger): Exchange[] {
    const consumerBids: Exchange[] = [];
    let bidQuantity = this.generateValue(this.consumerParams.baseBidQuantity, this.randomParams.bidQuantityRange, 0);

    let quantity;
    let value;
    for (let i = 0; i < bidQuantity; i++) {
      quantity = this.generateValue(this.consumerParams.baseQuantity, this.randomParams.quantityRange, 1);
      value = this.generateValue(this.consumerParams.basePrice, this.randomParams.priceRange, 1);
      consumerBids.push({ id: this.consumerParams.name, quantity, value });
    }
    return consumerBids;
  }

  generateValue(base: number, range: number, minimum: number): number {
    let value =  getRandomIntInclusive(base - range, base + range);
    return value >= minimum ? value : minimum;
  }
}
