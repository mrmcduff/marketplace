import { Wheat, Classification, Beer, Dollar } from "../../src/goods";

describe('Good propery tests', () => {

  it('Has the correct properties for Wheat', () => {
    const wheat = new Wheat();
    expect(wheat.classifications).toContain(Classification.Raw);
    expect(wheat.name).toEqual('wheat');
    expect(wheat.requirements.size).toBe(0);
    expect(wheat.simTurns).toEqual(3);
    expect(wheat.absTurns).toEqual(2);
    expect(wheat.baseTraining).toEqual(2);
  });

  it('Has the correct properties for Beer', () => {
    const beer = new Beer();
    expect(beer.classifications).toContain(Classification.Refined);
    expect(beer.name).toEqual('beer');
    expect(beer.requirements.size).toBe(1);
    expect(beer.requirements.get('wheat')).toBe(2);
    expect(beer.simTurns).toEqual(6);
    expect(beer.absTurns).toEqual(1);
    expect(beer.baseTraining).toEqual(4);
  });

  it('Has the correct properties for Dollars', () => {
    const dollar = new Dollar();
    expect(dollar.classifications).toContain(Classification.Currency);
    expect(dollar.name).toEqual('dollar');
    expect(dollar.requirements.size).toBe(0);
    expect(dollar.simTurns).toEqual(0);
    expect(dollar.absTurns).toEqual(0);
    expect(dollar.baseTraining).toEqual(0);
  });
});
