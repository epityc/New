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


def get_audio_duration(audio_path: str) -> float:
    result = subprocess.run(
        [
            "ffprobe", "-v", "error",
            "-show_entries", "format=duration",
            "-of", "default=noprint_wrappers=1:nokey=1",
            audio_path,
        ],
        capture_output=True,
        text=True,
        check=True,
    )
    return float(result.stdout.strip())


def compute_subtitles(script: str, duration: float, words_per_seg: int) -> list[dict]:
    words = script.split()
    if not words:
        return []
    time_per_word = duration / len(words)
    segments = []
    for i in range(0, len(words), words_per_seg):
        chunk = words[i : i + words_per_seg]
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
        f"crop={w}:{h},"
        f"setsar=1"
    )
    subprocess.run(
        [
            "ffmpeg", "-y",
            "-i", input_path,
            "-t", str(duration),
            "-vf", vf,
            "-r", "24",
            "-c:v", "libx264", "-preset", "fast", "-crf", "23",
            "-an",
            output_path,
        ],
        capture_output=True,
        check=True,
    )


def _concat_clips(clip_paths: list[str], output_path: str) -> None:
    list_file = tempfile.mktemp(suffix=".txt")
    with open(list_file, "w") as f:
        for p in clip_paths:
            f.write(f"file '{p}'\n")
    subprocess.run(
        [
            "ffmpeg", "-y",
            "-f", "concat", "-safe", "0",
            "-i", list_file,
            "-c", "copy",
            output_path,
        ],
        capture_output=True,
        check=True,
    )
    pathlib.Path(list_file).unlink(missing_ok=True)


def assemble_video(
    footage_paths: list[str],
    audio_path: str,
    format_type: str,
    words_per_seg: int,
    script: str,
) -> str:
    w, h = FORMATS[format_type]
    uid = uuid.uuid4().hex[:8]
    tmp_dir = pathlib.Path(tempfile.gettempdir()) / f"fr_{uid}"
    tmp_dir.mkdir(exist_ok=True)

    total_duration = get_audio_duration(audio_path)

    # Resize & crop each clip to target resolution
    processed: list[str] = []
    for i, path in enumerate(footage_paths):
        out = str(tmp_dir / f"clip_{i}.mp4")
        clip_dur = get_audio_duration(path)
        _resize_crop_clip(path, out, w, h, min(clip_dur, total_duration))
        processed.append(out)

    # Concatenate clips
    concat_once = str(tmp_dir / "concat_once.mp4")
    _concat_clips(processed, concat_once)

    # Loop until we cover the full audio duration
    concat_dur = get_audio_duration(concat_once)
    if concat_dur < total_duration:
        repeats = int(total_duration / concat_dur) + 2
        looped = str(tmp_dir / "looped.mp4")
        _concat_clips([concat_once] * repeats, looped)
        concat_once = looped

    # Trim to exact audio duration and mix audio
    video_with_audio = str(OUTPUT_DIR / f"_raw_{uid}.mp4")
    subprocess.run(
        [
            "ffmpeg", "-y",
            "-i", concat_once,
            "-i", audio_path,
            "-t", str(total_duration),
            "-map", "0:v:0", "-map", "1:a:0",
            "-c:v", "copy", "-c:a", "aac", "-shortest",
            video_with_audio,
        ],
        capture_output=True,
        check=True,
    )

    # Generate and burn subtitles
    subs = compute_subtitles(script, total_duration, words_per_seg)
    srt_path = str(tmp_dir / "subs.srt")
    write_srt(subs, srt_path)

    final_path = str(OUTPUT_DIR / f"reel_{uid}.mp4")
    fontsize = 22 if format_type == "long" else 18
    margin_v = 80 if format_type == "short" else 50
    style = (
        f"FontName=Arial,FontSize={fontsize},Bold=1,"
        f"PrimaryColour=&Hffffff,OutlineColour=&H000000,Outline=2,"
        f"Alignment=2,MarginV={margin_v}"
    )
    srt_escaped = srt_path.replace("\\", "/").replace(":", "\\:")
    result = subprocess.run(
        [
            "ffmpeg", "-y",
            "-i", video_with_audio,
            "-vf", f"subtitles={srt_escaped}:force_style='{style}'",
            "-c:a", "copy",
            final_path,
        ],
        capture_output=True,
    )
    if result.returncode != 0:
        pathlib.Path(video_with_audio).rename(final_path)
    else:
        pathlib.Path(video_with_audio).unlink(missing_ok=True)

    for f in tmp_dir.iterdir():
        f.unlink(missing_ok=True)
    tmp_dir.rmdir()

    return final_path
