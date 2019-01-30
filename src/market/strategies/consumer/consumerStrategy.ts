import { Exchange } from "../../interfaces";

export default interface ConsumerStrategy {
  generateConsumerBids(): Exchange[];
}
