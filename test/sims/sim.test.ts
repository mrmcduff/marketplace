import { Sim } from '../../src/sims';
import { good, GoodName } from '../../src/goods';

describe('Base sim functionality tests', () => {
  let sim: Sim;
  beforeEach(() => {
    sim = new Sim('workerBee123', 6);
  });

  it('adds certifications', () => {
    sim.addCertification('beer');
    expect(sim.hasCertification('beer')).toBe(true);
  });

  it('deletes certifications', () => {
    sim.addCertification('beer');
    expect(sim.removeCertification('beer')).toBe(true);
    expect(sim.hasCertification('beer')).toBe(false);
    expect(sim.removeCertification('beer')).toBe(false);
  });

  it('trains certifications as expected', () => {
    sim.trainCertification('wheat');
    expect(sim.hasCertification('wheat')).toBe(false);
    expect(sim.getPartialCertifications().get('wheat')).toEqual(1);

    sim.trainCertification('beer', 3);
    expect(sim.hasCertification('beer')).toBe(false);
    expect(sim.getPartialCertifications().get('beer')).toEqual(3);
  });

  it('adds certifications when done training', () => {
    sim.trainCertification('wheat', 2);
    expect(sim.hasCertification('wheat')).toBe(true);
    expect(sim.getPartialCertifications().has('wheat')).toBe(false);

    sim.trainCertification('beer', 3);
    sim.trainCertification('beer', 5);
    expect(sim.hasCertification('beer')).toBe(true);
    expect(sim.getPartialCertifications().size).toEqual(0);
  });

  it('returns false when trying to decay a certification worker does not have', () => {
    expect(sim.decayCertification('wheat', 100)).toBe(false);
    expect(sim.getDecayingCertifications().size).toBe(0);
  });

  it('decays a skill as expected', () => {
    sim.addCertification('beer');
    expect(sim.decayCertification('beer')).toBe(false);
    expect(sim.getDecayingCertifications().get('beer')).toEqual(1);
    // This still isn't enough to completely decay the beer certification
    expect(sim.decayCertification('beer', 3)).toBe(false);
    expect(sim.getDecayingCertifications().get('beer')).toEqual(4);
  });

  it('removes a skill that has completely decayed', () => {
    sim.addCertification('wheat');
    let totalDecayRequired = good('wheat').baseTraining * sim.decayFactor;
    expect(sim.decayCertification('wheat', 2)).toBe(false);
    expect(sim.hasCertification('wheat')).toBe(true);
    expect(sim.decayCertification('wheat', totalDecayRequired - 2)).toBe(true);
    expect(sim.hasCertification('wheat')).toBe(false);
    expect(sim.getDecayingCertifications().size).toEqual(0);
  });

  it('decays multiple skills as expected', () => {
    sim.addCertification('beer');
    sim.addCertification('wheat');
    let gone: Set<GoodName> = sim.decayExcept('dollar');
    expect(gone.size).toEqual(0);
    expect(sim.getCertifications().size).toEqual(2);
    expect(sim.getDecayingCertifications().get('beer')).toEqual(1);
    expect(sim.getDecayingCertifications().get('wheat')).toEqual(1);

    gone = sim.decayExcept('dollar', 5);
    expect(gone.size).toEqual(0);
    expect(sim.getCertifications().size).toEqual(2);
    expect(sim.getDecayingCertifications().get('beer')).toEqual(6);
    expect(sim.getDecayingCertifications().get('wheat')).toEqual(6);
  });

  it('returns fully decayed skills', () => {
    sim.addCertification('beer');
    sim.addCertification('wheat');
    // This should be enough to decay wheat, but not beer.
    const gone = sim.decayExcept('dollar', 12);
    expect(gone.has('wheat')).toBe(true);
    expect(gone.has('beer')).toBe(false);
    expect(sim.hasCertification('beer')).toBe(true);
    expect(sim.hasCertification('wheat')).toBe(false);
    expect(sim.getDecayingCertifications().get('beer')).toEqual(12);
  });

  it('does not decay the specified skill', () => {
    sim.addCertification('beer');
    sim.addCertification('wheat');
    sim.decayExcept('beer');
    expect(sim.getDecayingCertifications().has('beer')).toBe(false);
  });

  it('clones as expected', () => {
    sim.addCertification('wheat');
    sim.trainCertification('beer', 3);
    sim.decayCertification('wheat');

    const clone = sim.clone();
    expect(clone).not.toBe(sim);
    expect(clone.id).toEqual(sim.id);
    expect(clone.decayFactor).toEqual(sim.decayFactor);
    expect(clone.getCertifications()).toEqual(sim.getCertifications());
    expect(clone.getCertifications()).not.toBe(sim.getCertifications());
    expect(clone.getPartialCertifications()).toEqual(sim.getPartialCertifications());
    expect(clone.getPartialCertifications()).not.toBe(sim.getPartialCertifications());
    expect(clone.getDecayingCertifications()).toEqual(sim.getDecayingCertifications());
    expect(clone.getDecayingCertifications()).not.toBe(sim.getDecayingCertifications());

    sim.trainCertification('beer');
    expect(clone.getPartialCertifications()).not.toEqual(sim.getPartialCertifications());
    clone.decayCertification('wheat');
    expect(clone.getDecayingCertifications()).not.toEqual(sim.getDecayingCertifications());
    sim.addCertification('beer');
    expect(clone.getCertifications()).not.toEqual(sim.getCertifications());
  });
});
