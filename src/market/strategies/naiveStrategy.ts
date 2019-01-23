import { EvaluateSalesStrategy  } from './evaluateSalesStrategy';
import { SalesRecord } from '../interfaces';

export class NaiveStrategy implements EvaluateSalesStrategy {

  evaluateSales(records: SalesRecord[]): [number, number] {
    if (records.length === 0) {
      return [1, 0];
    }
    const lastRecord: SalesRecord = records.slice(-1)[0];
    if (lastRecord.quantity === 0) {
      return [1, 0]
    }
    return [lastRecord.volume / lastRecord.quantity, lastRecord.quantity];
  }
}
