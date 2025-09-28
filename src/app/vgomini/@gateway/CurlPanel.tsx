"use client";

import React from "react";

export function CurlPanel({ snippet }: { snippet: string }) {
  return (
    <pre className="mt-2 max-h-48 overflow-auto rounded border border-slate-200 bg-slate-50 p-2 text-[12px] leading-[1.35] text-slate-800">
      {snippet || "# Toggle 'Show code' to generate a tailored curl snippet…"}
    </pre>
  );
}
