import asyncio
import edge_tts

VOICES: dict[str, dict[str, str]] = {
    "fr": {
        "Denise — Femme (naturelle)": "fr-FR-DeniseNeural",
        "Henri — Homme (naturelle)": "fr-FR-HenriNeural",
        "Vivienne — Femme (multilingue)": "fr-FR-VivienneMultilingualNeural",
        "Remy — Homme (multilingue)": "fr-FR-RemyMultilingualNeural",
    },
    "en": {
        "Aria — Female (expressive)": "en-US-AriaNeural",
        "Guy — Male (expressive)": "en-US-GuyNeural",
        "Jenny — Female (friendly)": "en-US-JennyNeural",
        "Davis — Male (deep)": "en-US-DavisNeural",
    },
}


async def _synthesize(text: str, voice: str, output_path: str) -> None:
    communicate = edge_tts.Communicate(text, voice)
    await communicate.save(output_path)


def generate_voice(text: str, voice: str, output_path: str) -> None:
    asyncio.run(_synthesize(text, voice, output_path))
