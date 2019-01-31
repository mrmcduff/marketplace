import { Exchange } from "../../interfaces";
import { Ledger } from '../../../ledger/ledger';

export interface ConsumerStrategy {
  generateConsumerBids(ledger: Ledger): Exchange[];
}
