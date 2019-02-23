import { TrainingStrategy } from "./trainingStrategy";
import { AlwaysTrainAndDecayStrategy } from "./alwaysTrainAndDecayStrategy";
import { NoDecayOnNoneStrategy } from "./noDecayOnNoneStrategy";

export type TrainingStrategyType = 'always' | 'freeze-on-none';

export function generateTrainingStrategy( strategyType: TrainingStrategyType ) : TrainingStrategy {
  switch(strategyType) {
    case 'always':
      return new AlwaysTrainAndDecayStrategy();
    case 'freeze-on-none':
      return new NoDecayOnNoneStrategy();
  }
}
