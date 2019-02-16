import { ForgeAccount } from '../../src/forge/forgeAccount';

describe('ForgeAccount tests', () => {

  let createUuid;
  it('Can be built', () => {
    createUuid = jest.fn();
    expect(new ForgeAccount('foo', createUuid));
  });
});
