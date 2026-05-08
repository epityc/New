import datetime
import pathlib
import subprocess
import uuid

import srt
from moviepy.editor import AudioFileClip, VideoFileClip, concatenate_videoclips

OUTPUT_DIR = pathlib.Path("output")
OUTPUT_DIR.mkdir(exist_ok=True)

FORMATS = {
    "short": (1080, 1920),
    "long": (1920, 1080),
}


def get_audio_duration(audio_path: str) -> float:
    clip = AudioFileClip(audio_path)
    duration = clip.duration
    clip.close()
    return duration


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


def _resize_crop(clip: VideoFileClip, w: int, h: int) -> VideoFileClip:
    target_ratio = w / h
    source_ratio = clip.w / clip.h
    if source_ratio > target_ratio:
        clip = clip.resize(height=h)
    else:
        clip = clip.resize(width=w)
    return clip.crop(x_center=clip.w / 2, y_center=clip.h / 2, width=w, height=h)


def assemble_video(
    footage_paths: list[str],
    audio_path: str,
    format_type: str,
    words_per_seg: int,
    script: str,
) -> str:
    w, h = FORMATS[format_type]
    audio = AudioFileClip(audio_path)
    total_duration = audio.duration

    clips = [_resize_crop(VideoFileClip(p).without_audio(), w, h) for p in footage_paths]

    base = concatenate_videoclips(clips, method="compose")
    if base.duration < total_duration:
        repeats = int(total_duration / base.duration) + 2
        base = concatenate_videoclips([base] * repeats, method="compose")
    base = base.subclip(0, total_duration).set_audio(audio)

    uid = uuid.uuid4().hex[:8]
    tmp_video = str(OUTPUT_DIR / f"_tmp_{uid}.mp4")
    base.write_videofile(tmp_video, fps=24, codec="libx264", audio_codec="aac", logger=None)
    base.close()
    audio.close()
    for c in clips:
        c.close()

    subs = compute_subtitles(script, total_duration, words_per_seg)
    srt_path = str(OUTPUT_DIR / f"_subs_{uid}.srt")
    write_srt(subs, srt_path)

    final_path = str(OUTPUT_DIR / f"reel_{uid}.mp4")
    fontsize = 22 if format_type == "long" else 18
    margin_v = 80 if format_type == "short" else 50
    style = (
        f"FontName=Arial,FontSize={fontsize},Bold=1,"
        f"PrimaryColour=&Hffffff,OutlineColour=&H000000,Outline=2,"
        f"Alignment=2,MarginV={margin_v}"
    )
    # escape colon in path for ffmpeg filter on Linux
    srt_escaped = srt_path.replace("\\", "/").replace(":", "\\:")
    result = subprocess.run(
        [
            "ffmpeg", "-y", "-i", tmp_video,
            "-vf", f"subtitles={srt_escaped}:force_style='{style}'",
            "-c:a", "copy", final_path,
        ],
        capture_output=True,
    )
    if result.returncode != 0:
        # fallback: return video without subtitles if libass missing
        pathlib.Path(tmp_video).rename(final_path)
    else:
        pathlib.Path(tmp_video).unlink(missing_ok=True)

    pathlib.Path(srt_path).unlink(missing_ok=True)
    return final_path
