import { Suspense } from "react";
import SearchClient from "./SearchClient";

export const dynamic = "force-dynamic"; // avoid prerender bailout for query-string usage

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6 text-slate-700">Loading search…</div>}>
      <SearchClient />
    </Suspense>
  );
}
