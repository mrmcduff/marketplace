
export interface Good {
  readonly name: string;
  readonly workerTurns: number;
  readonly absTurns: number;
  readonly requirements: Map<string, number>;
}
