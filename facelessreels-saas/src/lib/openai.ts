import OpenAI from "openai";
import { NICHES } from "./constants";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function buildPrompt(topic: string, niche: string | null, language: string, duration: number): string {
  const nicheLabel = NICHES.find((n) => n.id === niche)?.label ?? niche ?? "general";
  const wordTarget = Math.round((duration / 60) * 130); // ~130 wpm
  const lang = language === "fr" ? "French" : "English";

  return `You are a viral short-form video scriptwriter for TikTok and Instagram Reels.

Write a ${lang} voiceover script for a ${duration}-second faceless video about: "${topic || nicheLabel}".

Rules:
- Target exactly ~${wordTarget} words (for ${duration}s at 130 wpm)
- Start with a strong hook that stops the scroll in the first 3 seconds
- Use short punchy sentences. No filler words.
- Do NOT include stage directions, titles, or timestamps
- Do NOT use markdown — plain text only
- End with a strong call-to-action (like, follow, comment)
- Write ONLY the voiceover text, nothing else`;
}

export async function generateScript(
  topic: string,
  niche: string | null,
  language: string,
  duration: number
): Promise<string> {
  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: buildPrompt(topic, niche, language, duration) }],
    temperature: 0.85,
    max_tokens: 600,
  });
  return completion.choices[0].message.content?.trim() ?? "";
}
