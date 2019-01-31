import { ConsumerStrategy } from "./consumerStrategy";
import { Exchange } from "../../interfaces";
import { Ledger } from '../../../ledger/ledger';

export class RawConsumerStrategy implements ConsumerStrategy {
  generateConsumerBids(ledger: Ledger): Exchange[] {
    return [];
  }
}
