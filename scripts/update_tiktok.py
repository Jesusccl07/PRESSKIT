#!/usr/bin/env python3
"""Actualiza data/tiktok.json con los últimos vídeos y las estadísticas de TikTok.

Lo ejecuta GitHub Actions cada pocas horas (.github/workflows/tiktok.yml).
Usa varias fuentes públicas, sin claves ni API, y si una falla prueba la siguiente:
  1. El widget oficial del perfil (tiktok.com/embed/@usuario), el mismo que TikTok
     ofrece para incrustar en webs: trae los últimos vídeos, portadas y visualizaciones.
  2. yt-dlp: añade me gusta, comentarios y el total de visualizaciones.
  3. La página pública del perfil: seguidores y me gusta.
Si todo falla, no toca nada y la web sigue mostrando lo último que se guardó.
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
HEADERS = {
    "User-Agent": UA,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "es-ES,es;q=0.9,en;q=0.8",
}


def log(*a):
    print(*a, file=sys.stderr)


def http_get(url, timeout=30):
    """GET imitando a un navegador. Usa curl_cffi (huella TLS de Chrome) si está instalado."""
    try:
        from curl_cffi import requests as creq
        r = creq.get(url, headers=HEADERS, impersonate="chrome", timeout=timeout)
        r.raise_for_status()
        return r.content
    except ImportError:
        pass
    except Exception as e:  # noqa: BLE001
        log("curl_cffi falló, pruebo urllib:", e)
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read()


def find_key(obj, key):
    """Busca recursivamente el primer valor de `key` en un JSON."""
    if isinstance(obj, dict):
        if key in obj:
            return obj[key]
        for v in obj.values():
            r = find_key(v, key)
            if r is not None:
                return r
    elif isinstance(obj, list):
        for v in obj:
            r = find_key(v, key)
            if r is not None:
                return r
    return None


def find_dict_with(obj, key):
    if isinstance(obj, dict):
        if key in obj:
            return obj
        for v in obj.values():
            r = find_dict_with(v, key)
            if r is not None:
                return r
    elif isinstance(obj, list):
        for v in obj:
            r = find_dict_with(v, key)
            if r is not None:
                return r
    return None


def id_timestamp(video_id):
    """Los ID de TikTok llevan la fecha de publicación en los 32 bits altos."""
    try:
        return int(video_id) >> 32
    except (TypeError, ValueError):
        return None


def from_embed():
    """Fuente 1: widget oficial del perfil."""
    html = http_get(f"https://www.tiktok.com/embed/@{HANDLE}").decode("utf-8", "ignore")
    m = re.search(r'<script id="__FRONTITY_CONNECT_STATE__"[^>]*>(.*?)</script>', html, re.S)
    if not m:
        raise ValueError("el widget no trae datos")
    state = json.loads(m.group(1))
    videos = find_key(state, "videoList") or []
    entries = []
    for v in videos:
        if not v.get("id") or v.get("privateItem"):
            continue
        entries.append({
            "id": str(v["id"]),
            "description": (v.get("desc") or "").strip(),
            "views": v.get("playCount"),
            "timestamp": id_timestamp(v["id"]),
            "cover_url": v.get("originCoverUrl") or v.get("coverUrl") or v.get("dynamicCoverUrl"),
        })
    stats = find_dict_with(state, "followerCount") or {}
    profile = {
        "handle": HANDLE,
        "followers": stats.get("followerCount"),
        "likes": stats.get("heartCount") or stats.get("heart"),
        "videos": stats.get("videoCount"),
    }
    return entries, profile


def from_ytdlp():
    """Fuente 2: yt-dlp (más datos por vídeo y el total de visualizaciones)."""
    from yt_dlp import YoutubeDL
    opts = {"extract_flat": True, "quiet": True, "no_warnings": True, "skip_download": True, "playlistend": 100}
    with YoutubeDL(opts) as ydl:
        info = ydl.extract_info(f"https://www.tiktok.com/@{HANDLE}", download=False)
    entries = []
    for e in info.get("entries") or []:
        if not e or not e.get("id"):
            continue
        thumbs = {t.get("id"): t.get("url") for t in e.get("thumbnails") or []}
        entries.append({
            "id": str(e["id"]),
            "description": (e.get("description") or e.get("title") or "").strip(),
            "views": e.get("view_count"),
            "likes": e.get("like_count"),
            "comments": e.get("comment_count"),
            "duration": e.get("duration"),
            "timestamp": e.get("timestamp") or id_timestamp(e["id"]),
            "cover_url": thumbs.get("originCover") or thumbs.get("cover") or thumbs.get("dynamicCover"),
        })
    return entries


def from_profile_page():
    """Fuente 3: cifras de la página pública del perfil."""
    html = http_get(f"https://www.tiktok.com/@{HANDLE}").decode("utf-8", "ignore")
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


def attempt(name, fn):
    try:
        return fn()
    except Exception as e:  # noqa: BLE001
        log(f"{name} falló:", e)
        return None


def save_cover(video_id, url):
    if not url:
        return None
    from PIL import Image
    img = Image.open(io.BytesIO(http_get(url))).convert("RGB")
    img.thumbnail((540, 960))
    COVERS.mkdir(parents=True, exist_ok=True)
    path = COVERS / f"{video_id}.jpg"
    img.save(path, "JPEG", quality=82, optimize=True, progressive=True)
    return f"data/tiktok/{video_id}.jpg"


def main():
    prev = json.loads(OUT.read_text(encoding="utf-8")) if OUT.exists() else {}
    prev_latest = {v["id"]: v for v in prev.get("latest", [])}

    embed = attempt("Widget oficial", from_embed)
    ytdlp = attempt("yt-dlp", from_ytdlp)
    page_profile = attempt("Página del perfil", from_profile_page)

    embed_entries, embed_profile = embed if embed else ([], {})
    by_id = {e["id"]: dict(e) for e in embed_entries}
    for e in ytdlp or []:  # yt-dlp completa (me gusta, comentarios, duración)
        by_id[e["id"]] = {**by_id.get(e["id"], {}), **{k: v for k, v in e.items() if v is not None}}
    entries = sorted(by_id.values(), key=lambda e: e.get("timestamp") or 0, reverse=True)
    if not entries:
        log("No se obtuvieron vídeos: se mantienen los datos anteriores.")
        return 0

    latest = []
    for e in entries[:LATEST]:
        old = prev_latest.get(e["id"], {})
        cover = old.get("cover") if old.get("cover") and (ROOT / old["cover"]).exists() else None
        if not cover:
            cover = attempt(f"Portada {e['id']}", lambda: save_cover(e["id"], e.get("cover_url")))
        latest.append({
            "id": e["id"],
            "url": f"https://www.tiktok.com/@{HANDLE}/video/{e['id']}",
            "description": e.get("description", ""),
            "views": e.get("views") if e.get("views") is not None else old.get("views"),
            "likes": e.get("likes") if e.get("likes") is not None else old.get("likes"),
            "comments": e.get("comments") if e.get("comments") is not None else old.get("comments"),
            "duration": e.get("duration") or old.get("duration"),
            "timestamp": e.get("timestamp"),
            "cover": cover,
        })

    keep = {f"{v['id']}.jpg" for v in latest}
    if COVERS.exists():
        for f in COVERS.glob("*.jpg"):
            if f.name not in keep:
                f.unlink()

    profile = {**(prev.get("profile") or {}), "handle": HANDLE}
    for src in (embed_profile, page_profile or {}):
        profile.update({k: v for k, v in src.items() if v is not None})
    if ytdlp:
        totals = {"views": sum(e.get("views") or 0 for e in ytdlp), "counted": len(ytdlp)}
    else:  # sin yt-dlp no hay total fiable: se conserva el último (nunca baja)
        totals = prev.get("totals") or {"views": sum(e.get("views") or 0 for e in embed_entries), "counted": len(embed_entries)}

    data = {"profile": profile, "totals": totals, "latest": latest}
    same_videos = [v["id"] for v in latest] == [v["id"] for v in prev.get("latest", [])]
    if same_videos and prev.get("updated"):
        age = time.time() - datetime.datetime.fromisoformat(prev["updated"]).timestamp()
        if age < 20 * 3600 and not os.environ.get("FORCE"):
            log("Sin vídeos nuevos y cifras recientes: no se cambia nada.")
            return 0

    data["updated"] = datetime.datetime.now(datetime.timezone.utc).replace(microsecond=0).isoformat()
    DATA.mkdir(exist_ok=True)
    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    log("Actualizado:", [v["id"] for v in latest], "| fuentes:",
        ", ".join(n for n, ok in (("widget", embed), ("yt-dlp", ytdlp), ("perfil", page_profile)) if ok))
    return 0


if __name__ == "__main__":
    sys.exit(main())
