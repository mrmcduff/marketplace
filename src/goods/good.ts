
export enum Classification {
  Raw,
  Refined,
  Currency,
}

export type GoodName = 'beer' | 'wheat' | 'dollar';

export interface Good {
  readonly name: string;
  readonly workerTurns: number;
  readonly absTurns: number;
  readonly classifications: Set<Classification>;
  readonly requirements: Map<GoodName, number>;
}
