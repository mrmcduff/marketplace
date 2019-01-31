import { EvaluateSalesStrategy } from '../../src/market/strategies/evaluateSalesStrategy';
import { Ledger } from '../../src/ledger/ledger';

export class TestEvaluateSalesStrategy implements EvaluateSalesStrategy {

  functionObject: any;

  constructor(initializer : {
    mockEvaluateSales?: (ledger: Ledger) => [number, number],
  }) {
    this.functionObject = initializer;
  }

  evaluateSales(ledger: Ledger) : [ number, number ] {
    if (this.functionObject.mockEvaluateSales) {
      return this.functionObject.mockEvaluateSales(ledger);
    }
    return [null, null];
  }
}
