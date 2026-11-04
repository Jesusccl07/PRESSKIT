#!/usr/bin/env python3
"""Actualiza data/tiktok.json con los últimos vídeos y las estadísticas de TikTok.

Lo ejecuta GitHub Actions cada pocas horas (.github/workflows/tiktok.yml):
- Lee la lista de vídeos públicos del perfil con yt-dlp (sin claves ni API).
- Guarda los 3 últimos con su portada (data/tiktok/<id>.jpg), visualizaciones y me gusta.
- Lee seguidores y me gusta del perfil público.
Si TikTok falla, no toca nada: la web sigue mostrando lo último que se guardó.
Para no llenar el historial de commits, si no hay vídeos nuevos solo refresca
las cifras una vez al día.
"""
import datetime
import io
import json
import os
import re
import sys
import time
import urllib.request
from pathlib import Path

HANDLE = os.environ.get("TIKTOK_HANDLE", "djclement07")
LATEST = 3
ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data"
COVERS = DATA / "tiktok"
OUT = DATA / "tiktok.json"
UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/124.0 Safari/537.36")


def log(*a):
    print(*a, file=sys.stderr)


def get(url, timeout=30):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Language": "es-ES,es;q=0.9"})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read()


def profile_stats():
    """Seguidores, me gusta y nº de vídeos del perfil público."""
    try:
        html = get(f"https://www.tiktok.com/@{HANDLE}").decode("utf-8", "ignore")
        m = re.search(r'<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__"[^>]*>(.*?)</script>', html, re.S)
        info = json.loads(m.group(1))["__DEFAULT_SCOPE__"]["webapp.user-detail"]["userInfo"]
        u, s = info["user"], info["stats"]
        return {
            "handle": u.get("uniqueId") or HANDLE,
            "nickname": u.get("nickname"),
            "followers": s.get("followerCount"),
            "likes": s.get("heartCount") or s.get("heart"),
            "videos": s.get("videoCount"),
        }
    except Exception as e:  # noqa: BLE001
        log("No se pudieron leer las cifras del perfil:", e)
        return None


def fetch_videos():
    from yt_dlp import YoutubeDL
    opts = {"extract_flat": True, "quiet": True, "no_warnings": True, "skip_download": True, "playlistend": 100}
    with YoutubeDL(opts) as ydl:
        info = ydl.extract_info(f"https://www.tiktok.com/@{HANDLE}", download=False)
    return [e for e in (info.get("entries") or []) if e and e.get("id")]


def save_cover(entry):
    thumbs = {t.get("id"): t.get("url") for t in entry.get("thumbnails") or []}
    url = thumbs.get("originCover") or thumbs.get("cover") or thumbs.get("dynamicCover")
    if not url:
        return None
    from PIL import Image
    img = Image.open(io.BytesIO(get(url))).convert("RGB")
    img.thumbnail((540, 960))
    COVERS.mkdir(parents=True, exist_ok=True)
    path = COVERS / f"{entry['id']}.jpg"
    img.save(path, "JPEG", quality=82, optimize=True, progressive=True)
    return f"data/tiktok/{entry['id']}.jpg"


def main():
    prev = json.loads(OUT.read_text(encoding="utf-8")) if OUT.exists() else {}
    try:
        entries = fetch_videos()
    except Exception as e:  # noqa: BLE001
        log("yt-dlp falló:", e)
        entries = []
    if not entries:
        log("No se obtuvieron vídeos: se mantienen los datos anteriores.")
        return 0

    prev_latest = {v["id"]: v for v in prev.get("latest", [])}
    latest = []
    for e in entries[:LATEST]:
        old = prev_latest.get(e["id"], {})
        cover = old.get("cover") if old.get("cover") and (ROOT / old["cover"]).exists() else None
        if not cover:
            try:
                cover = save_cover(e)
            except Exception as ex:  # noqa: BLE001
                log("Portada no descargada", e["id"], ex)
        latest.append({
            "id": e["id"],
            "url": e.get("url") or f"https://www.tiktok.com/@{HANDLE}/video/{e['id']}",
            "description": (e.get("description") or e.get("title") or "").strip(),
            "views": e.get("view_count"),
            "likes": e.get("like_count"),
            "comments": e.get("comment_count"),
            "duration": e.get("duration"),
            "timestamp": e.get("timestamp"),
            "cover": cover,
        })

    keep = {f"{v['id']}.jpg" for v in latest}
    if COVERS.exists():
        for f in COVERS.glob("*.jpg"):
            if f.name not in keep:
                f.unlink()

    data = {
        "profile": profile_stats() or prev.get("profile") or {"handle": HANDLE},
        "totals": {"views": sum(e.get("view_count") or 0 for e in entries), "counted": len(entries)},
        "latest": latest,
    }

    same_videos = [v["id"] for v in latest] == [v["id"] for v in prev.get("latest", [])]
    if same_videos and prev.get("updated"):
        age = time.time() - datetime.datetime.fromisoformat(prev["updated"]).timestamp()
        if age < 20 * 3600:
            log("Sin vídeos nuevos y cifras recientes: no se cambia nada.")
            return 0

    data["updated"] = datetime.datetime.now(datetime.timezone.utc).replace(microsecond=0).isoformat()
    DATA.mkdir(exist_ok=True)
    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    log("Actualizado:", [v["id"] for v in latest])
    return 0


if __name__ == "__main__":
    sys.exit(main())
