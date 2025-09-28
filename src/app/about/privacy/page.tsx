import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — Verit Global",
  description: "How we collect, use, and protect information at Verit Global Labs.",
};

export default function PrivacyPage() {
  const today = new Date().toISOString().slice(0, 10);
  return (
    <main className="bg-white">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
        <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">Privacy Policy</h1>
        <p className="mt-2 text-sm text-slate-700">Last updated: {today}</p>

        {/* High-contrast typography */}
        <div className="mt-6 space-y-5 text-[15.5px] leading-7 text-slate-800 sm:text-base">
          <h2 className="mt-8 text-xl font-semibold text-slate-900">Who we are</h2>
          <p>
            We provide <strong className="font-semibold text-slate-900">payment solutions for complex, high-volume payouts</strong>, and related{" "}
            <strong className="font-semibold text-slate-900">AI/data processing products and services</strong>.
          </p>

          <h2 className="mt-8 text-xl font-semibold text-slate-900">Information we collect</h2>
          <ul className="list-disc pl-5">
            <li><span className="font-semibold text-slate-900">You provide:</span> name, work email, company, role, form/survey inputs.</li>
            <li><span className="font-semibold text-slate-900">Automatic:</span> device/browser data, cookies or similar technologies, general location, interaction and campaign data.</li>
            <li><span className="font-semibold text-slate-900">Derived:</span> internal metrics and outputs we generate (which may include AI/ML).</li>
          </ul>

          <h2 className="mt-8 text-xl font-semibold text-slate-900">How we use information</h2>
          <p>
            We use information to operate and improve our sites and services; deliver content and demos you request; secure and maintain our systems;
            communicate with you (service messages and—if you opt in—marketing); perform research and analytics; and support business operations.
          </p>

          <h2 className="mt-8 text-xl font-semibold text-slate-900">Analytics, aggregation, and derived data</h2>
          <p>
            We may analyze, aggregate, de-identify, synthesize, or otherwise transform information to create <strong className="font-semibold text-slate-900">insights and data products</strong> (including <strong className="font-semibold text-slate-900">synthetic/model-generated data</strong>) for internal use or external programs and commercial offerings. These outputs are designed not to reveal personal information.
          </p>

          <h2 className="mt-8 text-xl font-semibold text-slate-900">Sharing</h2>
          <p>
            We share information with service providers and partners that help us operate our services. We may provide aggregated, de-identified, or derived outputs to third parties. We do not disclose personal information in a way that identifies you unless we have a lawful basis.
          </p>

          <h2 className="mt-8 text-xl font-semibold text-slate-900">Your choices</h2>
          <p>
            You can opt out of marketing at any time. Where applicable, you may request access, correction, deletion, portability, or object to certain processing by contacting{" "}
            <a href="mailto:privacy@veritglobal.com" className="text-blue-700 underline underline-offset-2">privacy@veritglobal.com</a>.
          </p>

          <h2 className="mt-8 text-xl font-semibold text-slate-900">Transfers, retention, security</h2>
          <p>
            Information may be processed where we or our providers operate. We retain information as needed for the purposes above and take reasonable measures to protect it.
          </p>

          <h2 className="mt-8 text-xl font-semibold text-slate-900">Children</h2>
          <p>Our services are not directed to children.</p>

          <h2 className="mt-8 text-xl font-semibold text-slate-900">Changes</h2>
          <p>We may update this policy; the “Last updated” date shows the current version.</p>

          <p className="mt-10">
            <Link href="/about" className="text-blue-700 underline underline-offset-2">
              ← Back to About
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
