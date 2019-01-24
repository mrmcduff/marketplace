export type Exchange = {
  id: string,
  quantity: number,
  value: number,
}

export type ExchangeRecord = {
  turn: number,
  exchanges: Exchange[],
  quantity: number,
  volume: number,
}
