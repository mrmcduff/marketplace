import { GoodName, Good } from "./good";
import { Beer } from "./beer";
import { Wheat } from "./wheat";
import { Dollar } from "./dollar";

const goodMap = new Map<GoodName, Good>([
  ['beer', new Beer()],
  ['wheat', new Wheat()],
  ['dollar', new Dollar()]
]);

export function good(name: GoodName) : Good {
  return goodMap.get(name);
}
