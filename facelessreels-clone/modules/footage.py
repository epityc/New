import pathlib
import tempfile
import requests

ART_STYLES: dict[str, dict] = {
    "Cinematic": {
        "icon": "🎬",
        "description": "Epic cinematic shots, wide angles",
        "pexels_query": "cinematic landscape epic aerial drone",
    },
    "Dark & Moody": {
        "icon": "🌑",
        "description": "Dark, atmospheric and mysterious",
        "pexels_query": "dark moody atmospheric fog night shadow",
    },
    "Nature": {
        "icon": "🌿",
        "description": "Beautiful nature and landscapes",
        "pexels_query": "nature forest waterfall mountains landscape",
    },
    "Urban": {
        "icon": "🏙️",
        "description": "City life and urban environments",
        "pexels_query": "city urban street timelapse downtown",
    },
    "Abstract": {
        "icon": "🎨",
        "description": "Abstract and artistic visuals",
        "pexels_query": "abstract art particles colorful motion",
    },
    "Vintage": {
        "icon": "📽️",
        "description": "Old film and vintage aesthetic",
        "pexels_query": "vintage retro old film historical",
    },
    "Space": {
        "icon": "🚀",
        "description": "Space, cosmos and universe",
        "pexels_query": "space galaxy stars universe cosmos",
    },
    "Ocean": {
        "icon": "🌊",
        "description": "Ocean, waves and underwater",
        "pexels_query": "ocean waves underwater sea beach",
    },
}


def fetch_pexels(
    query: str,
    count: int,
    api_key: str,
    orientation: str = "portrait",
) -> list[str]:
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
        files = sorted(vid["video_files"], key=lambda f: f.get("width", 0), reverse=True)
        url = files[0]["link"]
        safe_query = query[:15].replace(" ", "_")
        tmp = pathlib.Path(tempfile.gettempdir()) / f"pexels_{safe_query}_{i}.mp4"
        if not tmp.exists():
            tmp.write_bytes(requests.get(url, timeout=60).content)
        paths.append(str(tmp))

    return paths


def save_uploads(uploaded_files) -> list[str]:
    paths = []
    for f in uploaded_files:
        tmp = pathlib.Path(tempfile.gettempdir()) / f"upload_{f.name}"
        tmp.write_bytes(f.read())
        paths.append(str(tmp))
    return paths
