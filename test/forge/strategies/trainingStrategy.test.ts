import {
  TrainingStrategy,
  generateTrainingStrategy
} from '../../../src/forge/strategies';
import { Sim } from '../../../src/sims';

describe('Tests for different types of training strategies', () => {
  
  let strategy: TrainingStrategy;
  let sim: Sim;

  beforeEach(() => {
    sim = new Sim('abc123', 1);
  });

  it('Accepts and properly uses factors', () => {
    strategy = generateTrainingStrategy('always');
    strategy.setTrainingFactor(3);
    strategy.setDecayFactor(2);
    strategy.trainAndDecaySim(sim, 'beer');

    expect(sim.getCertifications().size).toEqual(0);
    expect(sim.getPartialCertifications().size).toEqual(1);
    expect(sim.getPartialCertifications().get('beer')).toEqual(3);

    strategy.trainAndDecaySim(sim, 'beer');
    // Now the sim should have beer certification.
    expect(sim.getCertifications().size).toEqual(1);

    strategy.trainAndDecaySim(sim, 'none');
    expect(sim.getCertifications().size).toEqual(1);
    expect(sim.getDecayingCertifications().size).toEqual(1);
    expect(sim.getDecayingCertifications().get('beer')).toEqual(2);
  });

  it('Does not decay on none if it is not supposed to', () => {
    strategy = generateTrainingStrategy('freeze-on-none');
    sim.addCertification('wheat');
    strategy.trainAndDecaySim(sim, 'none');
    expect(sim.getDecayingCertifications().size).toEqual(0);

    strategy.trainAndDecaySim(sim, 'beer');
    expect(sim.getDecayingCertifications().size).toEqual(1);
    expect(sim.getDecayingCertifications().get('wheat')).toEqual(1);
    expect(sim.getPartialCertifications().size).toEqual(1);
    expect(sim.getPartialCertifications().get('beer')).toEqual(1);
  });
});
