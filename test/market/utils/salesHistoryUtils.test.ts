import { getHistoricalTotals } from '../../../src/market/utils/salesHistoryUtils';
import { SalesRecord } from '../../../src/market/interfaces';

describe('SalesHistoryUtils tests', () => {

  it ('Returns a null value if sales records are empty', () => {
    expect(getHistoricalTotals([])).toBeNull();
  });

  it('Returns a null value if the values are null', () => {
    expect(getHistoricalTotals(null)).toBeNull();
  });

  it('correctly sums the appropriate fields in the sales history', () => {
    const salesRecords: SalesRecord[] = [];
    salesRecords.push(
      {
        turn: 1,
        quantity: 4,
        volume: 40,
        sales: [
          {
            buyerId: 'b1',
            sellerId: 's1',
            price: 1,
            quantity: 3,
          },
          {
            buyerId: 'b2',
            sellerId: 's2',
            price: 37,
            quantity: 1,
          }
        ]
      },
      {
        turn: 2,
        quantity: 5,
        volume: 60,
        sales: [
          {
            buyerId: 'b1',
            sellerId: 's1',
            price: 12,
            quantity: 2,
          },
          {
            buyerId: 'b2',
            sellerId: 's2',
            price: 12,
            quantity: 3,
          }
        ]
      },
    );

    const [totalVolume, totalQuanitySold, totalNumberOfSales] = getHistoricalTotals(salesRecords);
    expect(totalVolume).toEqual(100);
    expect(totalQuanitySold).toEqual(9);
    expect(totalNumberOfSales).toEqual(4);
  });

});
