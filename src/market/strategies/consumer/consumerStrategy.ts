import { Exchange } from "../../interfaces";
import Ledger from '../../../ledger/ledger';

export default interface ConsumerStrategy {
  generateConsumerBids(ledger: Ledger): Exchange[];
}
