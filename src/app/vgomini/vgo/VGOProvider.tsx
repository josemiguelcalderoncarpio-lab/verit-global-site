"use client";

import React, {createContext, useContext, useEffect, useMemo, useState} from "react";

/** Keep these keys aligned with your @box folder names */
export const STEP_ORDER = [
  "gateway",
  "intake",
  "order",
  "accumulate",
  "policy",
  "carry",
  "seal",
  "acceptance",
  "export",
] as const;
export type StepKey = typeof STEP_ORDER[number];

type Status = "Pending" | "Ready";

type Ctx = {
  activeKey: StepKey;
  setActiveKey: (k: StepKey) => void;

  /** Per-step flags */
  completeMap: Partial<Record<StepKey, boolean>>;
  canContinueMap: Partial<Record<StepKey, boolean>>;
  statusMap: Partial<Record<StepKey, Status>>;

  /** Mutators used by boxes */
  setComplete: (k: StepKey, v: boolean) => void;
  setCanContinue: (k: StepKey, v: boolean) => void;
  setStatus: (k: StepKey, s: Status) => void;

  /** Chevron/step lock logic */
  isLocked: (k: StepKey) => boolean;
  goNext: () => void;
};

const Ctx = createContext<Ctx | null>(null);
export const useVGO = () => useContext(Ctx)!;

export function VGOProvider({children}: {children: React.ReactNode}) {
  const [activeKey, setActiveKey] = useState<StepKey>("gateway");
  const [completeMap, setCompleteMap] = useState<Partial<Record<StepKey, boolean>>>({});
  const [canContinueMap, setCanContinueMap] = useState<Partial<Record<StepKey, boolean>>>({});
  const [statusMap, setStatusMap] = useState<Partial<Record<StepKey, Status>>>({ gateway: "Pending" });

  /** mutate helpers exposed to boxes */
  const setComplete = (k: StepKey, v: boolean) =>
    setCompleteMap(prev => ({...prev, [k]: v}));
  const setCanContinue = (k: StepKey, v: boolean) =>
    setCanContinueMap(prev => ({...prev, [k]: v}));
  const setStatus = (k: StepKey, s: Status) =>
    setStatusMap(prev => ({...prev, [k]: s}));

  /** lock rule: a step is locked if any previous step is not marked canContinue/complete */
  const isLocked = (k: StepKey) => {
    const idx = STEP_ORDER.indexOf(k);
    if (idx <= 0) return false;
    for (let i = 0; i < idx; i++) {
      const prev = STEP_ORDER[i];
      if (!completeMap[prev] && !canContinueMap[STEP_ORDER[i+1] as StepKey]) return true;
    }
    return false;
  };

  const goNext = () => {
    const i = STEP_ORDER.indexOf(activeKey);
    const nxt = STEP_ORDER[i + 1];
    if (!nxt) return;
    if (!isLocked(nxt)) setActiveKey(nxt);
  };

  /** allow “Continue to Intake” button in Gateway to navigate (only if allowed) */
  useEffect(() => {
    function onGotoIntake() {
      const allowed = canContinueMap["intake"] || completeMap["gateway"];
      if (allowed) setActiveKey("intake");
    }
    window.addEventListener("vgo:goto-intake", onGotoIntake as EventListener);
    return () => window.removeEventListener("vgo:goto-intake", onGotoIntake as EventListener);
  }, [canContinueMap, completeMap]);

  const value = useMemo<Ctx>(() => ({
    activeKey, setActiveKey,
    completeMap, canContinueMap, statusMap,
    setComplete, setCanContinue, setStatus,
    isLocked, goNext,
  }), [activeKey, completeMap, canContinueMap, statusMap]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
