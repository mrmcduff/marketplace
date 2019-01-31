
export class Company {
  public readonly name: string;
  
  private inventory: Map<string, number> = new Map<string, number>();
  private cash: number;
  private availableWorkers: number;
}
