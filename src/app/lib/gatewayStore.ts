// src/app/lib/gatewayStore.ts

export type EventBody = {
  event_id: string;
  principal_id: string;
  amount_minor: number;
  currency: string;
  type: "order" | "refund" | string;
  occurred_at: string; // ISO
};

export type IngressRow = EventBody & {
  received_at: string;
  idempotency_key?: string;
  replayed?: boolean;
};

type Store = {
  rows: IngressRow[];
  idemSeen: Set<string>;
};

declare global {
  // eslint-disable-next-line no-var
  var __VGO_GATEWAY_STORE__: Store | undefined;
}

// One and only store for the whole Node process (survives HMR copies)
const _store: Store =
  globalThis.__VGO_GATEWAY_STORE__ ??
  (globalThis.__VGO_GATEWAY_STORE__ = { rows: [], idemSeen: new Set() });

export const gatewayStore = {
  list(): IngressRow[] {
    // newest first for the UI (optional)
    return [..._store.rows].reverse();
  },

  clear() {
    _store.rows.length = 0;
    _store.idemSeen.clear();
  },

  add(body: EventBody, idempotency?: string): IngressRow {
    const replayed = !!(idempotency && _store.idemSeen.has(idempotency));
    if (idempotency && !replayed) _store.idemSeen.add(idempotency);

    const row: IngressRow = {
      ...body,
      received_at: new Date().toISOString(),
      idempotency_key: idempotency,
      replayed,
    };

    // Demo: record duplicates too, flagged as replayed
    _store.rows.push(row);
    return row;
  },

  addBatch(lines: EventBody[], idempotency?: string) {
    const job = `job_${Math.random().toString(36).slice(2, 8)}`;
    for (const b of lines) this.add(b, idempotency);
    return { job };
  },
};
