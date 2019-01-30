import ConsumerStrategy from "./consumerStrategy";
import { Exchange } from "../../interfaces";

export default class RawConsumerStrategy implements ConsumerStrategy {
  generateConsumerBids(): Exchange[] {
    return [];
  }
}
