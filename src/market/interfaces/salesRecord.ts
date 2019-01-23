import { Sale } from './sale';

export interface SalesRecord {
  turn: number,
  quantity: number,
  volume: number,
  sales: Sale[],
}
