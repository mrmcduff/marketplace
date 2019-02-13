import { ForgeWorkerGoodData } from '../../src/forge/forgeWorkerGoodData';
import { PartialWorkerGood } from '../../src/forge/partialWorkerGood';
import { worker } from 'cluster';

describe('ForgeWorkerGoodData Functionality tests', () => {

  let createUuid;
  let forgeData: ForgeWorkerGoodData;

  beforeEach(() => {
    createUuid = jest.fn();
    forgeData = new ForgeWorkerGoodData('wheat', createUuid);
  });

  it('Adds a worker to a default assignment', () => {
    createUuid.mockReturnValueOnce('partial_id');
    // The assignment should succeed.
    expect(forgeData.assign('123abc')).toBe(true);
    const workerAssignments: Map<string, string> = forgeData.inquireWorkerAssignments();
    const partialGoods: PartialWorkerGood[] = forgeData.inquirePartialGoods();
    expect(partialGoods.length).toEqual(1);
    expect(partialGoods[0]).toEqual({
      name: 'wheat',
      id: 'partial_id',
      completedTurns: 0,
      completedWorkerTurns: 0,
    });
    expect(workerAssignments.get('123abc')).toEqual('partial_id');
  });

  it('Adds multiple workers to default assignments', () => {
    createUuid.mockReturnValueOnce('foo');
    expect(forgeData.assignGroup(['workerOne', 'workerTwo'])).toBe(true);
    expect(createUuid).toHaveBeenCalledTimes(1);
    const workerAssignments: Map<string, string> = forgeData.inquireWorkerAssignments();
    const partialGoods: PartialWorkerGood[] = forgeData.inquirePartialGoods();
    expect(partialGoods.length).toEqual(1);
    expect(partialGoods[0]).toEqual({
      name: 'wheat',
      id: 'foo',
      completedTurns: 0,
      completedWorkerTurns: 0,
    });
    expect(workerAssignments.size).toEqual(2);
    expect(workerAssignments.get('workerOne')).toEqual('foo');
    expect(workerAssignments.get('workerTwo')).toEqual('foo');
  });

  it('Adds new workers to a default new assignmenet', () => {
    createUuid.mockReturnValueOnce('first').mockReturnValueOnce('second');
    // The assignment should succeed.
    expect(forgeData.assign('123abc')).toBe(true);
    expect(forgeData.assign('456def')).toBe(true);
    const workerAssignments: Map<string, string> = forgeData.inquireWorkerAssignments();
    const partialGoods: PartialWorkerGood[] = forgeData.inquirePartialGoods();
    expect(partialGoods.length).toEqual(2);
    expect(partialGoods[1]).toEqual({
      name: 'wheat',
      id: 'second',
      completedTurns: 0,
      completedWorkerTurns: 0,
    });
    expect(workerAssignments.get('123abc')).toEqual('first');
    expect(workerAssignments.get('456def')).toEqual('second');
  });

  it('Adds a second worker to a specified, valid assignment', () => {
    createUuid.mockReturnValueOnce('first');
    expect(forgeData.assign('one')).toBe(true);
    expect(forgeData.assign('two', 'first')).toBe(true);
    const workerAssignments: Map<string, string> = forgeData.inquireWorkerAssignments();
    const partialGoods: PartialWorkerGood[] = forgeData.inquirePartialGoods();
    expect(partialGoods.length).toEqual(1);
    expect(workerAssignments.get('one')).toEqual('first');
    expect(workerAssignments.get('two')).toEqual('first');
  });

  it('Adds a group of workers to a specified, valid assignment', () => {
    createUuid.mockReturnValueOnce('first');
    expect(forgeData.assign('one')).toBe(true);
    expect(forgeData.assignGroup(['two', 'three'], 'first')).toBe(true);
    const workerAssignments: Map<string, string> = forgeData.inquireWorkerAssignments();
    const partialGoods: PartialWorkerGood[] = forgeData.inquirePartialGoods();
    expect(partialGoods.length).toEqual(1);
    expect(workerAssignments.get('one')).toEqual('first');
    expect(workerAssignments.get('two')).toEqual('first');
    expect(workerAssignments.get('three')).toEqual('first');
  });

  it('Fails to add a worker to an assignment that doesn\'t exist', () => {
    expect(forgeData.assign('123abc', '456def')).toBe(false);
    expect(createUuid).not.toHaveBeenCalled();
  });

  it('Fails to add a group of workers to a nonexistent good id', () => {
    expect(forgeData.assignGroup(['one', 'two'], 'notThereYet')).toBe(false);
    expect(createUuid).not.toHaveBeenCalled();
  });

  it('Removes workers as specified', () => {
    createUuid.mockReturnValueOnce('first');
    forgeData.assignGroup(['one', 'two', 'three', 'four']);
    expect(forgeData.removeWorker('one')).toBe(true);
    forgeData.removeWorkers('two', 'three');
    const workerAssignments: Map<string, string> = forgeData.inquireWorkerAssignments();
    expect(workerAssignments.size).toEqual(1);
    expect(workerAssignments.has('two')).toBe(false);
    expect(workerAssignments.has('one')).toBe(false);
    expect(workerAssignments.get('four')).toEqual('first');
  });

  it('Adds worker input', () => {
    createUuid.mockReturnValueOnce('first');
    forgeData.assign('one');
    expect(forgeData.addWorkerInput('one', 2)).toBe(true);
    const partialGoods: PartialWorkerGood[] = forgeData.inquirePartialGoods();
    expect(partialGoods.length).toEqual(1);
    expect(partialGoods[0]).toEqual({
      name: 'wheat',
      id: 'first',
      completedTurns: 0,
      completedWorkerTurns: 2,
    });
  });

  it('Returns false from addWorkerInput if worker is not assigned', () => {
    expect(forgeData.addWorkerInput('foo', 3)).toBe(false);
    expect(forgeData.inquirePartialGoods().length).toEqual(0);
  });

  it('Increments a simple turn', () => {
    createUuid.mockReturnValueOnce('first');
    forgeData.assign('one');
    forgeData.addWorkerInput('one', 2);
    forgeData.incrementTurn();
    const partialGoods: PartialWorkerGood[] = forgeData.inquirePartialGoods();
    expect(partialGoods.length).toEqual(1);
    expect(partialGoods[0]).toEqual({
      name: 'wheat',
      id: 'first',
      completedTurns: 1,
      completedWorkerTurns: 2,
    });
  });

  it('Moves an item from partial to completed', () => {
    createUuid.mockReturnValueOnce('first');
    forgeData.assign('123abc');
    forgeData.addWorkerInput('123abc', 10);
    // It takes two turns to complete wheat.
    forgeData.incrementTurn();
    forgeData.incrementTurn();
    const partialGoods: PartialWorkerGood[] = forgeData.inquirePartialGoods();
    expect(partialGoods.length).toEqual(0);
    expect(forgeData.getCompletedUnits()).toEqual(1);
  });

  it('Clones the item as expected', () => {
    createUuid.mockReturnValueOnce('first');
    forgeData.assign('123abc');
    forgeData.addWorkerInput('123abc', 10);
    // It takes two turns to complete wheat.
    forgeData.incrementTurn();
    forgeData.incrementTurn();
    forgeData.assign('123abc');
    forgeData.addWorkerInput('123abc', 2);

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
    let partialGoods: PartialWorkerGood[] = forgeData.inquirePartialGoods();
    let workerAssignments: Map<string, string> = forgeData.inquireWorkerAssignments();

    expect(partialGoods.length).toEqual(3);
    expect(workerAssignments.get('one')).toEqual('first');
    expect(workerAssignments.get('two')).toEqual('second');
    expect(workerAssignments.get('three')).toEqual('third');

    forgeData.addWorkerInput('two', 10);
    forgeData.incrementTurn();
    forgeData.incrementTurn();
    partialGoods = forgeData.inquirePartialGoods();
    workerAssignments = forgeData.inquireWorkerAssignments();

    expect(partialGoods.length).toEqual(2);
    expect(workerAssignments.get('one')).toEqual('first');
    expect(workerAssignments.get('three')).toEqual('third');
    expect(workerAssignments.has('two')).toBe(false);
  });
});
