/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import crypto from "crypto";
import axios from "axios";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";

/* ================= CONFIG ================= */
const BATCH_SIZE = 50;
const MAX_BATCHES = 3;
const ALLOWED_LIMITS = [10, 20, 40, 100];
const PROMPT_VERSION = "v1";
const DEBUG = process.env.NODE_ENV !== "production";

const HIGH_SIGNAL_FLAIRS = ["Hiring", "Question", "Discussion", "Advice"];

const REDDIT_HEADERS = {
  "User-Agent":
    "web:RedditSignal:v1.0 (contact: support@redditsignal.com)",
  Accept: "application/json",
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

function log(...args: any[]) {
  if (DEBUG) console.log("[reddit-signal]", ...args);
}

/* ================= HELPERS ================= */
function makeFiltersHash(input: object) {
  return crypto
    .createHash("sha256")
    .update(JSON.stringify(input))
    .digest("hex");
}

function cleanText(text = "") {
  return text.replace(/http\S+/g, "").replace(/\s+/g, " ").slice(0, 400);
}

function isQuestion(title = "") {
  const t = title.toLowerCase();
  return (
    t.endsWith("?") ||
    t.startsWith("how") ||
    t.startsWith("why") ||
    t.startsWith("what")
  );
}

function flairScore(flair?: string) {
  if (!flair) return 0;
  return HIGH_SIGNAL_FLAIRS.includes(flair) ? 10 : -5;
}

function scorePost(post: any) {
  let score = 0;
  score += Math.min(post.ups || 0, 50);
  score += Math.min(post.num_comments || 0, 50);
  score += Math.min((post.selftext?.length || 0) / 50, 20);

  const ratio = post.num_comments / Math.max(post.ups, 1);
  if (ratio > 0.2) score += 10;
  if (ratio > 0.5) score += 20;

  if (isQuestion(post.title)) score += 15;
  score += flairScore(post.link_flair_text);

  const ageHours =
    (Date.now() / 1000 - post.created_utc) / 3600;
  if (ageHours < 72) score += 15;
  else if (ageHours < 168) score += 5;

  return score;
}

function isHighSignal(post: any) {
  return (
    post.ups >= 5 ||
    post.num_comments >= 5 ||
    post.selftext?.length >= 120
  );
}

/* ================= REDDIT (AXIOS) ================= */
async function fetchBatch(url: string, retries = 2) {
  try {
    const res = await axios.get(url, {
      headers: REDDIT_HEADERS,
      timeout: 8000,
      maxRedirects: 5,
    });
    return res.data;
  } catch (err: any) {
    const status = err?.response?.status;

    log("Reddit fetch error", status || err.message);

    if (status === 429 && retries > 0) {
      await new Promise(r => setTimeout(r, 1000));
      return fetchBatch(url, retries - 1);
    }

    throw new Error("Reddit fetch failed");
  }
}

async function fetchSubredditBatch(
  subreddit: string,
  sort: string,
  timeRange: string,
  after: string | null
) {
  const url = new URL(
    `https://old.reddit.com/r/${subreddit}/${sort}.json`
  );
  url.searchParams.set("limit", BATCH_SIZE.toString());
  url.searchParams.set("t", timeRange);
  if (after) url.searchParams.set("after", after);

  const json = await fetchBatch(url.toString());
  return {
    posts: json.data.children.map((c: any) => c.data),
    after: json.data.after,
  };
}

/* ================= TOON PARSER ================= */
function parseTOON(toon: string) {
  const lines = toon.split("\n").map(l => l.trim()).filter(Boolean);

  const result = {
    pain_points: [] as string[],
    scam_signals: [] as string[],
    market_opportunities: [] as string[],
  };

  let section: "pain" | "scam" | "opp" | null = null;

  for (const line of lines) {
    const lower = line.toLowerCase();

    if (lower.startsWith("pain_points")) {
      section = "pain";
      const t = line.replace(/^pain_points\[\]\s*/i, "").trim();
      if (t.length > 5) result.pain_points.push(t);
      continue;
    }

    if (lower.startsWith("scam_signals")) {
      section = "scam";
      const t = line.replace(/^scam_signals\[\]\s*/i, "").trim();
      if (t.length > 5) result.scam_signals.push(t);
      continue;
    }

    if (lower.startsWith("opportunit")) {
      section = "opp";
      const t = line.replace(/^opportunities\[\]\s*/i, "").trim();
      if (t.length > 5) result.market_opportunities.push(t);
      continue;
    }

    const cleaned = line.replace(/^[-•*]/, "").trim();
    if (cleaned.length < 8) continue;

    if (section === "pain") result.pain_points.push(cleaned);
    if (section === "scam") result.scam_signals.push(cleaned);
    if (section === "opp") result.market_opportunities.push(cleaned);
  }

  return result;
}

/* ================= POST API ================= */
export async function POST(req: NextRequest) {
  try {
    const { subreddit, sort = "top", timeRange = "week", limit = 20 } =
      await req.json();

    log("REQUEST", { subreddit, sort, timeRange, limit });

    if (!subreddit)
      return NextResponse.json({ error: "subreddit required" }, { status: 400 });

    if (!ALLOWED_LIMITS.includes(limit))
      return NextResponse.json({ error: "Invalid limit" }, { status: 400 });

    const filtersHash = makeFiltersHash({
      subreddit,
      sort,
      timeRange,
      limit,
    });

    /* ===== CACHE ===== */
    const { data: cached } = await supabase
      .from("subreddit_reports")
      .select("id, report_json, total_views")
      .eq("platform", "reddit")
      .eq("filters_hash", filtersHash)
      .eq("prompt_version", PROMPT_VERSION)
      .maybeSingle();

    if (cached) {
      log("CACHE HIT");
      await supabase
        .from("subreddit_reports")
        .update({ total_views: (cached.total_views || 0) + 1 })
        .eq("id", cached.id);

      return NextResponse.json({ cached: true, report: cached.report_json });
    }

    /* ===== REDDIT COLLECTION ===== */
    let collected: any[] = [];
    let after: string | null = null;
    let batches = 0;
    const seen = new Set<string>();

    while (collected.length < limit && batches < MAX_BATCHES) {
      batches++;
      log("Fetching batch", batches);

      const batch = await fetchSubredditBatch(
        subreddit,
        sort,
        timeRange,
        after
      );
      after = batch.after;

      for (const p of batch.posts) {
        if (!isHighSignal(p)) continue;

        const key = (p.title + p.selftext).slice(0, 120).toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);

        collected.push({
          score: scorePost(p),
          text: `${cleanText(p.title)} — ${cleanText(p.selftext || "")}`,
        });
      }

      if (!after) break;
    }

    const selected = collected
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    log("Selected posts", selected.length);

    /* ===== AI ===== */
    const prompt = `
You are a market signal extractor.

Analyze Reddit posts from r/${subreddit}.

Rules:
- Extract recurring patterns only
- Ignore one-off opinions
- Focus on complaints, risks, monetizable gaps

Output strictly in TOON.

PAIN_POINTS[]
SCAM_SIGNALS[]
OPPORTUNITIES[]

POSTS:
${selected.map((p, i) => `POST ${i + 1}\n${p.text}`).join("\n")}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-5-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0,
    });

    const parsed = parseTOON(
      completion.choices[0].message.content || ""
    );

    const reportPayload = {
      pain_points: parsed.pain_points,
      scam_signals: parsed.scam_signals,
      market_opportunities: parsed.market_opportunities,
    };

    await supabase.from("subreddit_reports").insert({
      platform: "reddit",
      subreddit,
      date_from: new Date(Date.now() - 7 * 86400000),
      date_to: new Date(),
      post_count: selected.length,
      filters_hash: filtersHash,
      prompt_version: PROMPT_VERSION,
      report_json: reportPayload,
      ai_used: true,
    });

    return NextResponse.json({
      cached: false,
      report: reportPayload,
      generated_at: new Date().toISOString(),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
