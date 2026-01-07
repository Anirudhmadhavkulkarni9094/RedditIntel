"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ReportPreview from "../components/ReportPreview";
import ReportFull from "../components/ReportFull";

export default function ReportPage() {
  const searchParams = useSearchParams();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showFullReport, setShowFullReport] = useState(false);

  useEffect(() => {
    async function fetchReport() {
      const subsParam = searchParams.get("subs");
      const postsParam = searchParams.get("posts");

      if (!subsParam || !postsParam) return;

      const subs = subsParam.split(",");
      const posts = Number(postsParam);

      const res = await fetch("/api/reports/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-session-id": localStorage.getItem("session_id") || "",
        },
        body: JSON.stringify({
          subreddit: subs[0],
          limit: posts,
          useAI: true,
        }),
      });

      const json = await res.json();
      setData(json.report);
      setLoading(false);
    }

    fetchReport();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-gray-500">
        Analyzing discussions...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Preview always visible */}
      <ReportPreview data={data} />

      {/* Lock / Unlock section */}
      {!showFullReport && (
        <div className="relative rounded-xl border border-gray-200 bg-white p-6 text-center">
          <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-white pointer-events-none" />

          <h3 className="text-lg font-semibold text-gray-900">
            Unlock full market analysis
          </h3>

          <p className="mt-2 text-sm text-gray-600 max-w-md mx-auto">
            Get the complete breakdown of risks, scams, and opportunities
            identified from real Reddit conversations.
          </p>

          <button
            onClick={() => setShowFullReport(true)}
            className="mt-5 inline-flex items-center justify-center rounded-md bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition"
          >
            Unlock full report
          </button>

          <p className="mt-3 text-xs text-gray-500">
            One-time unlock • Instant access
          </p>
        </div>
      )}

      {/* Full report */}
      {showFullReport && <ReportFull data={data} />}
    </div>
  );
}
