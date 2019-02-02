import { BankAccount } from '../../src/bank';

let account: BankAccount;

describe('Account tests', () => {
  beforeEach(() => {
    account = new BankAccount('someId');
  });

  it('Properly sets the account ID', () => {
    expect(account.id).toEqual('someId');
  });

  it('Can add a new item to the inventory', () => {
    const recordCopy = account.store('beer', 5);
    const inquiredRecord = account.inquire('beer');

    expect(recordCopy).toEqual({ good: 'beer', quantity: 5 });
    expect(inquiredRecord).toEqual({ good: 'beer', quantity: 5});
    expect(recordCopy).not.toBe(inquiredRecord);
  });

  it('Can update an item', () => {
    account.store('dollar', 100);
    account.store('dollar', 200);
    expect(account.inquire('dollar')).toEqual({ good: 'dollar', quantity: 300 });
  });

  it('Rejects attempts to store zero or a negative quantity of goods', () => {
    const zeroCopy = account.store('wheat', 0);
    const negativeCopy = account.store('wheat', -1);
    expect(zeroCopy).toBeNull();
    expect(negativeCopy).toBeNull();
    expect(account.inquire('wheat')).toBeNull();
  });

  it('Can remove items from the inventory', () => {
    account.store('beer', 10);
    const [success, remaining] = account.remove('beer', 3);
    expect(success).toBe(true);
    expect(remaining).toEqual({ good: 'beer', quantity: 7 });
  });

  it('Rejects attempts to remove zero or negative quantities', () => {
    account.store('beer', -5);
    const [success, remaining] = account.remove('beer', 3);
    expect(success).toBe(false);
    expect(remaining).toBeNull();
  });

  it('Returns false and current record when trying to remove more than total', () => {
    account.store('dollar', 200);
    const [success, remaining] = account.remove('dollar', 500);
    expect(success).toBe(false);
    expect(remaining).toEqual({ good: 'dollar', quantity: 200 });
  });
});
