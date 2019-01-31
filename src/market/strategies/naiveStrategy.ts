import { EvaluateSalesStrategy } from './evaluateSalesStrategy';
import { Ledger } from '../../ledger/ledger';
import { SalesRecord } from '../interfaces';

export class NaiveStrategy implements EvaluateSalesStrategy {

  evaluateSales(ledger: Ledger): [number, number] {
    const [salesRecord] = ledger.getSalesRecords();
    if (!salesRecord) {
      return [1, 0];
    }
    if (salesRecord.quantity === 0) {
      return [1, 0]
    }
    return [salesRecord.volume / salesRecord.quantity, salesRecord.quantity];
  }
}
