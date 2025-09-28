// src/app/vgomini/page.tsx
// Server component on purpose (no "use client") to avoid hydration pitfalls.
// VGOmini renders its actual UI via parallel route slots in layout.tsx.
// This stub simply exists to satisfy the /vgomini route.

export default function VGOminiIndex() {
  return (
    <div className="px-4 py-3 text-[12px] text-slate-500">
      {/* VGOmini loads steps via the chevron layout. Nothing to render here. */}
    </div>
  );
}
