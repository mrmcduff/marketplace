import { ForgeAccount, ForgeGoodData } from '../../src/forge';

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
});
