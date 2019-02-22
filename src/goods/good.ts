
export enum Classification {
  Raw,
  Refined,
  Currency,
}

export type GoodName = 'beer' | 'wheat' | 'dollar';

export interface Good {
  readonly name: GoodName;
  readonly simTurns: number;
  readonly absTurns: number;
  readonly baseTraining: number;
  readonly classifications: Set<Classification>;
  readonly requirements: Map<GoodName, number>;
}
