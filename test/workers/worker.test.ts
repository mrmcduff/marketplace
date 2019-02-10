import { Worker } from '../../src/workers';
import { good, GoodName } from '../../src/goods';

describe('Base worker functionality tests', () => {
  let worker: Worker;
  beforeEach(() => {
    worker = new Worker('workerBee123', 6);
  });

  it('adds certifications', () => {
    worker.addCertification('beer');
    expect(worker.hasCertification('beer')).toBe(true);
  });

  it('deletes certifications', () => {
    worker.addCertification('beer');
    expect(worker.removeCertification('beer')).toBe(true);
    expect(worker.hasCertification('beer')).toBe(false);
    expect(worker.removeCertification('beer')).toBe(false);
  });

  it('trains certifications as expected', () => {
    worker.trainCertification('wheat');
    expect(worker.hasCertification('wheat')).toBe(false);
    expect(worker.getPartialCertifications().get('wheat')).toEqual(1);

    worker.trainCertification('beer', 3);
    expect(worker.hasCertification('beer')).toBe(false);
    expect(worker.getPartialCertifications().get('beer')).toEqual(3);
  });

  it('adds certifications when done training', () => {
    worker.trainCertification('wheat', 2);
    expect(worker.hasCertification('wheat')).toBe(true);
    expect(worker.getPartialCertifications().has('wheat')).toBe(false);

    worker.trainCertification('beer', 3);
    worker.trainCertification('beer', 5);
    expect(worker.hasCertification('beer')).toBe(true);
    expect(worker.getPartialCertifications().size).toEqual(0);
  });

  it('returns false when trying to decay a certification worker does not have', () => {
    expect(worker.decayCertification('wheat', 100)).toBe(false);
    expect(worker.getDecayingCertifications().size).toBe(0);
  });

  it('decays a skill as expected', () => {
    worker.addCertification('beer');
    expect(worker.decayCertification('beer')).toBe(false);
    expect(worker.getDecayingCertifications().get('beer')).toEqual(1);
    // This still isn't enough to completely decay the beer certification
    expect(worker.decayCertification('beer', 3)).toBe(false);
    expect(worker.getDecayingCertifications().get('beer')).toEqual(4);
  });

  it('removes a skill that has completely decayed', () => {
    worker.addCertification('wheat');
    let totalDecayRequired = good('wheat').baseTraining * worker.decayFactor;
    expect(worker.decayCertification('wheat', 2)).toBe(false);
    expect(worker.hasCertification('wheat')).toBe(true);
    expect(worker.decayCertification('wheat', totalDecayRequired - 2)).toBe(true);
    expect(worker.hasCertification('wheat')).toBe(false);
    expect(worker.getDecayingCertifications().size).toEqual(0);
  });

  it('decays multiple skills as expected', () => {
    worker.addCertification('beer');
    worker.addCertification('wheat');
    let gone: Set<GoodName> = worker.decayExcept('dollar');
    expect(gone.size).toEqual(0);
    expect(worker.getCertifications().size).toEqual(2);
    expect(worker.getDecayingCertifications().get('beer')).toEqual(1);
    expect(worker.getDecayingCertifications().get('wheat')).toEqual(1);

    gone = worker.decayExcept('dollar', 5);
    expect(gone.size).toEqual(0);
    expect(worker.getCertifications().size).toEqual(2);
    expect(worker.getDecayingCertifications().get('beer')).toEqual(6);
    expect(worker.getDecayingCertifications().get('wheat')).toEqual(6);
  });

  it('returns fully decayed skills', () => {
    worker.addCertification('beer');
    worker.addCertification('wheat');
    // This should be enough to decay wheat, but not beer.
    const gone = worker.decayExcept('dollar', 12);
    expect(gone.has('wheat')).toBe(true);
    expect(gone.has('beer')).toBe(false);
    expect(worker.hasCertification('beer')).toBe(true);
    expect(worker.hasCertification('wheat')).toBe(false);
    expect(worker.getDecayingCertifications().get('beer')).toEqual(12);
  });

  it('does not decay the specified skill', () => {
    worker.addCertification('beer');
    worker.addCertification('wheat');
    worker.decayExcept('beer');
    expect(worker.getDecayingCertifications().has('beer')).toBe(false);
  });
});
