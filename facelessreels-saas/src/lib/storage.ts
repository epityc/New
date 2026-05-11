const SUPABASE_URL = process.env.SUPABASE_URL!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const BUCKET = "videos";

export async function uploadAudio(buffer: Buffer, videoId: string): Promise<string> {
  const path = `${videoId}/audio.mp3`;
  const url = `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${path}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      "Content-Type": "audio/mpeg",
      "x-upsert": "true",
    },
    body: buffer,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Supabase upload error ${res.status}: ${err}`);
  }

  // Return public URL
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`;
}

export async function uploadVideo(buffer: Buffer, videoId: string): Promise<string> {
  const path = `${videoId}/final.mp4`;
  const url = `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${path}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      "Content-Type": "video/mp4",
      "x-upsert": "true",
    },
    body: buffer,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Supabase upload error ${res.status}: ${err}`);
  }

  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`;
}
