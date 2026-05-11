export interface WordTimestamp {
  word: string;
  start: number; // seconds
  end: number;
}

interface ElevenLabsTimestampResponse {
  audio_base64: string;
  alignment: {
    characters: string[];
    character_start_times_seconds: number[];
    character_end_times_seconds: number[];
  };
}

function charTimestampsToWords(alignment: ElevenLabsTimestampResponse["alignment"]): WordTimestamp[] {
  const { characters, character_start_times_seconds, character_end_times_seconds } = alignment;
  const words: WordTimestamp[] = [];
  let wordChars: string[] = [];
  let wordStart = 0;

  for (let i = 0; i < characters.length; i++) {
    const ch = characters[i];
    if (ch === " " || i === characters.length - 1) {
      if (i === characters.length - 1 && ch !== " ") wordChars.push(ch);
      if (wordChars.length > 0) {
        words.push({
          word: wordChars.join(""),
          start: wordStart,
          end: character_end_times_seconds[i - (ch === " " ? 1 : 0)],
        });
        wordChars = [];
      }
      if (ch === " ") wordStart = character_start_times_seconds[i + 1] ?? 0;
    } else {
      if (wordChars.length === 0) wordStart = character_start_times_seconds[i];
      wordChars.push(ch);
    }
  }
  return words;
}

export async function generateAudio(
  script: string,
  voiceId: string
): Promise<{ audioBuffer: Buffer; wordTimestamps: WordTimestamp[] }> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) throw new Error("ELEVENLABS_API_KEY is not set");

  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/with-timestamps`,
    {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: script,
        model_id: "eleven_multilingual_v2",
        voice_settings: { stability: 0.5, similarity_boost: 0.8, style: 0.3, use_speaker_boost: true },
        output_format: "mp3_44100_128",
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`ElevenLabs error ${res.status}: ${err}`);
  }

  const data: ElevenLabsTimestampResponse = await res.json();
  const audioBuffer = Buffer.from(data.audio_base64, "base64");
  const wordTimestamps = charTimestampsToWords(data.alignment);

  return { audioBuffer, wordTimestamps };
}
