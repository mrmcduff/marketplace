import { Market } from '../market';
import { LedgerStyle, buildLedger } from '../../ledger/factories/ledgerFactory';
import { SettlementStyle, buildSettlementStrategy } from './settlementStrategyFactory';
import { SalesStrategyType, buildEvaluateSalesStrategy } from './evaluateSalesStrategyFactory';
import { ConsumerStrategyStyle, buildConsumerStrategy } from './consumerStrategyFactory';

export function buildMarket(
  price: number = 1,
  quantity: number = 1,
  good: string = '',
  startIndex: number = 0,
  style: LedgerStyle = LedgerStyle.SIMPLE,
  settlementStyle: SettlementStyle = SettlementStyle.SELLER_FAVORED,
  evaluateSalesStyle: SalesStrategyType = SalesStrategyType.NAIVE,
  consumerStrategyStyle: ConsumerStrategyStyle = ConsumerStrategyStyle.RAW,
  ): Market {
  return new Market(
    price,
    quantity,
    good,
    startIndex,
    buildLedger(style),
    buildSettlementStrategy(settlementStyle),
    buildEvaluateSalesStrategy(evaluateSalesStyle),
    buildConsumerStrategy(consumerStrategyStyle));
}
