import { NICHES, ART_STYLES } from "./constants";

interface PexelsVideo {
  id: number;
  video_files: { link: string; quality: string; width: number; height: number }[];
}

interface PexelsResponse {
  videos: PexelsVideo[];
}

function buildQuery(artStyle: string, niche: string | null): string {
  const styleQuery = ART_STYLES.find((s) => s.id === artStyle)?.pexelsQuery ?? "cinematic landscape";
  const nicheQuery = NICHES.find((n) => n.id === niche)?.pexelsQuery;
  return nicheQuery ?? styleQuery;
}

function pickBestFile(video: PexelsVideo): string | null {
  // Prefer HD portrait (vertical 9:16) or landscape, fallback to any
  const sorted = [...video.video_files].sort((a, b) => {
    const scoreA = a.quality === "hd" ? 2 : a.quality === "sd" ? 1 : 0;
    const scoreB = b.quality === "hd" ? 2 : b.quality === "sd" ? 1 : 0;
    return scoreB - scoreA;
  });
  return sorted[0]?.link ?? null;
}

export async function fetchPexelsFootage(
  artStyle: string,
  niche: string | null,
  count = 5
): Promise<string[]> {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) throw new Error("PEXELS_API_KEY is not set");

  const query = buildQuery(artStyle, niche);
  const url = `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=${count * 2}&orientation=portrait`;

  const res = await fetch(url, { headers: { Authorization: apiKey } });
  if (!res.ok) throw new Error(`Pexels API error: ${res.status}`);

  const data: PexelsResponse = await res.json();
  const links = data.videos
    .map(pickBestFile)
    .filter((l): l is string => l !== null)
    .slice(0, count);

  return links;
}
