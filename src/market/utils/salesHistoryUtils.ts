import { SalesRecord } from "../interfaces";

/**
 * 
 * @param salesHistory 
 * @returns A tuple: [totalVolume, totalQuanitySold, totalNumberOfSales], or null if input is invalid
 */
export function getHistoricalTotals(salesHistory: SalesRecord[]): [number, number, number] {
  if (!salesHistory || salesHistory.length === 0) {
    return null;
  }
  return salesHistory.reduce<[number, number, number]>(
    ([totalVolume, totalQuantity, totalSalesQuantity], salesRecord) => {
      return [totalVolume + salesRecord.volume,
        totalQuantity + salesRecord.quantity,
        totalSalesQuantity + salesRecord.sales.length];
    }, [0, 0, 0]);
}
