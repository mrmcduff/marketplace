import { Exchange, Sale } from '../interfaces';

export  interface SettlementStrategy {

  makeSales(sortedBids: Exchange[], sortedListings: Exchange[]) : Sale[];
}
