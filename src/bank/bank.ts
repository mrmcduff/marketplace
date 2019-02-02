import { BankAccount } from "./bankAccount";

export interface Bank {
  createAccount(id: string): boolean;
}
