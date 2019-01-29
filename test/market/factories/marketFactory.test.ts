import { buildMarket } from '../../../src/market/factories/marketFactory';
import { SettlementStyle } from '../../../src/market/factories/settlementStrategyFactory';
import { LedgerStyle } from '../../../src/ledger/factories/ledgerFactory';
import { SalesStrategyType } from '../../../src/market/factories/evaluateSalesStrategyFactory';
import Market from '../../../src/market/market';

describe('Market factory tests', () => {
  it('assigns the correct values', () => {
    const market = buildMarket(
      10,
      9,
      'widgets',
      5,
      LedgerStyle.UNSUPPORTED,
      SettlementStyle.UNSUPPORTED,
      SalesStrategyType.UNKNOWN);
    expect(market).toBeTruthy();
    expect(market.turn).toEqual(5);
    expect(market.estimatedPrice).toEqual(10);
    expect(market.estimatedQuantity).toEqual(9);
    expect(market.good).toEqual('widgets');
    expect(market.ledger).toBeNull();
    expect(market.settlementStrategy).toBeNull();
    expect(market.evaluateSalesStrategy).toBeNull();
  });

  it('uses the correct defaults', () => {
    const market = buildMarket();
    expect(market).toBeTruthy();
    expect(market.turn).toEqual(0);
    expect(market.estimatedPrice).toEqual(1);
    expect(market.estimatedQuantity).toEqual(1);
    expect(market.good).toEqual('');
    expect(market.ledger).toBeTruthy();
    expect(market.settlementStrategy).toBeTruthy();
    expect(market.evaluateSalesStrategy).toBeTruthy();
  });
})
