import asyncio
import pathlib
import requests
import edge_tts

# Edge-TTS fallback voices (free, no key needed)
EDGE_VOICES: dict[str, dict[str, str]] = {
    "fr": {
        "Denise — Femme": "fr-FR-DeniseNeural",
        "Henri — Homme": "fr-FR-HenriNeural",
        "Vivienne — Femme (multilingue)": "fr-FR-VivienneMultilingualNeural",
        "Remy — Homme (multilingue)": "fr-FR-RemyMultilingualNeural",
    },
    "en": {
        "Aria — Female": "en-US-AriaNeural",
        "Guy — Male": "en-US-GuyNeural",
        "Jenny — Female": "en-US-JennyNeural",
        "Davis — Male": "en-US-DavisNeural",
    },
}


def get_elevenlabs_voices(api_key: str) -> dict[str, str]:
    """Fetch available ElevenLabs voices. Returns {name: voice_id}."""
    try:
        r = requests.get(
            "https://api.elevenlabs.io/v1/voices",
            headers={"xi-api-key": api_key},
            timeout=10,
        )
        r.raise_for_status()
        return {v["name"]: v["voice_id"] for v in r.json()["voices"]}
    except Exception:
        return {}


def generate_voice_elevenlabs(text: str, voice_id: str, api_key: str, output_path: str) -> None:
    r = requests.post(
        f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}",
        headers={"xi-api-key": api_key, "Content-Type": "application/json"},
        json={
            "text": text,
            "model_id": "eleven_multilingual_v2",
            "voice_settings": {"stability": 0.5, "similarity_boost": 0.75},
        },
        timeout=120,
    )
    r.raise_for_status()
    pathlib.Path(output_path).write_bytes(r.content)


async def _edge_synthesize(text: str, voice: str, output_path: str) -> None:
    communicate = edge_tts.Communicate(text, voice)
    await communicate.save(output_path)


def generate_voice_edge(text: str, voice: str, output_path: str) -> None:
    asyncio.run(_edge_synthesize(text, voice, output_path))


def generate_voice(
    text: str,
    output_path: str,
    elevenlabs_key: str = "",
    elevenlabs_voice_id: str = "",
    edge_voice: str = "en-US-AriaNeural",
) -> None:
    if elevenlabs_key and elevenlabs_voice_id:
        generate_voice_elevenlabs(text, elevenlabs_voice_id, elevenlabs_key, output_path)
    else:
        generate_voice_edge(text, edge_voice, output_path)
