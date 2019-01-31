import ConsumerStrategy from "./consumerStrategy";
import { Exchange } from "../../interfaces";
import Ledger from '../../../ledger/ledger';

export default class RawConsumerStrategy implements ConsumerStrategy {
  generateConsumerBids(ledger: Ledger): Exchange[] {
    return [];
  }
}
