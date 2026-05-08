import pathlib
import tempfile
import requests


def fetch_pexels(query: str, count: int, api_key: str, orientation: str = "portrait") -> list[str]:
    headers = {"Authorization": api_key}
    r = requests.get(
        "https://api.pexels.com/videos/search",
        params={"query": query, "per_page": min(count, 15), "orientation": orientation},
        headers=headers,
        timeout=15,
    )
    r.raise_for_status()
    videos = r.json().get("videos", [])
    if not videos:
        raise ValueError(f"Aucune vidéo trouvée sur Pexels pour : {query}")

    paths = []
    for i, vid in enumerate(videos[:count]):
        # prefer HD quality
        files = sorted(vid["video_files"], key=lambda f: f.get("width", 0), reverse=True)
        url = files[0]["link"]
        tmp = pathlib.Path(tempfile.gettempdir()) / f"pexels_{query[:10]}_{i}.mp4"
        if not tmp.exists():
            content = requests.get(url, timeout=60).content
            tmp.write_bytes(content)
        paths.append(str(tmp))

    return paths


def save_uploads(uploaded_files) -> list[str]:
    paths = []
    for f in uploaded_files:
        tmp = pathlib.Path(tempfile.gettempdir()) / f"upload_{f.name}"
        tmp.write_bytes(f.read())
        paths.append(str(tmp))
    return paths
