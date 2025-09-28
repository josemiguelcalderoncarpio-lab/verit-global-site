// src/app/layout.tsx
import "./globals.css";
import Header from "../components/Header";
import DevToolbar from "@/components/dev/DevToolbar"; // ← add this line

export const metadata = {
  title: "Verit Global",
  description: "Deterministic payout engine (VGoS) — investor site",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const isDev = process.env.NODE_ENV !== "production"; // evaluated server-side
  return (
    <html lang="en">
      {/* Larger, more readable base text */}
      <body className="min-h-screen bg-white text-slate-900 antialiased text-[15px] sm:text-base leading-relaxed">
        <Header />
        <main className="bg-white">{children}</main>
        <footer className="mt-16 border-t border-slate-200">
          <div className="mx-auto max-w-7xl px-4 py-8 text-center text-sm text-slate-500 md:px-6">
            © {new Date().getFullYear()} Verit Global, Inc. All rights reserved.
          </div>
        </footer>

        {isDev && <DevToolbar />} {/* ← shows only in DEV; excluded from prod bundles */}
      </body>
    </html>
  );
}
