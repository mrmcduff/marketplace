import { Exchange, Sale, SalesRecord, ExchangeRecord } from '../market/interfaces';

export abstract class Ledger {
  
  abstract recordBids(turn: number, bids: Exchange[]): void;
  abstract recordListings(turn: number, listings: Exchange[]): void;
  abstract recordSales(turn: number, sales: Sale[]): void;

  abstract getSalesRecords(length?: number) : SalesRecord[];
  abstract getSalesRecord(turn: number): SalesRecord;
  abstract getBids(length?: number): ExchangeRecord[];
  abstract getBidRecord(turn: number): ExchangeRecord;
  abstract getListings(length?: number): ExchangeRecord[];
  abstract getListingRecord(turn: number): ExchangeRecord;
}
