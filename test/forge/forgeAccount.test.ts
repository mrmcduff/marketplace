import { ForgeAccount, ForgeGoodData } from '../../src/forge';
import { O_TRUNC } from 'constants';

describe('ForgeAccount tests', () => {

  let forgeAccount: ForgeAccount;
  beforeEach(() => {
    forgeAccount = new ForgeAccount('someId');
  });

  it('Adds an good to the account', () => {
    const addedItem = forgeAccount.addNew('beer', 2);
    expect(addedItem.name).toEqual('beer');
    expect(addedItem.completedUnits).toEqual(0);
    expect(addedItem.inProgress).toHaveLength(1);
    expect(addedItem.inProgress[0].name).toEqual('beer');
    expect(addedItem.inProgress[0].completedTurns).toEqual(0);
    expect(addedItem.inProgress[0].workerTurns).toEqual(2);
    expect(addedItem).not.toBe(forgeAccount.inquire('beer'));
  });

  it('Adds additional item even if item already has in progress goods', () => {
    forgeAccount.addNew('wheat', 5);
    const goodData = forgeAccount.addNew('wheat', 3);
    expect(goodData.inProgress.length).toEqual(2);
    expect(goodData.inProgress[0].workerTurns).toEqual(5);
    expect(goodData.inProgress[1].workerTurns).toEqual(3);
  });

  it('Returns null when inquiring about an item not present', () => {
    expect(forgeAccount.inquire('beer')).toBeNull();
  });

  it('Adds a new item using raw add function when nothing is there', () => {
    const goodData = forgeAccount.add('wheat', 3);
    const inquireData = forgeAccount.inquire('wheat');
    expect(goodData).toEqual(inquireData);
    expect(goodData).not.toBe(inquireData);
  });

  it('Acts like add new item when index is not an integer', () => {
    forgeAccount.add('wheat', 3);
    forgeAccount.add('wheat', 5, 1.3);
    const foundItem = forgeAccount.inquire('wheat');
    expect(foundItem).toBeTruthy();
    expect(foundItem.inProgress.length).toEqual(2);
  });

  it('Acts like add new item when index is higher than length', () => {
    forgeAccount.add('beer', 5);
    forgeAccount.add('beer', 3, 5);
    const foundItem = forgeAccount.inquire('beer');
    expect(foundItem).toBeTruthy();
    expect(foundItem.inProgress.length).toEqual(2);
  });

  it('Adds when trying to update the 0th item', () => {
    forgeAccount.add('beer', 4);
    const resultingItem = forgeAccount.add('beer', 3, 0);
    const foundItem = forgeAccount.inquire('beer');
    expect(foundItem).toBeTruthy();
    expect(foundItem.inProgress.length).toEqual(1);
    expect(foundItem.inProgress[0].workerTurns).toEqual(7);
    expect(resultingItem).toEqual(foundItem);
    expect(resultingItem).not.toBe(foundItem);
  });

});
