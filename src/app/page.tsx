import ReportForm from "./components/ReportForm";

export default function HomePage() {
  return (
    <main className="bg-white text-gray-900">
      {/* ================= HEADER ================= */}
      <header className="max-w-5xl mx-auto px-6 py-6 flex justify-between items-center">
        <span className="font-semibold text-indigo-600">
          RedditSignal
        </span>
        <span className="text-sm text-gray-500">
          Market intelligence
        </span>
      </header>

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50 to-white" />

        <div className="relative max-w-5xl mx-auto px-6 pt-24 pb-20">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight max-w-3xl">
            Market insights from real
            <span className="block text-indigo-600">
              Reddit conversations
            </span>
          </h1>

          <p className="mt-5 text-lg text-gray-600 max-w-2xl">
            Analyze discussions from any subreddit to identify pain points,
            pricing signals, scams, and unmet opportunities.
          </p>

          {/* Inline form */}
          <div className="mt-10 rounded-xl border border-indigo-100 bg-white shadow-sm max-w-xl">
            <div className="p-6">
              <ReportForm />
            </div>
          </div>

          <p className="mt-4 text-sm text-gray-500">
            No login required • Free preview • Instant report
          </p>
        </div>
      </section>

      {/* ================= VALUE ================= */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-sm">
          <div>
            <p className="font-medium text-indigo-600">
              Real demand
            </p>
            <p className="mt-2 text-gray-600">
              Insights based on unfiltered user conversations.
            </p>
          </div>

          <div>
            <p className="font-medium text-indigo-600">
              Structured output
            </p>
            <p className="mt-2 text-gray-600">
              Clean summaries you can use immediately.
            </p>
          </div>

          <div>
            <p className="font-medium text-indigo-600">
              Cost-efficient
            </p>
            <p className="mt-2 text-gray-600">
              Cached reports keep pricing low and fast.
            </p>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="bg-indigo-50">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-sm">
            <div>
              <span className="text-indigo-400 font-medium">01</span>
              <p className="mt-2 font-medium">
                Choose subreddits
              </p>
              <p className="mt-2 text-gray-600">
                Select communities and post volume.
              </p>
            </div>

            <div>
              <span className="text-indigo-400 font-medium">02</span>
              <p className="mt-2 font-medium">
                We analyze
              </p>
              <p className="mt-2 text-gray-600">
                High-signal posts are filtered and analyzed.
              </p>
            </div>

            <div>
              <span className="text-indigo-400 font-medium">03</span>
              <p className="mt-2 font-medium">
                Get insights
              </p>
              <p className="mt-2 text-gray-600">
                Download a structured market report.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="max-w-5xl mx-auto px-6 py-10 text-sm text-gray-500 flex flex-col md:flex-row justify-between gap-4">
        <span>
          © {new Date().getFullYear()} RedditSignal
        </span>
        <span>
          Built for founders, marketers, and analysts
        </span>
      </footer>
    </main>
  );
}
