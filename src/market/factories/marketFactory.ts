import Market from '../market';
import { LedgerStyle, buildLedger } from '../../ledger/factories/ledgerFactory';

export function buildMarket(
  price: number = 1,
  good: string = '',
  startIndex: number = 0,
  style: LedgerStyle = LedgerStyle.SIMPLE,
  ): Market {
  return new Market(price, good, startIndex, buildLedger(style));
}
