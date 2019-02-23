import { GoodName, good } from "../goods";

export class Sim {
  readonly id: string;
  readonly decayFactor: number;
  private certifications: Set<GoodName>;
  private partialCertifications: Map<GoodName, number>;
  private decayingCertifications: Map<GoodName, number>;

  constructor(id: string, decayFactor: number) {
    this.id = id;
    this.decayFactor = decayFactor;
    this.certifications = new Set<GoodName>();
    this.partialCertifications = new Map<GoodName, number>();
    this.decayingCertifications = new Map<GoodName, number>();
  }

  clone(): Sim {
    const sim = new Sim(this.id, this.decayFactor);
    sim.copyCertifications(this.certifications, this.partialCertifications, this.decayingCertifications);
    return sim;
  }

  private copyCertifications(certifications, partialCertifications, decayingCertifications) {
    this.certifications = new Set<GoodName>(certifications);
    this.partialCertifications = new Map<GoodName, number>(partialCertifications);
    this.decayingCertifications = new Map<GoodName, number>(decayingCertifications);
  }

  addCertification(good: GoodName): void {
    this.certifications.add(good);
  }

  removeCertification(good: GoodName): boolean {
    return this.certifications.delete(good);
  }

  getCertifications(): Set<GoodName> {
    return new Set(this.certifications);
  }

  getPartialCertifications(): Map<GoodName, number> {
    return new Map(this.partialCertifications);
  }

  getDecayingCertifications(): Map<GoodName, number> {
    return new Map(this.decayingCertifications);
  }

  hasCertification(good: GoodName): boolean {
    return this.certifications.has(good);
  }

  /**
   * Train the sim on a certification.
   *
   * @param goodName The name of the good to train on
   * @param amount The amount of training turns to add
   * 
   * @returns {true} if the certification is added, {false} otherwise
   */
  trainCertification(goodName: GoodName, amount?: number): boolean {
    let totalAmount = 1;
    if (amount && amount > 0) {
      totalAmount = amount;
    }
    if (this.partialCertifications.has(goodName)) {
      totalAmount += this.partialCertifications.get(goodName);
    }

    if (totalAmount >= good(goodName).baseTraining) {
      this.certifications.add(goodName);
      this.partialCertifications.delete(goodName);
      return true;
    }
    this.partialCertifications.set(goodName, totalAmount);
    return false;
  }

  /**
   * Decay the sim's certification.
   *
   * @param goodName The name of the good certification to decay
   * @param amount The amount to decay the certification
   * 
   * @returns {true} if the certification was removed, {false} otherwise.
   */
  decayCertification(goodName: GoodName, amount?: number): boolean {
    if (!this.certifications.has(goodName)) {
      return false;
    }

    let totalAmount = 1;
    if (amount && amount > 0) {
      totalAmount = amount;
    }
    if (this.decayingCertifications.has(goodName)) {
      totalAmount += this.decayingCertifications.get(goodName);
    }

    if (totalAmount >= good(goodName).baseTraining * this.decayFactor) {
      this.certifications.delete(goodName);
      this.decayingCertifications.delete(goodName);
      return true;
    }
    this.decayingCertifications.set(goodName, totalAmount);
    return false;
  }

  /**
   * 
   * @param good The good to be spared from decay
   * @param amount The amount to decay all other goods
   * 
   * @returns the set of goods whose certifications were removed
   */
  decayExcept(good: GoodName, amount?: number): Set<GoodName> {
    const lostCertifications = new Set<GoodName>();
    let lostAmount = 1;
    if (amount && amount > 0) {
      lostAmount = amount;
    }

    this.certifications.forEach( cert => {
      if (cert !== good) {
        let completelyGone = this.decayCertification(cert, lostAmount);
        if (completelyGone) {
          lostCertifications.add(cert);
        }
      }
    });
    return lostCertifications;
  }
}
