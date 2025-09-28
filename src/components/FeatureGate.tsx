"use client";
import React from "react";

export function FeatureGate({
  flag = "exclusive_content",
  children,
  fallback,
  onRequest
}: {
  flag?: "exclusive_content";
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onRequest?: () => void; // open the survey modal
}) {
  const [enabled, setEnabled] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`/api/access/check?f=${flag}`, { cache: "no-store" });
        const j = await r.json();
        setEnabled(!!j?.granted);
      } catch { setEnabled(false); }
    })();
  }, [flag]);

  if (enabled === null) return null;
  if (enabled) return <>{children}</>;
  return <span onClick={onRequest} className="cursor-pointer">{fallback ?? children}</span>;
}
