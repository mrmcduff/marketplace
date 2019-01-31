import { ConsumerStrategy } from "../../src/market/strategies/consumer";
import { Ledger } from "../../src/ledger/ledger";
import { Exchange } from "../../src/market/interfaces";

export class TestConsumerStrategy implements ConsumerStrategy {

  functionObject: any;

  constructor(initializer: {
    mockGenerateConsumerBids?: (ledger: Ledger) => Exchange[]
  }) {
    this.functionObject = initializer;
  }

  generateConsumerBids(ledger: Ledger): Exchange[] {
    if (this.functionObject.mockGenerateConsumerBids) {
      return this.functionObject.mockGenerateConsumerBids(ledger);
    }
    return null;
  }
}
