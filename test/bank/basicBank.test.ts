import { BasicBank, Bank } from "../../src/bank";

let bank: Bank;

describe('BasicBank tests', () => {

  beforeEach(() => {
    bank = new BasicBank();
  });

  it('Returns true when addding a new account', () => {
    expect(bank.createAccount('foo')).toBe(true);
  });

  it('Returns false when trying to add an account with the same id', () => {
    bank.createAccount('foo');
    expect(bank.createAccount('foo')).toBe(false);
  });
});
