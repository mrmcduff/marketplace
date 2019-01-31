import { SettlementStrategy } from '../strategies/settlementStrategy';
import { SingleSidedSettlementStrategy } from '../strategies/singleSidedSettlementStrategy';

export enum SettlementStyle {
  BUYER_FAVORED,
  SELLER_FAVORED,
  UNSUPPORTED,
}

export function buildSettlementStrategy(style: SettlementStyle): SettlementStrategy {
  if (style === SettlementStyle.UNSUPPORTED) {
    return null;
  }
  return new SingleSidedSettlementStrategy(style === SettlementStyle.BUYER_FAVORED);
}
