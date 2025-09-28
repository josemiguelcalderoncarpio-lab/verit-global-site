// src/lib/gatewayStore.ts
// In-memory store for demo purposes only.

export type EventBody = {
  event_id: string;
  principal_id: string;
  amount_minor: number;
  currency: string;
  type: "order" | "refund" | string;
  occurred_at: string;
};

export type GatewayRow = {
  received_at: string;
  idempotency_key?: string;
  replayed?: boolean;
} & EventBody;

type IdemResult = Omit<GatewayRow, "received_at">;

type Job = {
  id: string;
  status: "queued" | "running" | "done" | "failed";
  processed: number;
  failed: number;
};

function nowISO() { return new Date().toISOString(); }
function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = (Math.random()*16)|0, v = c === "x" ? r : (r&0x3)|0x8; return v.toString(16);
  });
}

export class GatewayStore {
  private static _instance: GatewayStore | null = null;
  static get instance() { if (!this._instance) this._instance = new GatewayStore(); return this._instance; }

  private ingress: GatewayRow[] = [];
  private idemResults = new Map<string, IdemResult>();
  private jobs = new Map<string, Job>();

  reset() {
    this.ingress = [];
    this.idemResults.clear();
    this.jobs.clear();
  }

  postSingle(body: EventBody, idemKey?: string) {
    if (idemKey && this.idemResults.has(idemKey)) {
      const prev = this.idemResults.get(idemKey)!;
      this.ingress.unshift({ ...prev, received_at: nowISO(), replayed: true });
      return { json: prev, replayed: true };
    }
    const resp: IdemResult = { ...body, idempotency_key: idemKey, replayed: false };
    this.ingress.unshift({ ...body, idempotency_key: idemKey, received_at: nowISO(), replayed: false });
    if (idemKey) this.idemResults.set(idemKey, resp);
    return { json: resp, replayed: false };
  }

  startBatch(lines: EventBody[], idemKey?: string) {
    const id = uuid();
    const job: Job = { id, status: "queued", processed: 0, failed: 0 };
    this.jobs.set(id, job);
    // pretend async processing
    setTimeout(() => {
      job.status = "running";
      let ok = 0, fail = 0;
      for (const ev of lines) {
        try {
          this.ingress.unshift({ ...ev, idempotency_key: idemKey, received_at: nowISO(), replayed: false });
          ok++;
        } catch { fail++; }
      }
      job.processed = ok; job.failed = fail; job.status = "done";
    }, 150);
    return id;
  }

  getJob(id: string) { return this.jobs.get(id) || null; }
  getIngress(limit = 200) { return this.ingress.slice(0, limit); }
}

export const gatewayStore = GatewayStore.instance;
