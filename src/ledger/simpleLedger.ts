import { BaseLedger } from "./baseLedger";
import { Exchange, Sale, SalesRecord, ExchangeRecord } from '../market/interfaces';

export default class SimpleLedger extends BaseLedger {
  salesHistory: SalesRecord[] = [];
  bidHistory: ExchangeRecord[] = [];
  listingHistory: ExchangeRecord[] = [];

  recordBids(turn: number, bids: Exchange[]): void {
    this.copyExchangesAndRecord(turn, bids, this.bidHistory);
  }
  
  recordListings(turn: number, listings: Exchange[]): void {
    this.copyExchangesAndRecord(turn, listings, this.listingHistory);
  }

  copyExchangesAndRecord(turn: number, exchanges: Exchange[], target: ExchangeRecord[]): void {
    const copiedExchanges: Exchange[] = [];
    let totalQuantity = 0;
    let totalVolume = 0;
    exchanges.forEach(exchange => {
      exchanges.push({...exchange});
      totalQuantity += exchange.quantity;
      totalVolume += exchange.quantity * exchange.value;
    });

    target.push({
      turn,
      exchanges: copiedExchanges,
      quantity: totalQuantity,
      volume: totalVolume
    });
  }

  recordSales(turn: number, sales: Sale[]): void {
    const copiedSales: Sale[] = [];
    let totalQuantity = 0;
    let totalVolume = 0;
    sales.forEach(sale => {
      copiedSales.push({...sale});
      totalQuantity += sale.quantity;
      totalVolume += sale.quantity * sale.price;
    });
    this.salesHistory.push({
      turn,
      sales: copiedSales,
      quantity: totalQuantity,
      volume: totalVolume,
    });
  }

  getSalesRecords(length: number = 1) : SalesRecord[] {
    if (this.salesHistory.length === 0) {
      return [];
    }
    const copiedRecords: SalesRecord[] = [];
    return copiedRecords;
  }

  getSalesRecord(turn: number): SalesRecord {
    return this.makeSalesRecordCopy(this.salesHistory.find(salesRecord => salesRecord.turn === turn));
  }

  makeSalesRecordCopy(record: SalesRecord): SalesRecord {
    if (record) {
      return {...record, sales: record.sales.slice()};
    }
    return null;
  }

  makeExchangeRecordCopy(record: ExchangeRecord): ExchangeRecord {
    if (record) {
      return {...record, exchanges: record.exchanges.slice()}
    }
  }

  getBids(length: number = 1): ExchangeRecord[] {
    const copiedBids: ExchangeRecord[] = [];
    for (let i = 0; i < length && i < this.bidHistory.length; i++) {
      copiedBids.unshift(this.makeExchangeRecordCopy(this.bidHistory[this.bidHistory.length - i - 1]));
    }
    return copiedBids;
  }

  getBidRecord(turn: number): ExchangeRecord {
    return this.makeExchangeRecordCopy(this.bidHistory.find(exchange => exchange.turn === turn));
  }

  getListings(length: number = 1): ExchangeRecord[] {
    const copiedListings: ExchangeRecord[] = [];
    for (let i = 0; i < length && i < this.listingHistory.length; i++) {
      copiedListings.unshift(this.makeExchangeRecordCopy(this.listingHistory[this.listingHistory.length - i - 1]));
    }
    return copiedListings;
  }

  getListingRecord(turn: number): ExchangeRecord {
    return this.makeExchangeRecordCopy(this.listingHistory.find(exchange => exchange.turn === turn));
  }

}
