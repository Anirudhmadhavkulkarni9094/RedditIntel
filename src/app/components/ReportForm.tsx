"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ReportForm() {
  const router = useRouter();
  const [subreddits, setSubreddits] = useState("IndianFreelancers");
  const [posts, setPosts] = useState(40);
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    router.push(
      `/report?subs=${subreddits}&posts=${posts}`
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6 border rounded-lg">
      <label className="block mb-2 font-medium">
        Subreddits (comma separated)
      </label>
      <input
        className="w-full p-2 border rounded mb-4 focus:ring-2 focus:ring-indigo-500"
        value={subreddits}
        onChange={(e) => setSubreddits(e.target.value)}
        placeholder="IndianFreelancers, startups"
      />

      <label className="block mb-2 font-medium">
        Posts per subreddit
      </label>
      <select
        className="w-full p-2 border rounded mb-4 focus:ring-2 focus:ring-indigo-500"
        value={posts}
        onChange={(e) => setPosts(Number(e.target.value))}
      >
        <option value={10}>10</option>
        <option value={40}>40</option>
        <option value={100}>100</option>
      </select>

     <button
  onClick={submit}
  className="w-full rounded-md bg-indigo-600 text-white py-2.5 text-sm font-medium hover:bg-indigo-700 transition"
>
  Generate report
</button>

    </div>
  );
}
