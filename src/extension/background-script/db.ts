import Dexie from "dexie";
import browser from "webextension-polyfill";
import type { Allowance, Payment } from "~/types";

class DB extends Dexie {
  allowances: Dexie.Table<Allowance, number>;
  payments: Dexie.Table<Payment, number>;

  constructor() {
    super("LBE");
    this.version(1).stores({
      allowances:
        "++id,&host,name,imageURL,tag,enabled,totalBudget,remainingBudget,lastPaymentAt,lnurlAuth,createdAt",
      payments:
        "++id,allowanceId,host,location,name,description,totalAmount,totalFees,preimage,paymentRequest,paymentHash,destination,createdAt",
    });
    this.on("ready", this.loadFromStorage.bind(this));
    this.allowances = this.table("allowances");
    this.payments = this.table("payments");
  }

  async saveToStorage() {
    const allowanceArray = await this.allowances.toArray();
    const paymentsArray = await this.payments.toArray();
    await browser.storage.local.set({
      allowances: allowanceArray,
      payments: paymentsArray,
    });
    return true;
  }

  async loadFromStorage() {
    try {
      const result = await browser.storage.local.get([
        "allowances",
        "payments",
      ]);

      console.info("Loading DB data from storage");

      if (result.allowances) {
        await this.allowances.bulkAdd(result.allowances);
      }
      if (result.payments) {
        await this.payments.bulkAdd(result.payments);
      }
      return true;
    } catch (e) {
      console.error("Failed to load DB data from storage", e);
    }
  }
}

const db = new DB();

export default db;
