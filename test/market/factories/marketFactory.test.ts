import { buildMarket } from '../../../src/market/factories/marketFactory';
import { SettlementStyle } from '../../../src/market/factories/settlementStrategyFactory';
import { LedgerStyle } from '../../../src/ledger/factories/ledgerFactory';
import Market from '../../../src/market/market';

describe('Market factory tests', () => {
  it('assigns the correct values', () => {
    const market = buildMarket(10, 'widgets', 5, LedgerStyle.UNSUPPORTED, SettlementStyle.UNSUPPORTED);
    expect(market).toBeTruthy();
    expect(market.turn).toEqual(5);
    expect(market.price).toEqual(10);
    expect(market.good).toEqual('widgets');
    expect(market.ledger).toBeNull();
    expect(market.settlementStrategy).toBeNull();
  });

  it('uses the correct defaults', () => {
    const market = buildMarket();
    expect(market).toBeTruthy();
    expect(market.turn).toEqual(0);
    expect(market.price).toEqual(1);
    expect(market.good).toEqual('');
    expect(market.ledger).toBeTruthy();
    expect(market.settlementStrategy).toBeTruthy();
  });
})
