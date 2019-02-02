import { StorageRecord } from "./storageRecord";
import { GoodName } from "../goods";

export class BankAccount {
  readonly id: string;
  private readonly inventory: Map<GoodName, StorageRecord>;

  constructor(id: string) {
    this.id = id;
    this.inventory = new Map<GoodName, StorageRecord>();
  }

  store(item: GoodName, quantity: number): StorageRecord {
    if (quantity <= 0) {
      return null;
    }

    let record: StorageRecord;
    if (this.inventory.has(item)) {
      record = this.inventory.get(item);
    } else {
      record = { good: item, quantity: 0 }
    }
    record.quantity += quantity;
    this.inventory.set(item, record);

    // Return a copy of the updated record.
    return { ...record };
  }

  remove(item: GoodName, quantity: number): [boolean, StorageRecord] {
    if (quantity <= 0 || !this.inventory.has(item)) {
      return [false, null];
    }

    const record = this.inventory.get(item);
    if (record.quantity >= quantity) {
      record.quantity -= quantity;
      this.inventory.set(item, record);
      return [true, { ...record }];
    } else {
      return [false, { ...record }];
    }
  }

  inquire(item: GoodName) : StorageRecord {
    const record = this.inventory.get(item);
    if (!record) {
      return null;
    }
    return { ...record };
  }
}
