export default function ReportFull({ data }: any) {
  return (
    <section className="mt-10">
      {/* ================= TITLE ================= */}
      <h2 className="text-2xl font-semibold tracking-tight text-gray-900 mb-8">
        Full market analysis
      </h2>

      {/* ================= EXECUTIVE SUMMARY ================= */}
      <div className="mb-10 rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-4">
          Executive summary
        </h3>

        <ul className="space-y-2 text-sm text-gray-700 leading-relaxed">
          <li>
            • Demand exists across roles, but pricing power is weak for
            low-skill and microtask-based work.
          </li>
          <li>
            • Trust breakdown and scam signals are a dominant friction,
            impacting both freelancers and legitimate hirers.
          </li>
          <li>
            • Strong opportunity for verified, escrow-backed platforms and
            bundled service offerings.
          </li>
        </ul>
      </div>

      {/* ================= PAIN POINTS ================= */}
      <div className="mb-10 rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-4">
          Pain points
        </h3>

        <ul className="space-y-3">
          {data.pain_points.map((p: string, i: number) => (
            <li
              key={i}
              className="flex gap-3 text-sm text-gray-700 leading-relaxed"
            >
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-gray-400 flex-shrink-0" />
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* ================= SCAM SIGNALS ================= */}
      <div className="mb-10 rounded-xl border border-red-200 bg-red-50/40 p-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-red-600 mb-4">
          Scam signals
        </h3>

        <ul className="space-y-3">
          {data.scam_signals.map((s: string, i: number) => (
            <li
              key={i}
              className="flex gap-3 text-sm text-gray-700 leading-relaxed"
            >
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-red-500 flex-shrink-0" />
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* ================= MARKET OPPORTUNITIES ================= */}
      <div className="rounded-xl border border-indigo-200 bg-indigo-50/40 p-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-indigo-600 mb-4">
          Market opportunities
        </h3>

        <ul className="space-y-3">
          {data.market_opportunities.map((m: string, i: number) => (
            <li
              key={i}
              className="flex gap-3 text-sm text-gray-700 leading-relaxed"
            >
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-500 flex-shrink-0" />
              <span>{m}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* ================= WHO THIS IS FOR ================= */}
      <div className="mt-12 rounded-xl border border-indigo-200 bg-indigo-50/40 p-6">
        <h3 className="text-sm font-semibold text-indigo-700 mb-2">
          Who should use this report
        </h3>
        <p className="text-sm text-gray-700 leading-relaxed">
          Founders validating marketplace ideas, agencies pricing services,
          product teams researching user pain points, and investors evaluating
          labor-market inefficiencies.
        </p>
      </div>
    </section>
  );
}
