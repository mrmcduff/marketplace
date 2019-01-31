import { Ledger } from '../../ledger/ledger';

export interface EvaluateSalesStrategy {
  /**
   * A function that should evaluate an array of sales records and
   * return a predicted price and quantity for the next turn's sales.
   * 
   * @param ledger A Ledger to read for evaluation.
   * @returns A pair of numbers in a tuple: the first representing predicted price, the second is quantity
   */
  evaluateSales(ledger: Ledger) : [ number, number ]
}
