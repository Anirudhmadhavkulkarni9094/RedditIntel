import { Suspense } from "react";
import ReportClient from "./ReportClient";

export default function ReportPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-4xl mx-auto p-6 text-gray-500">
          Loading report…
        </div>
      }
    >
      <ReportClient />
    </Suspense>
  );
}
