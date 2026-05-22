const DANSUGC_BASE = "https://dansugc.com/api";

function headers() {
  return {
    Authorization: `Bearer ${process.env.DANSUGC_API_KEY}`,
    "Content-Type": "application/json",
  };
}

export async function searchVideos(query: string, emotion?: string) {
  const params = new URLSearchParams({ query });
  if (emotion) params.set("emotion", emotion);
  const res = await fetch(`${DANSUGC_BASE}/videos/search?${params}`, { headers: headers() });
  if (!res.ok) throw new Error(`DanSUGC search error: ${await res.text()}`);
  return res.json();
}

export async function purchaseVideos(videoIds: string[]) {
  const res = await fetch(`${DANSUGC_BASE}/videos/purchase`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ video_ids: videoIds }),
  });
  if (!res.ok) throw new Error(`DanSUGC purchase error: ${await res.text()}`);
  return res.json();
}

export async function getBalance() {
  const res = await fetch(`${DANSUGC_BASE}/balance`, { headers: headers() });
  if (!res.ok) throw new Error(`DanSUGC balance error: ${await res.text()}`);
  return res.json();
}

export async function listPostingAccounts() {
  const res = await fetch(`${DANSUGC_BASE}/posting/accounts`, { headers: headers() });
  if (!res.ok) throw new Error(`DanSUGC accounts error: ${await res.text()}`);
  return res.json();
}

export async function createPost({
  content,
  mediaUrl,
  accountIds,
  scheduledFor,
  publishNow = false,
}: {
  content: string;
  mediaUrl: string;
  accountIds: string[];
  scheduledFor?: string;
  publishNow?: boolean;
}) {
  const res = await fetch(`${DANSUGC_BASE}/posting/posts`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      content,
      media_urls: [mediaUrl],
      account_ids: accountIds,
      ...(publishNow ? { publish_now: true } : { scheduled_for: scheduledFor }),
    }),
  });
  if (!res.ok) throw new Error(`DanSUGC post error: ${await res.text()}`);
  return res.json();
}

export async function getAnalytics(range = "30d") {
  const res = await fetch(`${DANSUGC_BASE}/posting/analytics?range=${range}`, { headers: headers() });
  if (!res.ok) throw new Error(`DanSUGC analytics error: ${await res.text()}`);
  return res.json();
}
