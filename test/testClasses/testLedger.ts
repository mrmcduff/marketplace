import { Ledger } from '../../src/ledger/ledger';
import { Exchange, ExchangeRecord, Sale, SalesRecord } from '../../src/market/interfaces';

export class TestLedger implements Ledger {

  functionObject: any;

  constructor(initializer: {
    mockRecordBids?: (turn: number, bids: Exchange[]) => void,
    mockRecordListings?: (turn: number, listings: Exchange[]) => void,
    mockRecordSales?: (turn: number, sales: Sale[]) => void,
    mockGetSalesRecords?: (length?: number) => SalesRecord[],
    mockGetSalesRecord?: (turn: number) => SalesRecord,
    mockGetBids?: (length?: number) => ExchangeRecord[],
    mockGetBidRecord?: (turn: number) => ExchangeRecord,
    mockGetListings?: (length?: number)=> ExchangeRecord[],
    mockGetListingRecord?: (turn: number) => ExchangeRecord,
  }) {
    this.functionObject = initializer;
  }

  recordBids(turn: number, bids: Exchange[]): void {
    if (this.functionObject.mockRecordBids) {
      return this.functionObject.mockRecordBids(turn, bids);
    }
  }

  recordListings(turn: number, listings: Exchange[]): void {
    if (this.functionObject.mockRecordListings) {
      return this.functionObject.mockRecordListings(turn, listings);
    }
  }
  
  recordSales(turn: number, sales: Sale[]): void {
    if (this.functionObject.mockRecordSales) {
      return this.functionObject.mockRecordSales(turn, sales);
    }
  }

  getSalesRecords(length?: number) : SalesRecord[] {
    if (this.functionObject.mockGetSalesRecords) {
      return this.functionObject.mockGetSalesRecords(length);
    }
    return null;
  }

  getSalesRecord(turn: number): SalesRecord {
    if (this.functionObject.mockGetSalesRecord) {
      return this.functionObject.mockGetSalesRecord(turn);
    }
    return null;
  }

  getBids(length?: number): ExchangeRecord[] {
    if (this.functionObject.mockGetBids) {
      return this.functionObject.mockGetBids(length);
    }
    return null;
  }

  getBidRecord(turn: number): ExchangeRecord {
    if (this.functionObject.mockGetBidRecord) {
      return this.functionObject.mockGetBidRecord(turn);
    }
    return null;
  }

  getListings(length?: number): ExchangeRecord[] {
    if (this.functionObject.mockGetListings) {
      return this.functionObject.mockGetListings(length);
    }
    return null;
  }

  getListingRecord(turn: number): ExchangeRecord {
    if (this.functionObject.mockGetListingRecord) {
      return this.functionObject.mockGetListingRecord(turn);
    }
    return null;
  }

}
