import { Ledger } from '../ledger';
import { SimpleLedger } from '../simpleLedger';

export enum LedgerStyle {
  SIMPLE,
  UNSUPPORTED,
}

export function buildLedger(style: LedgerStyle) : Ledger {
  if (style === LedgerStyle.SIMPLE) {
    return new SimpleLedger();
  }
  return null;
}
