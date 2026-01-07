import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function generateAnalysis(posts: any[], subreddit: string) {
  const prompt = `
You are a market research analyst.
Analyze Reddit posts from r/${subreddit}.
Return STRICT JSON with:
{
  "pain_points": string[],
  "job_categories": { "category": string, "frequency": number }[],
  "pay_insights": string,
  "scam_signals": string[],
  "market_opportunities": string[]
}
Posts:
${posts.map((p, i) => `
POST ${i + 1}
Title: ${p.title}
Body: ${p.body}
`).join("\n")}
`;

  const res = await openai.chat.completions.create({
    model: "gpt-5-mini",
    messages: [{ role: "user", content: prompt }],
  });

  return JSON.parse(res.choices[0].message.content!);
}
