const ELEVENLABS_BASE = "https://api.elevenlabs.io/v1";

function headers() {
  return {
    "xi-api-key": process.env.ELEVENLABS_API_KEY!,
    "Content-Type": "application/json",
  };
}

export const SAFE_VOICES = [
  { id: "cgSgspJ2msm6clMCkdW9", name: "Jessica", style: "Playful, Gen-Z" },
  { id: "XrExE9yKIg1WjnnlVkGX", name: "Matilda", style: "Professionnelle" },
  { id: "EXAVITQu4vr4xnSDxMaL", name: "Sarah", style: "Douce, empathique" },
  { id: "9BWtsMINqrJLrRacOk9x", name: "Aria", style: "Confiante, résultats" },
];

export async function generateVoiceover(
  text: string,
  voiceId = "cgSgspJ2msm6clMCkdW9"
): Promise<{ audioBase64: string; timestamps: unknown }> {
  const res = await fetch(
    `${ELEVENLABS_BASE}/text-to-speech/${voiceId}/with-timestamps`,
    {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: { speed: 1.05, stability: 0.45, similarity_boost: 0.8 },
      }),
    }
  );
  if (!res.ok) throw new Error(`ElevenLabs error: ${await res.text()}`);
  const data = await res.json();
  return { audioBase64: data.audio_base64, timestamps: data.alignment };
}
