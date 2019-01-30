import Good from "./good";

export default class Wheat implements Good {

  public name: string = 'wheat';
  public workerTurns: number = 3;
  public absTurns: number = 2;
  public requirements = new Map<string, number>();

  public static getName(): string {
    return 'wheat';
  }
}
