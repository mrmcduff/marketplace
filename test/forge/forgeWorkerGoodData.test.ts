import { ForgeWorkerGoodData } from '../../src/forge/forgeWorkerGoodData';
import { PartialWorkerGood } from '../../src/forge/partialWorkerGood';

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

  it('Fails to add a worker to an assignment that doesn\'t exist', () => {
    expect(forgeData.assign('123abc', '456def')).toBe(false);
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
});
