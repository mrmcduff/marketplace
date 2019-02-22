import { ForgeGoodData } from '../../src/forge/forgeGoodData';
import { PartialGood } from '../../src/forge/partialGood';

describe('ForgeGoodData Functionality tests', () => {

  let createUuid;
  let forgeData: ForgeGoodData;

  beforeEach(() => {
    createUuid = jest.fn();
    forgeData = new ForgeGoodData('wheat', createUuid);
  });

  it('Adds a sim to a default assignment', () => {
    createUuid.mockReturnValueOnce('partial_id');
    // The assignment should succeed.
    expect(forgeData.assign('123abc')).toBe(true);
    const simAssignments: Map<string, string> = forgeData.inquireSimAssignments();
    const partialGoods: PartialGood[] = forgeData.inquirePartialGoods();
    expect(partialGoods.length).toEqual(1);
    expect(partialGoods[0]).toEqual({
      name: 'wheat',
      id: 'partial_id',
      completedTurns: 0,
      completedSimTurns: 0,
    });
    expect(simAssignments.get('123abc')).toEqual('partial_id');
  });

  it('Adds multiple sims to default assignments', () => {
    createUuid.mockReturnValueOnce('foo');
    expect(forgeData.assignGroup(['workerOne', 'workerTwo'])).toBe(true);
    expect(createUuid).toHaveBeenCalledTimes(1);
    const simAssignments: Map<string, string> = forgeData.inquireSimAssignments();
    const partialGoods: PartialGood[] = forgeData.inquirePartialGoods();
    expect(partialGoods.length).toEqual(1);
    expect(partialGoods[0]).toEqual({
      name: 'wheat',
      id: 'foo',
      completedTurns: 0,
      completedSimTurns: 0,
    });
    expect(simAssignments.size).toEqual(2);
    expect(simAssignments.get('workerOne')).toEqual('foo');
    expect(simAssignments.get('workerTwo')).toEqual('foo');
  });

  it('Adds new sims to a default new assignmenet', () => {
    createUuid.mockReturnValueOnce('first').mockReturnValueOnce('second');
    // The assignment should succeed.
    expect(forgeData.assign('123abc')).toBe(true);
    expect(forgeData.assign('456def')).toBe(true);
    const simAssignments: Map<string, string> = forgeData.inquireSimAssignments();
    const partialGoods: PartialGood[] = forgeData.inquirePartialGoods();
    expect(partialGoods.length).toEqual(2);
    expect(partialGoods[1]).toEqual({
      name: 'wheat',
      id: 'second',
      completedTurns: 0,
      completedSimTurns: 0,
    });
    expect(simAssignments.get('123abc')).toEqual('first');
    expect(simAssignments.get('456def')).toEqual('second');
  });

  it('Adds a second sim to a specified, valid assignment', () => {
    createUuid.mockReturnValueOnce('first');
    expect(forgeData.assign('one')).toBe(true);
    expect(forgeData.assign('two', 'first')).toBe(true);
    const simAssignments: Map<string, string> = forgeData.inquireSimAssignments();
    const partialGoods: PartialGood[] = forgeData.inquirePartialGoods();
    expect(partialGoods.length).toEqual(1);
    expect(simAssignments.get('one')).toEqual('first');
    expect(simAssignments.get('two')).toEqual('first');
  });

  it('Adds a group of sims to a specified, valid assignment', () => {
    createUuid.mockReturnValueOnce('first');
    expect(forgeData.assign('one')).toBe(true);
    expect(forgeData.assignGroup(['two', 'three'], 'first')).toBe(true);
    const simAssignments: Map<string, string> = forgeData.inquireSimAssignments();
    const partialGoods: PartialGood[] = forgeData.inquirePartialGoods();
    expect(partialGoods.length).toEqual(1);
    expect(simAssignments.get('one')).toEqual('first');
    expect(simAssignments.get('two')).toEqual('first');
    expect(simAssignments.get('three')).toEqual('first');
  });

  it('Fails to add a sim to an assignment that doesn\'t exist', () => {
    expect(forgeData.assign('123abc', '456def')).toBe(false);
    expect(createUuid).not.toHaveBeenCalled();
  });

  it('Fails to add a group of sims to a nonexistent good id', () => {
    expect(forgeData.assignGroup(['one', 'two'], 'notThereYet')).toBe(false);
    expect(createUuid).not.toHaveBeenCalled();
  });

  it('Removes sims as specified', () => {
    createUuid.mockReturnValueOnce('first');
    forgeData.assignGroup(['one', 'two', 'three', 'four']);
    expect(forgeData.removeSim('one')).toBe(true);
    forgeData.removeSims('two', 'three');
    const simAssignments: Map<string, string> = forgeData.inquireSimAssignments();
    expect(simAssignments.size).toEqual(1);
    expect(simAssignments.has('two')).toBe(false);
    expect(simAssignments.has('one')).toBe(false);
    expect(simAssignments.get('four')).toEqual('first');
  });

  it('Adds sim input', () => {
    createUuid.mockReturnValueOnce('first');
    forgeData.assign('one');
    expect(forgeData.addSimInput('one', 2)).toBe(true);
    const partialGoods: PartialGood[] = forgeData.inquirePartialGoods();
    expect(partialGoods.length).toEqual(1);
    expect(partialGoods[0]).toEqual({
      name: 'wheat',
      id: 'first',
      completedTurns: 0,
      completedSimTurns: 2,
    });
  });

  it('Returns false from addSimInput if sim is not assigned', () => {
    expect(forgeData.addSimInput('foo', 3)).toBe(false);
    expect(forgeData.inquirePartialGoods().length).toEqual(0);
  });

  it('Increments a simple turn', () => {
    createUuid.mockReturnValueOnce('first');
    forgeData.assign('one');
    forgeData.addSimInput('one', 2);
    forgeData.incrementTurn();
    const partialGoods: PartialGood[] = forgeData.inquirePartialGoods();
    expect(partialGoods.length).toEqual(1);
    expect(partialGoods[0]).toEqual({
      name: 'wheat',
      id: 'first',
      completedTurns: 1,
      completedSimTurns: 2,
    });
    expect(forgeData.getCompletedUnits()).toEqual(0);
  });

  it('Moves an item from partial to completed', () => {
    createUuid.mockReturnValueOnce('first');
    forgeData.assign('123abc');
    forgeData.addSimInput('123abc', 10);
    // It takes two turns to complete wheat.
    forgeData.incrementTurn();
    forgeData.incrementTurn();
    const partialGoods: PartialGood[] = forgeData.inquirePartialGoods();
    expect(partialGoods.length).toEqual(0);
    expect(forgeData.getCompletedUnits()).toEqual(1);
  });

  it('Clones the item as expected', () => {
    createUuid.mockReturnValueOnce('first');
    forgeData.assign('123abc');
    forgeData.addSimInput('123abc', 10);
    // It takes two turns to complete wheat.
    forgeData.incrementTurn();
    forgeData.incrementTurn();
    forgeData.assign('123abc');
    forgeData.addSimInput('123abc', 2);

    const extraForgeData = forgeData.clone();
    expect(forgeData).not.toBe(extraForgeData);
    expect(forgeData.inquirePartialGoods()).not.toBe(extraForgeData.inquirePartialGoods());
  });

  it('Reindexes the partial goods properly', () => {
    createUuid
      .mockReturnValueOnce('first')
      .mockReturnValueOnce('second')
      .mockReturnValueOnce('third');
    forgeData.assign('one');
    forgeData.assign('two');
    forgeData.assign('three');
    let partialGoods: PartialGood[] = forgeData.inquirePartialGoods();
    let simAssignments: Map<string, string> = forgeData.inquireSimAssignments();

    expect(partialGoods.length).toEqual(3);
    expect(simAssignments.get('one')).toEqual('first');
    expect(simAssignments.get('two')).toEqual('second');
    expect(simAssignments.get('three')).toEqual('third');

    forgeData.addSimInput('two', 10);
    forgeData.incrementTurn();
    forgeData.incrementTurn();
    partialGoods = forgeData.inquirePartialGoods();
    simAssignments = forgeData.inquireSimAssignments();

    expect(partialGoods.length).toEqual(2);
    expect(simAssignments.get('one')).toEqual('first');
    expect(simAssignments.get('three')).toEqual('third');
    expect(simAssignments.has('two')).toBe(false);
  });
});
