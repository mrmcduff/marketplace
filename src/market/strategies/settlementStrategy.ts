import { Exchange, Sale } from '../interfaces';

export default interface SettlementStrategy {

  makeSales(sortedBids: Exchange[], sortedListings: Exchange[]) : Sale[];
}
