import Image from "next/image";
import Link from "next/link";
import { PropsWithChildren } from "react";
import { Section, Card as UICard, CodePanel as UICodePanel } from "../../components/UI";

// Docs URL (set NEXT_PUBLIC_DOCS_URL to your external docs site)
const DOCS_URL = process.env.NEXT_PUBLIC_DOCS_URL || "/docs";

export default function TechPage() {
  return (
    <>
      {/* ---------- HERO ---------- */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 pt-10 sm:pt-12 md:pt-14 lg:pt-16">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div>
              <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
                Deterministic Settlement: Mathematical certainty for money movement
              </h1>
              <p className="mt-4 text-[15px] leading-7 text-slate-700 sm:text-base">
                Every settlement is <span className="font-semibold">bit-for-bit reproducible</span> and
                <span className="font-semibold"> cryptographically verifiable</span>. Funds move only when
                <span className="font-semibold"> the math and the evidence agree</span>.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/vgomini"
                  className="inline-flex items-center rounded-xl bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white shadow hover:opacity-95"
                >
                  See sandbox demo
                </Link>
                <a
                  href="/contact"
                  className="inline-flex items-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[var(--brand)] ring-1 ring-[var(--brand)] hover:bg-slate-50"
                >
                  Download tech deck
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-slate-300 hover:bg-slate-50"
                >
                  Talk to an engineer
                </Link>
              </div>
            </div>

            <div className="relative h-[240px] overflow-hidden rounded-2xl ring-1 ring-slate-200 sm:h-[300px] md:h-[340px]">
              <Image
                src="/images/tech/architecture.jpg"
                alt="Deterministic settlement architecture"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- THE INVARIANT ---------- */}
      <Section title="The invariant (gate before money moves)">
        <div className="grid gap-6 md:grid-cols-2">
          <UICard title="Two conditions, or no disbursement">
            <ol className="mt-2 list-decimal space-y-2 pl-5 text-slate-700">
              <li><code>replay_digest == transcript_digest</code> — mathematical proof the computation is correct.</li>
              <li><code>acceptance_bundle.validate(freshness, quorum)</code> — cryptographic proof of approvals (ACK/CT/SPV).</li>
            </ol>
            <p className="mt-3 text-sm text-slate-600">If either fails, the decision is <strong>HOLD</strong> with a reason code.</p>
          </UICard>
          <UICard title="Acceptance matrix (pseudo)">
            <UICodePanel>{String.raw`const ok =
  (replayDigest === transcriptDigest) &&
  requiredDomains.every(d => verify(proofs[d]) && fresh(proofs[d], F) && quorum(proofs[d], Q));
return ok ? 'ALLOW' : ['HOLD', reasonCode];`}</UICodePanel>
          </UICard>
        </div>
      </Section>

      {/* ---------- INTERFACES & DECISION TREE ---------- */}
      <Section title="Interfaces: 8 ways to integrate">
        <div className="grid gap-6 md:grid-cols-4">
          <Pattern rank={1} title="One-call Authorization Gate" note="Best default: minimal change" />
          <Pattern rank={2} title="PSP plugin + SPV receipts" note="Airtight reconciliation" />
          <Pattern rank={3} title="Batch flat-file (Tier-0)" note="Fastest start" />
          <Pattern rank={4} title="Event streaming (Kafka/Pub/Sub)" note="For tight SLAs/scale" />
          <Pattern rank={5} title="ERP-native adaptor" note="Finance-led control" />
          <Pattern rank={6} title="SDK-first (Stripe-style)" note="Great DX for dev teams" />
          <Pattern rank={7} title="Ops copilot (agent)" note="Support layer" />
          <Pattern rank={8} title="On-/cross-chain SPV" note="Only if you touch on-chain" />
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <UICard title="Decision tree">
            <UICodePanel>{String.raw`Need value in weeks?          → 1 + 2 (add 6 later)
Tight SLA or heavy scale?     → 1 + 4 (+2/6)
Finance-led & ERP-centric?     → 5 + 1 (+2/6)
Product/dev-led?               → 6 + 1 (+2)
Crypto/on-ledger touchpoints?  → add 8 to acceptance`}</UICodePanel>
          </UICard>
          <UICard title="Anti-patterns to avoid">
            <ul className="mt-1 list-disc space-y-2 pl-5 text-slate-700">
              <li>Becoming payer of record (replace rails)</li>
              <li>Per-payment synchronous gating (gate per <em>window</em>)</li>
              <li>Re-implementing compute in ERP</li>
              <li>Skipping evidence (no ACK/CT/SPV)</li>
              <li>Non-determinism: FP math, wall-clock reads, unordered iteration</li>
            </ul>
          </UICard>
        </div>
      </Section>

      {/* ---------- ARCHITECTURE 12+4 ---------- */}
      <Section title="Architecture: 12 core + 4 context">
        <div className="grid gap-6 md:grid-cols-3">
          {coreBoxes.map((b) => (
            <UICard key={b.id} title={`[${b.id}] ${b.title}`}>
              <p className="text-sm text-slate-700">{b.desc}</p>
              <Details title="Gets → Sends">
                <p className="text-sm text-slate-700">{b.flow}</p>
              </Details>
              <Details title="Data (authoritative)">
                <p className="text-sm text-slate-700">{b.data}</p>
              </Details>
            </UICard>
          ))}
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <UICard title="Context boxes (4)">
            <ul className="mt-1 list-disc space-y-2 pl-5 text-slate-700">
              <li><strong>[CTX-1]</strong> External Systems — files/streams, ERP/GL, PSP/bank, KYC/Tax</li>
              <li><strong>[CTX-2]</strong> Authorization Gate — returns ALLOW/HOLD with reasons</li>
              <li><strong>[CTX-3]</strong> Disbursement via PSP/Bank — tagged with window_id/output_digest</li>
              <li><strong>[CTX-4]</strong> Acceptance Matrix — ops view derived from verifiers</li>
            </ul>
          </UICard>
          <UICard title="ASCII snapshot">
            <UICodePanel>{String.raw`[CTX-1] → [C3] → [C4] → [C5] → [C6]
                   ↘ [C12]           ↘ [C8]
                      [C7] → [CTX-2] → [CTX-3]
                               ↘ [C11] → [C10]
[C1] affects C4/C5/C7; [C2] signs C1/C6; [C9] governs rollout`}</UICodePanel>
          </UICard>
        </div>
      </Section>

      {/* ---------- DATA & REPOSITORIES ---------- */}
      <Section title="Data contracts & repositories">
        <div className="grid gap-6 md:grid-cols-2">
          <UICard title="Cross-cutting IDs">
            <p className="text-sm text-slate-700">window_id · tenant_id · partition_id · policy_version · output_digest · provider_batch_id · transcript_root</p>
          </UICard>
          <UICard title="Authoritative stores">
            <ul className="mt-1 list-disc space-y-2 pl-5 text-slate-700">
              <li>Object store — transcripts (C6), receipts (C11), immutable/WORM</li>
              <li>Postgres HA — manifests (C1), acceptance (C7), governance (C9), auth/recon logs</li>
              <li>Kafka/PubSub — open-window logs (C4) + ingest (C3)</li>
              <li>KMS/HSM — signing keys (C2)</li>
              <li>Observability stack — metrics, logs, traces; warehouse for BI</li>
            </ul>
          </UICard>
          <UICard title="Key contracts (TS sketch)">
            <UICodePanel>{String.raw`interface EventRecord { tenant_id: string; window_id: string; event_id: string; ts_logical: number; bucket_id: number; principal_id: string; amount_minor: string; payload_digest: string; provider_id: string; }
interface AllocationRecord { window_id: string; policy_version: number; principal_id: string; bucket_id: number; amount_native: string; carry_delta: number; }
interface AcceptanceRecord { window_id: string; kind: 'ACK'|'CT'|'SPV'; subject_id: string; status: 'VALID'|'EXPIRED'|'INVALID'; quorum: number; expires_at: string; reason_code?: string; signature: string; }`}</UICodePanel>
          </UICard>
          <UICard title="Reason codes (starter)">
            <p className="text-sm text-slate-700">DIGEST_MISMATCH · STALE_PROOF · INSUFFICIENT_QUORUM · MISSING_ACK · MISSING_CT · MISSING_SPV · PROVIDER_TOTALS_MISMATCH · WATERMARK_STALL · POLICY_VERSION_CONFLICT</p>
          </UICard>
        </div>
      </Section>

      {/* ---------- HOW IT RUNS & SCALES ---------- */}
      <Section title="Run & scale (Kubernetes reference)">
        <div className="grid gap-6 md:grid-cols-3">
          <UICard title="K8s layout">
            <ul className="mt-1 list-disc space-y-2 pl-5 text-slate-700">
              <li>Namespaces per env (dev/stage/prod)</li>
              <li>HPA on C3/C4/C5/C7; NetworkPolicies + mTLS</li>
              <li>Secrets via KMS; short‑lived tokens</li>
            </ul>
          </UICard>
          <UICard title="Scale units & autoscaling">
            <ul className="mt-1 list-disc space-y-2 pl-5 text-slate-700">
              <li>Partitions/window (target 2–5M events/partition)</li>
              <li>One engine worker per (partition, window)</li>
              <li>Autoscale: queue depth • watermark lag • proof backlog</li>
            </ul>
          </UICard>
          <UICard title="Multi‑region & SLOs">
            <ul className="mt-1 list-disc space-y-2 pl-5 text-slate-700">
              <li>Phase 1: single region multi‑AZ → Phase 3: active‑active</li>
              <li>Window close p95 ≤ 15m; transcript seal ≤ 10m</li>
              <li>Replay equality: 100% on canary; any mismatch pages</li>
            </ul>
          </UICard>
        </div>
      </Section>

      {/* ---------- SECURITY ---------- */}
      <Section title="Security & compliance">
        <div className="grid gap-6 md:grid-cols-3">
          <UICard title="Crypto & keys">
            <ul className="mt-1 list-disc space-y-2 pl-5 text-slate-700">
              <li>ed25519 signatures on manifests & transcript roots</li>
              <li>KMS/HSM key rotation & audit</li>
              <li>Signed gate responses; mTLS everywhere</li>
            </ul>
          </UICard>
          <UICard title="Data handling">
            <ul className="mt-1 list-disc space-y-2 pl-5 text-slate-700">
              <li>No PII in transcripts; CT/KYC in separate encrypted bucket</li>
              <li>Object Lock / WORM; cross‑region replication</li>
              <li>RBAC + RLS; per‑tenant isolation</li>
            </ul>
          </UICard>
          <UICard title="Compliance posture">
            <ul className="mt-1 list-disc space-y-2 pl-5 text-slate-700">
              <li>SOC2/ISO roadmap; PCI alignment</li>
              <li>GDPR/CCPA ready; data residency options</li>
              <li>Immutable audit (transcripts + acceptance)</li>
            </ul>
          </UICard>
        </div>
      </Section>

      {/* ---------- DOCS & API ---------- */}
      <Section title="Docs & API (core surface)">
        <div className="grid gap-6 md:grid-cols-2">
          <UICard title="Endpoints">
            <UICodePanel>{String.raw`POST /ingest/events
POST /window/{id}/authorize
GET  /audit/transcript/{window}
GET  /audit/output-digest/{window}
POST /acceptance/proof
GET  /acceptance/{window}
POST /replay/{window}
POST /policy/propose|activate|rollback`}</UICodePanel>
          </UICard>
          <UICard title="Example: authorize window">
            <UICodePanel>{String.raw`{
  "window_id": "W-2025-09-12-1",
  "output_digest": "hex...",
  "decisions": [
    {"principal_id": "P123", "decision": "ALLOW"},
    {"principal_id": "P124", "decision": "HOLD", "reason_code": "STALE_PROOF"}
  ]
}`}</UICodePanel>
          </UICard>
        </div>
      </Section>

      {/* ---------- IMPLEMENTATION ROADMAP ---------- */}
      <Section title="Implementation roadmap">
        {/* Phase rail */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">0</span>
            <div className="text-sm font-semibold text-slate-900">Foundation</div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">1</span>
            <div className="text-sm font-semibold text-slate-900">MVP</div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">2</span>
            <div className="text-sm font-semibold text-slate-900">Pilot</div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">3</span>
            <div className="text-sm font-semibold text-slate-900">GA</div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">4</span>
            <div className="text-sm font-semibold text-slate-900">Scale</div>
          </div>
        </div>

        {/* Phases */}
        <div className="grid gap-6">
          <UICard title="Phase 0 — Foundation (Week 0)">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="text-sm font-semibold text-slate-900">Platform</h4>
                <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Bootstrap repos, envs (dev/stage/prod), CI/CD</li>
                  <li>Secrets via KMS/HSM; mTLS between services</li>
                  <li>Core schemas: EventRecord, AllocationRecord</li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900">Compliance & Data</h4>
                <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>WORM bucket for transcripts; cross‑region replication</li>
                  <li>Data classification (no PII in transcripts)</li>
                  <li>RBAC/RLS baseline, audit logging on write paths</li>
                </ul>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">Repos ready</span>
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">Schemas v1</span>
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">KMS wired</span>
            </div>
          </UICard>

          <UICard title="Phase 1 — MVP (Weeks 1–4)">
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <h4 className="text-sm font-semibold text-slate-900">Pipeline (C3→C6)</h4>
                <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Ingest/normalize with idempotency (C3)</li>
                  <li>Partitioned windowing + watermark close (C4)</li>
                  <li>Deterministic engine: i128, carry ledger (C5)</li>
                  <li>Transcripts + output digest (C6)</li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900">Acceptance & Gate</h4>
                <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>ACK/CT verifiers with freshness & quorum (C7)</li>
                  <li>Authorization Gate returning ALLOW/HOLD (CTX‑2)</li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900">Interfaces</h4>
                <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>#1 Authorization Gate API</li>
                  <li>#2 Batch flat‑file drop (CSV/Parquet)</li>
                  <li>PSP plugin stub for SPV receipts</li>
                </ul>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">Determinism tests pass</span>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">Transcript URL</span>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">Gate reasons</span>
            </div>
          </UICard>

          <UICard title="Phase 2 — Pilot (Weeks 5–8)">
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <h4 className="text-sm font-semibold text-slate-900">Replay & Recon</h4>
                <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Replay equality checks with diffs (C8)</li>
                  <li>Provider adapters; map provider_batch_id↔window_id (C11)</li>
                  <li>SPV loop wired to verifiers (C7)</li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900">Observability & SLOs</h4>
                <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Dashboards: watermark lag, proof freshness, TTR (C10)</li>
                  <li>Alerts: DIGEST_MISMATCH, STALE_PROOF, WATERMARK_STALL</li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900">Governance</h4>
                <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Deterministic canary cohorts (C9)</li>
                  <li>N‑window promotion criteria + rollback path</li>
                </ul>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-medium text-sky-700">Pilot tenant live</span>
              <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-medium text-sky-700">SPV receipts</span>
              <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-medium text-sky-700">SLO alerts</span>
            </div>
          </UICard>

          <UICard title="Phase 3 — GA (Weeks 9–12)">
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <h4 className="text-sm font-semibold text-slate-900">Interfaces @ scale</h4>
                <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>#4 Event streaming (Kafka/PubSub)</li>
                  <li>#5 ERP native adaptors</li>
                  <li>#6 SDKs (TS/Go/Java/Python)</li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900">Resilience</h4>
                <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Multi‑AZ; active‑passive DR (RPO≤5m/RTO≤30m)</li>
                  <li>Backpressure & quotas; graceful window holds</li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900">Security & Compliance</h4>
                <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Key rotations; audit exports</li>
                  <li>Policy change logs (append‑only)</li>
                </ul>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">Streaming live</span>
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">DR tested</span>
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">SDKs shipped</span>
            </div>
          </UICard>

          <UICard title="Phase 4 — Scale & Hardening (Ongoing)">
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <h4 className="text-sm font-semibold text-slate-900">Throughput</h4>
                <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Increase K partitions; shard rebalancing playbooks</li>
                  <li>Window close p95 ≤ 15m at target volume</li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900">Coverage</h4>
                <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Additional verifiers (market‑specific)</li>
                  <li>Catalog of reason codes & automated remediations</li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900">Multi‑region</h4>
                <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Active‑active via tenant pinning</li>
                  <li>Chaos drills + audit replay SLAs</li>
                </ul>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">≥120M events/day</span>
              <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">Reason‑code playbooks</span>
              <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">Active‑active</span>
            </div>
          </UICard>
        </div>
      </Section>
    </>
  );
}

/* -------------------- local UI helpers -------------------- */

function Pattern({ rank, title, note }: { rank: number; title: string; note: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="text-base font-semibold text-slate-900">{title}</div>
        <span className="inline-flex min-w-[2rem] items-center justify-center rounded-full bg-slate-900 px-2 py-1 text-xs font-semibold text-white">
          {rank}
        </span>
      </div>
      <div className="mt-1 text-sm text-slate-600">{note}</div>
    </div>
  );
}

function Details({ title, children }: PropsWithChildren<{ title: string }>) {
  return (
    <details className="group rounded-xl border border-slate-200 bg-white/60 p-4">
      <summary className="cursor-pointer select-none text-sm font-semibold text-slate-900 marker:hidden">
        {title}
        <span className="float-right text-slate-500 transition-transform group-open:rotate-180">▾</span>
      </summary>
      <div className="mt-2">{children}</div>
    </details>
  );
}

const coreBoxes = [
  {
    id: "C1",
    title: "Policy Compiler & Manifest",
    desc:
      "Compile declarative policy → IR; fix window cadence, shard function, rounding scale S, acceptance F/Q; sign & version.",
    flow: "Gets: Governance (C9), Security (C2) → Sends: params to C4/C5/C7",
    data: "Git + Manifest table (OLTP); artifacts in object store",
  },
  {
    id: "C2",
    title: "Security & Keys",
    desc: "mTLS everywhere; sign transcript roots & manifests; rotate keys; audit usage.",
    flow: "Gets: Governance (C9) → Sends: signatures to C6 & C1",
    data: "KMS/HSM; key metadata (OLTP)",
  },
  {
    id: "C3",
    title: "Ingestion & Normalizer",
    desc: "Validate schema; idempotency; assign partition_id; canonical timestamps.",
    flow: "Gets: External (CTX-1), mappings (C12) → Sends: canonical events to C4",
    data: "Object store (raw/normalized), Topics; Idempotency index (OLTP)",
  },
  {
    id: "C4",
    title: "Partitioned Logs & Window Manager",
    desc: "Single-writer per partition; lexicographic fold; monotone watermark to close window.",
    flow: "Gets: C3, rules (C1) → Sends: close + ordered stream to C5",
    data: "Compacted topics (open), Window state (OLTP), Archived logs",
  },
  {
    id: "C5",
    title: "Deterministic Execution Engine",
    desc: "i128 accumulation; late quantization; deterministic carry; no FP/wall‑clock/unordered iteration.",
    flow: "Gets: C4, C1 → Sends: allocation records to C6",
    data: "Worker KV + checkpoints (object store)",
  },
  {
    id: "C6",
    title: "Transcripts & Digests (tiered)",
    desc: "Content‑addressed segments (inputs/checkpoints/outputs); output_digest; signed transcript_root.",
    flow: "Gets: C5, signatures (C2) → Sends: root/digest to C7/C8/CTX-2/C11",
    data: "Object store tree + Transcript index (OLTP)",
  },
  {
    id: "C7",
    title: "Verifiers (+ Acceptance Matrix)",
    desc: "Intake ACK/CT/SPV proofs; enforce freshness F & quorum Q; reason-coded outcomes; bind to digest.",
    flow: "Gets: C6, proofs (CTX‑1/3) → Sends: acceptance to CTX‑2; snapshot to C10",
    data: "Acceptance (OLTP); proof artifacts (object store); cache",
  },
  {
    id: "C8",
    title: "Replay & Equivalence",
    desc: "Reproduce solely from transcripts; block on mismatch; store diffs for audit.",
    flow: "Gets: C6 → Sends: equality to CTX‑2/C9/C10",
    data: "Replay job log (OLTP); replay logs (object store)",
  },
  {
    id: "C9",
    title: "Governance & Safe‑Change",
    desc: "Deterministic canary → N clean windows → promotion; rollback; dual‑write for re‑shard.",
    flow: "Gets: C7/C8 → Sends: activation to C1; rules to C4/C6; notif to C10",
    data: "Append‑only governance ledger (OLTP); snapshots",
  },
  {
    id: "C10",
    title: "Observability & KPIs",
    desc: "Metrics, logs, traces; KPIs: time‑to‑release, replay‑equality, proof freshness, watermark lag.",
    flow: "Gets: C4–C8, CTX‑3 → Sends: alerts; feeds C9",
    data: "Prometheus/ELK/Jaeger; Warehouse",
  },
  {
    id: "C11",
    title: "Reconciliation & Provider Adapters",
    desc: "Normalize provider reports; map provider_batch_id ↔ window_id/output_digest; feed SPV.",
    flow: "Gets: CTX‑3 → Sends: SPV to C7; GL maps to C12; metrics to C10",
    data: "Raw drop‑zone (object); normalized receipts (OLTP)",
  },
  {
    id: "C12",
    title: "Connector Layer (ERP/GL/PSP)",
    desc: "Stamp window_id/output_digest/transcript_url/provider_batch_id; filter ALLOW for pay‑runs.",
    flow: "Gets: CTX‑2 decisions, C11 recon → Sends: ERP/GL/PSP in CTX‑1; echoes to C3",
    data: "Connector state (OLTP); payload archives",
  },
];
