import { ForgeWorkerGoodData } from '../../src/forge/forgeWorkerGoodData';

describe('ForgeWorkerGoodData Functionality tests', () => {

  it('Can be constructed', () => {
    expect(new ForgeWorkerGoodData('beer', () => 'foo')).toBeTruthy();
  });
});
