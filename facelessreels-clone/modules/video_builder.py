import datetime
import pathlib
import subprocess
import tempfile
import uuid

import srt

OUTPUT_DIR = pathlib.Path("output")
OUTPUT_DIR.mkdir(exist_ok=True)

FORMATS = {
    "short": (1080, 1920),
    "long": (1920, 1080),
}

# ASS subtitle colors: &HAABBGGRR
CAPTION_STYLES: dict[str, dict] = {
    "Bold Stroke": {
        "FontName": "Arial", "FontSize": 18, "Bold": 1,
        "PrimaryColour": "&H00ffffff", "OutlineColour": "&H00000000",
        "Outline": 4, "Shadow": 0, "Alignment": 2, "MarginV": 60,
    },
    "Red Highlight": {
        "FontName": "Arial", "FontSize": 18, "Bold": 1,
        "PrimaryColour": "&H000000ff", "OutlineColour": "&H00000000",
        "Outline": 3, "Shadow": 0, "Alignment": 2, "MarginV": 60,
    },
    "Sleek": {
        "FontName": "Arial", "FontSize": 14, "Bold": 0,
        "PrimaryColour": "&H00ffffff", "OutlineColour": "&H00000000",
        "Outline": 1, "Shadow": 2, "Alignment": 2, "MarginV": 60,
    },
    "Majestic": {
        "FontName": "Georgia", "FontSize": 22, "Bold": 1,
        "PrimaryColour": "&H0000d7ff", "OutlineColour": "&H00000000",
        "Outline": 3, "Shadow": 1, "Alignment": 2, "MarginV": 80,
    },
    "Beast": {
        "FontName": "Arial", "FontSize": 22, "Bold": 1,
        "PrimaryColour": "&H0000ffff", "OutlineColour": "&H00000000",
        "Outline": 3, "Shadow": 0, "Alignment": 2, "MarginV": 60,
    },
    "Elegant": {
        "FontName": "Georgia", "FontSize": 13, "Bold": 0,
        "PrimaryColour": "&H00ffffff", "OutlineColour": "&H00808080",
        "Outline": 1, "Shadow": 0, "Alignment": 2, "MarginV": 70,
    },
    "Pixel": {
        "FontName": "Courier New", "FontSize": 16, "Bold": 1,
        "PrimaryColour": "&H0000ff00", "OutlineColour": "&H00000000",
        "Outline": 2, "Shadow": 0, "Alignment": 2, "MarginV": 60,
    },
    "Clarity": {
        "FontName": "Arial", "FontSize": 14, "Bold": 0,
        "PrimaryColour": "&H00ffffff", "OutlineColour": "&H00000000",
        "Outline": 0, "Shadow": 3, "Alignment": 2, "MarginV": 60,
    },
}


def _style_to_str(style: dict) -> str:
    return ",".join(f"{k}={v}" for k, v in style.items())


def get_audio_duration(audio_path: str) -> float:
    result = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=noprint_wrappers=1:nokey=1", audio_path],
        capture_output=True, text=True, check=True,
    )
    return float(result.stdout.strip())


def compute_subtitles(script: str, duration: float, words_per_seg: int) -> list[dict]:
    words = script.split()
    if not words:
        return []
    time_per_word = duration / len(words)
    segments = []
    for i in range(0, len(words), words_per_seg):
        chunk = words[i: i + words_per_seg]
        start = i * time_per_word
        end = min((i + words_per_seg) * time_per_word, duration)
        segments.append({"text": " ".join(chunk).upper(), "start": start, "end": end})
    return segments


def write_srt(segments: list[dict], path: str) -> None:
    subs = [
        srt.Subtitle(
            index=i + 1,
            start=datetime.timedelta(seconds=seg["start"]),
            end=datetime.timedelta(seconds=seg["end"]),
            content=seg["text"],
        )
        for i, seg in enumerate(segments)
    ]
    pathlib.Path(path).write_text(srt.compose(subs), encoding="utf-8")


def _resize_crop_clip(input_path: str, output_path: str, w: int, h: int, duration: float) -> None:
    vf = (
        f"scale={w}:{h}:force_original_aspect_ratio=increase,"
        f"crop={w}:{h},setsar=1"
    )
    subprocess.run(
        ["ffmpeg", "-y", "-i", input_path, "-t", str(duration),
         "-vf", vf, "-r", "24", "-c:v", "libx264", "-preset", "fast", "-crf", "23", "-an", output_path],
        capture_output=True, check=True,
    )


def _concat_clips(clip_paths: list[str], output_path: str) -> None:
    list_file = tempfile.mktemp(suffix=".txt")
    with open(list_file, "w") as f:
        for p in clip_paths:
            f.write(f"file '{p}'\n")
    subprocess.run(
        ["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", list_file, "-c", "copy", output_path],
        capture_output=True, check=True,
    )
    pathlib.Path(list_file).unlink(missing_ok=True)


def _mix_music(video_path: str, music_path: str, output_path: str, volume: float = 0.20) -> None:
    subprocess.run(
        ["ffmpeg", "-y", "-i", video_path, "-i", music_path,
         "-filter_complex",
         f"[1:a]volume={volume},aloop=loop=-1:size=2e+09[m];[0:a][m]amix=inputs=2:duration=first:dropout_transition=3[aout]",
         "-map", "0:v", "-map", "[aout]", "-c:v", "copy", "-c:a", "aac", output_path],
        capture_output=True, check=True,
    )


def _apply_effects(input_path: str, output_path: str, film_grain: bool, glitch: bool) -> None:
    filters = []
    if film_grain:
        filters.append("noise=alls=12:allf=t+u")
    if glitch:
        filters.append("noise=alls=25:allf=t,unsharp=7:7:2.5:7:7:0")
    if not filters:
        import shutil
        shutil.copy(input_path, output_path)
        return
    subprocess.run(
        ["ffmpeg", "-y", "-i", input_path, "-vf", ",".join(filters), "-c:a", "copy", output_path],
        capture_output=True, check=True,
    )


def assemble_video(
    footage_paths: list[str],
    audio_path: str,
    format_type: str,
    words_per_seg: int,
    script: str,
    caption_style: str = "Bold Stroke",
    film_grain: bool = False,
    glitch: bool = False,
    music_path: str = "",
) -> str:
    w, h = FORMATS[format_type]
    uid = uuid.uuid4().hex[:8]
    tmp_dir = pathlib.Path(tempfile.gettempdir()) / f"fr_{uid}"
    tmp_dir.mkdir(exist_ok=True)

    total_duration = get_audio_duration(audio_path)

    # 1. Resize & crop each clip
    processed: list[str] = []
    for i, path in enumerate(footage_paths):
        out = str(tmp_dir / f"clip_{i}.mp4")
        clip_dur = get_audio_duration(path)
        _resize_crop_clip(path, out, w, h, min(clip_dur, total_duration))
        processed.append(out)

    # 2. Concatenate + loop
    concat_once = str(tmp_dir / "concat.mp4")
    _concat_clips(processed, concat_once)
    concat_dur = get_audio_duration(concat_once)
    if concat_dur < total_duration:
        repeats = int(total_duration / concat_dur) + 2
        looped = str(tmp_dir / "looped.mp4")
        _concat_clips([concat_once] * repeats, looped)
        concat_once = looped

    # 3. Trim + mix voiceover
    with_audio = str(tmp_dir / "with_audio.mp4")
    subprocess.run(
        ["ffmpeg", "-y", "-i", concat_once, "-i", audio_path,
         "-t", str(total_duration),
         "-map", "0:v:0", "-map", "1:a:0",
         "-c:v", "copy", "-c:a", "aac", "-shortest", with_audio],
        capture_output=True, check=True,
    )

    # 4. Mix background music (optional)
    if music_path and pathlib.Path(music_path).exists():
        with_music = str(tmp_dir / "with_music.mp4")
        _mix_music(with_audio, music_path, with_music)
        with_audio = with_music

    # 5. Apply visual effects
    with_fx = str(tmp_dir / "with_fx.mp4")
    _apply_effects(with_audio, with_fx, film_grain=film_grain, glitch=glitch)

    # 6. Burn subtitles
    subs = compute_subtitles(script, total_duration, words_per_seg)
    srt_path = str(tmp_dir / "subs.srt")
    write_srt(subs, srt_path)

    final_path = str(OUTPUT_DIR / f"reel_{uid}.mp4")
    style = _style_to_str(CAPTION_STYLES.get(caption_style, CAPTION_STYLES["Bold Stroke"]))
    srt_escaped = srt_path.replace("\\", "/").replace(":", "\\:")
    result = subprocess.run(
        ["ffmpeg", "-y", "-i", with_fx,
         "-vf", f"subtitles={srt_escaped}:force_style='{style}'",
         "-c:a", "copy", final_path],
        capture_output=True,
    )
    if result.returncode != 0:
        pathlib.Path(with_fx).rename(final_path)
    else:
        pathlib.Path(with_fx).unlink(missing_ok=True)

    for f in tmp_dir.iterdir():
        f.unlink(missing_ok=True)
    tmp_dir.rmdir()

    return final_path
