import { ConsumerStrategy } from "./consumerStrategy";
import { Exchange } from "../../interfaces";
import { getRandomIntInclusive } from '../../utils/random';
import { Ledger } from '../../../ledger/ledger';

export type RandomParams = {
  priceRange: number,
  quantityRange: number,
  bidQuantityRange: number,
}

export class RandomConsumerStrategy implements ConsumerStrategy {
  public name: string;
  public basePrice: number;
  public baseQuantity: number;
  public baseBidQuantity: number;
  public randomParams: RandomParams;

  constructor(
    name: string,
    basePrice: number,
    baseQuantity: number,
    baseBidQuantity: number,
    randomParams?: RandomParams
    ) {
    this.name = name;
    this.basePrice = basePrice;
    this.baseQuantity = baseQuantity;
    this.baseBidQuantity = baseBidQuantity;
    if (randomParams) {
      this.randomParams = randomParams;
    } else {
      this.randomParams = {
        priceRange: Math.floor(this.basePrice / 2),
        quantityRange: this.baseQuantity,
        bidQuantityRange: this.baseBidQuantity,
      }
    }
  }

  generateConsumerBids(ledger: Ledger): Exchange[] {
    const consumerBids: Exchange[] = [];
    let bidQuantity = this.generateValue(this.baseBidQuantity, this.randomParams.bidQuantityRange, 0);

    let quantity;
    let value;
    for (let i = 0; i < bidQuantity; i++) {
      quantity = this.generateValue(this.baseQuantity, this.randomParams.quantityRange, 1);
      value = this.generateValue(this.basePrice, this.randomParams.priceRange, 1);
      consumerBids.push({ id: this.name, quantity, value });
    }
    return consumerBids;
  }

  generateValue(base: number, range: number, minimum: number): number {
    let value =  getRandomIntInclusive(base - range, base + range);
    return value >= minimum ? value : minimum;
  }
}
