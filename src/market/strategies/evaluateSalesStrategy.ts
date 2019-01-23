import { SalesRecord } from '../interfaces/salesRecord';

export interface EvaluateSalesStrategy {
  /**
   * A function that should evaluate an array of sales records and
   * return a predicted price and quantity for the next turn's sales.
   * 
   * @param records The array of sales used for evaluation.
   * @returns A pair of numbers in a tuple: the first representing predicted price, the second is quantity
   */
  evaluateSales(records: SalesRecord[]) : [ number, number ]
}
