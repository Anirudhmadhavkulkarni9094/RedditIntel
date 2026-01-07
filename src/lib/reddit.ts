export async function fetchRedditPosts({
  subreddit,
  sort,
  timeRange,
  limit,
}: {
  subreddit: string;
  sort: string;
  timeRange: string;
  limit: number;
}) {
  const url = `https://www.reddit.com/r/${subreddit}/${sort}.json?t=${timeRange}&limit=${limit}`;

  const res = await fetch(url, {
    headers: { "User-Agent": "redditSignal/1.0" },
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Reddit fetch failed");

  const json = await res.json();

  return json.data.children
    .map((c: any) => ({
      title: c.data.title,
      body: c.data.selftext || "",
      ups: c.data.ups,
      comments: c.data.num_comments,
      flair: c.data.link_flair_text,
    }))
    .filter(
      (p: any) =>
        (p.ups >= 5 || p.comments >= 5) &&
        (p.title.length > 15 || p.body.length > 40)
    );
}
