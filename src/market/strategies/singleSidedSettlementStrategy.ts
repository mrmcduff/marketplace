import { Exchange, Sale } from '../interfaces';
import SettlementStrategy from './settlementStrategy';

export default class SingleSidedSettlementStrategy implements SettlementStrategy {

  makeSales(sortedBids: Exchange[], sortedListings: Exchange[]) : Sale[] {
    return null;
  }
}
