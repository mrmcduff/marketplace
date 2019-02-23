import {
  SimEvaluationStrategy,
  generateSimEvaluationStrategy
} from '../../../src/forge/strategies';
import { Sim } from '../../../src/sims';

describe('Tests for different types of training strategies', () => {
  
  let strategy: SimEvaluationStrategy;
  let sim: Sim;

  beforeEach(() => {
    sim = new Sim('abc123', 3);
  });

  it('Outputs double for certified items as expected', () => {
    strategy = generateSimEvaluationStrategy('double');
    expect(strategy.evaluateSimTurns(sim, 'beer')).toEqual(1);
    sim.addCertification('beer');
    expect(strategy.evaluateSimTurns(sim, 'beer')).toEqual(2);
    expect(strategy.evaluateSimTurns(sim, 'wheat')).toEqual(1);
  });

  it('Ouputs half for non-certified items as expected', () => {
    strategy = generateSimEvaluationStrategy('half');
    expect(strategy.evaluateSimTurns(sim, 'wheat')).toEqual(0.5);
    sim.addCertification('wheat');
    expect(strategy.evaluateSimTurns(sim, 'wheat')).toEqual(1);
    expect(strategy.evaluateSimTurns(sim, 'beer')).toEqual(0.5);
  });
});
