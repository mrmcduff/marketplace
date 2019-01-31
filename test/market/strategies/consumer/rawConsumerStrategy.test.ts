import RawConsumerStrategy from '../../../../src/market/strategies/consumer/rawConsumerStrategy';
import TestLedger from '../../../testClasses/testLedger';
import Ledger from '../../../../src/ledger/ledger';
import ConsumerStrategy from '../../../../src/market/strategies/consumer/consumerStrategy';

let ledger: Ledger;
let strategy: ConsumerStrategy;

describe('Raw consumer strategy test', () => {
  beforeEach(() => {
    strategy = new RawConsumerStrategy();
    ledger = new TestLedger({});
  });

  it('Returns an empty array', () => {
    expect(strategy.generateConsumerBids(ledger)).toEqual([]);
  });
});
