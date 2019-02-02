import { Bank } from "./bank";
import { BankAccount } from "./bankAccount";

export class BasicBank implements Bank {
  private readonly accounts: Map<string, BankAccount>;

  constructor() {
    this.accounts = new Map<string, BankAccount>();
  }

  createAccount(id: string): boolean {
    if (this.accounts.has(id)) {
      return false;
    }
    const account = new BankAccount(id);
    this.accounts.set(id, account);
    return true;
  }
}
