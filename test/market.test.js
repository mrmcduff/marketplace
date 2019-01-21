const Market = require('../src/market');

describe('Market testing', () => {
  it('exists when constructed', () => {
    const market = new Market();
    expect(market).toBeTruthy();
  });
})
