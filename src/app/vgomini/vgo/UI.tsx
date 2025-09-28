"use client";
import * as React from "react";

export type IconProps = React.SVGProps<SVGSVGElement>;

/** Monochrome line icons (stroke follows currentColor). Keep paths simple & consistent. */
/* ─────────────────────── Base / existing ─────────────────────── */

export const Plane = (p: IconProps) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" {...p}>
    <path d="M21 3L10.5 13.5M21 3l-7.5 18-2.5-8-8-2.5L21 3z"
      fill="none" stroke="currentColor" strokeWidth={1.6}
      strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Repeat = (p: IconProps) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" {...p}>
    <path d="M7 7h10l-2.5-2.5M17 17H7l2.5 2.5"
      fill="none" stroke="currentColor" strokeWidth={1.6}
      strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7 7a5 5 0 015-5m5 15a5 5 0 01-5 5"
      fill="none" stroke="currentColor" strokeOpacity=".45"
      strokeWidth={1.4} strokeLinecap="round" />
  </svg>
);

export const Redo = (p: IconProps) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" {...p}>
    <path d="M21 7v6h-6" fill="none" stroke="currentColor"
      strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M20 13A8 8 0 104 12" fill="none" stroke="currentColor"
      strokeWidth={1.6} strokeLinecap="round" />
  </svg>
);

export const Layers = (p: IconProps) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" {...p}>
    <path d="M12 3l9 5-9 5-9-5 9-5z"
      fill="none" stroke="currentColor" strokeWidth={1.6}
      strokeLinejoin="round" />
    <path d="M21 13l-9 5-9-5M21 17l-9 5-9-5"
      fill="none" stroke="currentColor" strokeOpacity=".7"
      strokeWidth={1.4} strokeLinejoin="round" />
  </svg>
);

export const Seed = (p: IconProps) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" {...p}>
    <path d="M12 21c4.5-3 7-6.5 7-10a7 7 0 00-7-7 7 7 0 00-7 7c0 3.5 2.5 7 7 10z"
      fill="none" stroke="currentColor" strokeWidth={1.6}
      strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 4s1 4-3 6"
      fill="none" stroke="currentColor" strokeOpacity=".65"
      strokeWidth={1.4} strokeLinecap="round" />
  </svg>
);

export const Copy = (p: IconProps) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" {...p}>
    <rect x="9" y="9" width="11" height="11" rx="2"
      fill="none" stroke="currentColor" strokeWidth={1.6} />
    <rect x="4" y="4" width="11" height="11" rx="2"
      fill="none" stroke="currentColor" strokeOpacity=".6"
      strokeWidth={1.4} />
  </svg>
);

export const Refresh = (p: IconProps) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" {...p}>
    <path d="M3 12a9 9 0 019-9 9 9 0 018.5 6M21 12a9 9 0 01-9 9A9 9 0 013.5 15"
      fill="none" stroke="currentColor" strokeWidth={1.6}
      strokeLinecap="round" />
    <path d="M18 4v5h-5"
      fill="none" stroke="currentColor" strokeWidth={1.6}
      strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Code = (p: IconProps) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" {...p}>
    <path d="M8 7L3 12l5 5M16 7l5 5-5 5"
      fill="none" stroke="currentColor" strokeWidth={1.6}
      strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const CheckBadge = (p: IconProps) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" {...p}>
    <path d="M12 3l2.2 1.3L17 5l.7 2.6L19 10l-1.3 2.4L17 15l-2.8.7L12 17l-2.2-1.3L7 15l-.7-2.6L5 10l1.3-2.4L7 5l2.8-.7L12 3z"
      fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinejoin="round" />
    <path d="M8.5 10.5l2.2 2.2 4.6-4.6"
      fill="none" stroke="currentColor" strokeWidth={1.6}
      strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Alert = (p: IconProps) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" {...p}>
    <path d="M12 3l9 16H3l9-16z" fill="none" stroke="currentColor"
      strokeWidth={1.6} strokeLinejoin="round" />
    <path d="M12 9v5M12 17.5h.01" fill="none" stroke="currentColor"
      strokeWidth={1.6} strokeLinecap="round" />
  </svg>
);

export const ChevronRight = (p: IconProps) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" {...p}>
    <path d="M9 6l6 6-6 6" fill="none" stroke="currentColor"
      strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const RotateCcw = (p: IconProps) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" {...p}>
    <path d="M2.5 8V3.5H7" fill="none" stroke="currentColor" strokeWidth={1.6}
      strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 5A9 9 0 1021 12" fill="none" stroke="currentColor"
      strokeWidth={1.6} strokeLinecap="round" />
  </svg>
);

export const Table = (p: IconProps) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2"
      fill="none" stroke="currentColor" strokeWidth={1.6} />
    <path d="M3 10h18M8 5v14M16 5v14"
      fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
  </svg>
);

export const Lock = (p: IconProps) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" {...p}>
    <rect x="5" y="11" width="14" height="9" rx="2"
      fill="none" stroke="currentColor" strokeWidth={1.6} />
    <path d="M8 11V8a4 4 0 118 0v3"
      fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
  </svg>
);

export const Unlock = (p: IconProps) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" {...p}>
    <rect x="5" y="11" width="14" height="9" rx="2"
      fill="none" stroke="currentColor" strokeWidth={1.6} />
    <path d="M16 11V8a4 4 0 00-7.5-2"
      fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
  </svg>
);

export const CloudDown = (p: IconProps) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" {...p}>
    <path d="M6 18a4 4 0 010-8 6 6 0 0111.7-1.6A4.5 4.5 0 1120 18H6z"
      fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
    <path d="M12 9v8M9.5 14.5L12 17l2.5-2.5"
      fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ShieldCheck = (p: IconProps) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" {...p}>
    <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z"
      fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinejoin="round" />
    <path d="M8.5 11.5l2.3 2.3 4.7-4.7"
      fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ArrowStep = (p: IconProps) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" {...p}>
    <path d="M4 12h9" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
    <path d="M9 7l5 5-5 5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16 7h4v10h-4" fill="none" stroke="currentColor" strokeOpacity=".6" strokeWidth={1.4} />
  </svg>
);

export const ClipboardCheck = (p: IconProps) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" {...p}>
    <rect x="6" y="4" width="12" height="16" rx="2"
      fill="none" stroke="currentColor" strokeWidth={1.6} />
    <path d="M9 4h6M8.5 12.5l2.2 2.2 4.3-4.3"
      fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Clock = (p: IconProps) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" {...p}>
    <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth={1.6} />
    <path d="M12 8v5l3 2" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
  </svg>
);

export const Stop = (p: IconProps) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" {...p}>
    <rect x="5" y="5" width="14" height="14" rx="2.5"
      fill="none" stroke="currentColor" strokeWidth={1.6} />
  </svg>
);

/* ─────────────────────── New additions ─────────────────────── */

export const Clipboard = (p: IconProps) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" {...p}>
    <rect x="7" y="5" width="10" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth={1.6} />
    <path d="M9 5h6" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
  </svg>
);

export const Info = (p: IconProps) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" {...p}>
    <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth={1.6} />
    <path d="M12 8.25h.01M11 11h2v6h-2" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
  </svg>
);

export const Play = (p: IconProps) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" {...p}>
    <path d="M8 6l10 6-10 6V6z" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinejoin="round" />
  </svg>
);

export const Pause = (p: IconProps) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" {...p}>
    <path d="M9 6v12M15 6v12" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
  </svg>
);

export const UploadCloud = (p: IconProps) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" {...p}>
    <path d="M6 18a4 4 0 010-8 6 6 0 0111.7-1.6A4.5 4.5 0 1120 18H6z"
      fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
    <path d="M12 17V9M9.5 11.5L12 9l2.5 2.5"
      fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Download = (p: IconProps) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" {...p}>
    <path d="M6 19h12M12 5v9M9.5 11.5L12 14l2.5-2.5"
      fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
  </svg>
);

export const Hash = (p: IconProps) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" {...p}>
    <path d="M4 9h16M3 15h16M9 3L7 21M17 3l-2 18"
      fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
  </svg>
);

export const Activity = (p: IconProps) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" {...p}>
    <path d="M3 12h4l3-6 4 12 3-6h4" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Key = (p: IconProps) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" {...p}>
    <circle cx="9" cy="12" r="3.5" fill="none" stroke="currentColor" strokeWidth={1.6} />
    <path d="M12.5 12H21l-2 2 2 2" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Calendar = (p: IconProps) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" {...p}>
    <rect x="3" y="5" width="18" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth={1.6} />
    <path d="M8 3v4M16 3v4M3 10h18" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
  </svg>
);

export const Partition = (p: IconProps) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" {...p}>
    <rect x="3" y="3" width="18" height="18" rx="2" fill="none" stroke="currentColor" strokeWidth={1.6} />
    <path d="M3 12h18M12 3v18" fill="none" stroke="currentColor" strokeWidth={1.6} />
  </svg>
);

export const Link = (p: IconProps) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" {...p}>
    <path d="M9 8h-2a5 5 0 000 10h2M15 16h2a5 5 0 000-10h-2" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
    <path d="M9 12h6" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
  </svg>
);

export const FileCsv = (p: IconProps) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" {...p}>
    <path d="M7 3h7l5 5v13H7z" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinejoin="round" />
    <path d="M14 3v6h6" fill="none" stroke="currentColor" strokeWidth={1.6} />
    <path d="M9 15h6M9 18h6" fill="none" stroke="currentColor" strokeWidth={1.6} />
  </svg>
);

export const FileJson = (p: IconProps) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" {...p}>
    <path d="M7 3h7l5 5v13H7z" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinejoin="round" />
    <path d="M14 3v6h6" fill="none" stroke="currentColor" strokeWidth={1.6} />
    <path d="M10 15c-1 0-1.5.8-1.5 1.5S9 18 10 18m4 0c1 0 1.5-.8 1.5-1.5S15 15 14 15" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
  </svg>
);

export const FileZip = (p: IconProps) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" {...p}>
    <path d="M7 3h7l5 5v13H7z" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinejoin="round" />
    <path d="M14 3v6h6" fill="none" stroke="currentColor" strokeWidth={1.6} />
    <path d="M11 9v9M13 9v9M11 12h2M11 15h2" fill="none" stroke="currentColor" strokeWidth={1.6} />
  </svg>
);

/* ─────────────────────── Aggregate export (optional) ─────────────────────── */
export const I = {
  Plane, Repeat, Redo, Layers, Seed, Copy, Refresh, Code, CheckBadge, Alert, ChevronRight,
  RotateCcw, Table, Lock, Unlock, CloudDown, ShieldCheck, ArrowStep, ClipboardCheck, Clock, Stop,
  Clipboard, Info, Play, Pause, UploadCloud, Download, Hash, Activity, Key, Calendar, Partition, Link,
  FileCsv, FileJson, FileZip,
} as const;

export default I;
