import { ForgeAccount } from '../../src/forge/forgeAccount';
import { Sim } from '../../src/sims/sim';
import { ForgeGoodData } from '../../src/forge/forgeGoodData';
import { generateTrainingStrategy, generateSimEvaluationStrategy } from '../../src/forge/strategies';

describe('ForgeAccount tests', () => {

  let createUuid;
  let forgeAccount: ForgeAccount;
  beforeEach(() => {
    createUuid = jest.fn();
    forgeAccount = new ForgeAccount(
      'foo',
      generateTrainingStrategy('always'),
      generateSimEvaluationStrategy('double'),
      createUuid);
  });

  it('Can add sims', () => {
    const addedSims = [ new Sim('barSim', 3), new Sim('bazSim', 6) ];
    forgeAccount.addSims(addedSims);
    expect(forgeAccount.inquireSims()).toEqual(addedSims);
    expect(forgeAccount.inquireSims()).not.toBe(addedSims);
  });

  it('Can add sims to a specific product', () => {
    const addedSims = [ new Sim('barSim', 3), new Sim('bazSim', 6) ];
    forgeAccount.addSims(addedSims, 'beer');
    expect(forgeAccount.inquireSims()).toEqual(addedSims);
    expect(forgeAccount.inquireSims()).not.toBe(addedSims);
    expect(forgeAccount.inquireGoodData('beer')).not.toBeNull();
  });

  it('Can remove sims', () => {
    const addedSims = [ new Sim('barSim', 3), new Sim('bazSim', 6), new Sim('aSim', 1), new Sim('bSim', 2) ];
    forgeAccount.addSims(addedSims);
    forgeAccount.removeSims('barSim', 'bSim');
    expect(forgeAccount.inquireSims()).toEqual([ new Sim('bazSim', 6), new Sim('aSim', 1)]);
  });

  it('Gracefully handles illegal assignments', () => {
    forgeAccount.assignSim('not_really_here', 'beer');
    expect(forgeAccount.inquireGoodData('beer')).toBeNull();
  });

  it('Gracefully handles removal of a nonexistent sim', () => {
    forgeAccount.removeSims('not_really_here');
    // Just don't throw an error.
    expect(forgeAccount).toBeTruthy();
  });

  it('Increments the turn appropriately with unassigned sims', () => {
    const addedSim = [ new Sim('foo', 2) ];
    forgeAccount.addSims(addedSim);
    forgeAccount.incrementTurn();
    expect(forgeAccount.inquireGoodData('beer')).toBeNull();
    expect(forgeAccount.inquireGoodData('wheat')).toBeNull();
    expect(forgeAccount.inquireGoodData('dollar')).toBeNull();
  });

  it('Assigns sims accurately', () => {
    const addedSims = [ new Sim('a', 3), new Sim('b', 6) ];
    forgeAccount.addSims(addedSims);
    forgeAccount.assignSim('a', 'beer');
    forgeAccount.assignSim('b', 'wheat');
    const expectedBeer = new ForgeGoodData('beer', createUuid);
    expectedBeer.assign('a');
    const expectedWheat = new ForgeGoodData('wheat', createUuid);
    expectedWheat.assign('b');
    expect(forgeAccount.inquireGoodData('beer')).toEqual(expectedBeer);
    expect(forgeAccount.inquireGoodData('wheat')).toEqual(expectedWheat);
    expect(forgeAccount.inquireGoodData('dollar')).toBeNull();
  });

  it('Increments a turn and updates the data', () => {
    const addedSims = [ new Sim('a', 3), new Sim('b', 2) ];
    createUuid.mockReturnValue('helloUuid');
    forgeAccount.addSims(addedSims);
    forgeAccount.assignSim('a', 'beer');
    forgeAccount.incrementTurn();
    const expectedBeer = new ForgeGoodData('beer', createUuid);
    expectedBeer.assign('a');
    expectedBeer.addSimInput('a', 1);

    expect(forgeAccount.inquireGoodData('beer')).toEqual(expectedBeer);
  });

  it('Changes a Sim assignment', () => {
    const addedSims = [ new Sim('a', 3) ];
    createUuid.mockReturnValue('helloUuid');
    forgeAccount.addSims(addedSims);
    forgeAccount.assignSim('a', 'wheat');
    forgeAccount.assignSim('a', 'beer');
    const expectedBeer = new ForgeGoodData('beer', createUuid);
    expectedBeer.assign('a');
    const expectedWheat = new ForgeGoodData('wheat', createUuid);
    expectedWheat.assign('a');
    expectedWheat.removeSim('a');

    expect(forgeAccount.inquireGoodData('beer')).toEqual(expectedBeer);
    expect(forgeAccount.inquireGoodData('wheat')).toEqual(expectedWheat);
  });

  it('Removes a sim after that sim has already been assigned', () => {
    const addedSims = [ new Sim('a', 3) ];
    createUuid.mockReturnValue('goodId');
    forgeAccount.addSims(addedSims);
    forgeAccount.assignSim('a', 'wheat');

    const expectedWheat = new ForgeGoodData('wheat', createUuid);
    expectedWheat.assign('a');
    expectedWheat.removeSim('a');

    forgeAccount.removeSims('a');
    expect(forgeAccount.inquireGoodData('wheat')).toEqual(expectedWheat);
  });
});
