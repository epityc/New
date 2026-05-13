const ARCADS_BASE = "https://external-api.arcads.ai";

function headers() {
  return {
    Authorization: `Basic ${Buffer.from(process.env.ARCADS_API_KEY + ":").toString("base64")}`,
    "Content-Type": "application/json",
  };
}

export async function generateImage(prompt: string, referenceUrl?: string) {
  const body: Record<string, unknown> = { prompt, model: "nano-banana-2" };
  if (referenceUrl) body.reference_image_url = referenceUrl;

  const res = await fetch(`${ARCADS_BASE}/generations/images`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Arcads image error: ${await res.text()}`);
  return res.json();
}

export async function generateVideo(
  prompt: string,
  model: "sora-2" | "veo-3.1" | "kling-3" = "sora-2",
  options: Record<string, unknown> = {}
) {
  const res = await fetch(`${ARCADS_BASE}/generations/videos`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ prompt, model, ...options }),
  });
  if (!res.ok) throw new Error(`Arcads video error: ${await res.text()}`);
  return res.json();
}

export async function pollGeneration(id: string, maxAttempts = 60): Promise<{ status: string; url?: string }> {
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise((r) => setTimeout(r, 5000));
    const res = await fetch(`${ARCADS_BASE}/generations/${id}`, { headers: headers() });
    if (!res.ok) continue;
    const data = await res.json();
    if (data.status === "completed" || data.status === "failed") return data;
  }
  return { status: "timeout" };
}
