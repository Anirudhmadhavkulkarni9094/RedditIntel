export default function ReportPreview({ data }: any) {
  return (
    <section className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Key pain points
        </h2>
        <span className="text-xs font-medium text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded">
          Preview
        </span>
      </div>

      <ul className="space-y-3">
        {data.pain_points.slice(0, 4).map((p: string, i: number) => (
          <li
            key={i}
            className="flex gap-3 text-sm text-gray-700 leading-relaxed"
          >
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-500 flex-shrink-0" />
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
