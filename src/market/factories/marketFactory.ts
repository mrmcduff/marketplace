import Market from '../market';
import { LedgerStyle, buildLedger } from '../../ledger/factories/ledgerFactory';
import { SettlementStyle, buildSettlementStrategy } from './settlementStrategyFactory';

export function buildMarket(
  price: number = 1,
  good: string = '',
  startIndex: number = 0,
  style: LedgerStyle = LedgerStyle.SIMPLE,
  settlementStyle: SettlementStyle = SettlementStyle.SELLER_FAVORED,
  ): Market {
  return new Market(price, good, startIndex, buildLedger(style), buildSettlementStrategy(settlementStyle));
}
