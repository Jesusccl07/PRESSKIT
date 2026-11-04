# CLEMENT · DJ Press Kit

Web pública: **https://jesusccl07.github.io/PRESSKIT/** · en inglés: `?lang=en`

## Qué hay dentro
- **Intro de cine:** el logo se forma con cristales de hielo (una vez por visita).
- **Portada realista:**
  - de fondo, tu aftermovie "La noche mágica", sin sonido, desenfocado y teñido en azul
  - haces de cabezas móviles y humo en primer plano
  - tu foto etalonada, con contraluz azul calculado del borde de la silueta
  - logo de hielo en WebGL (`js/ice.js`), con relieve, grietas, destellos y halo neón
- **Scroll tipo película** (GSAP + ScrollTrigger + Lenis): portada que se agrieta, frase que se enciende, cifras que cuentan, galería horizontal con suelo brillante.
- **Sobre mí**, en primera persona.
- **TikTok:** tus 3 últimos vídeos dentro de móviles realistas, con el reproductor oficial y cifras reales (seguidores, me gusta, visualizaciones).
- **Salas:** rótulos de neón sobre hormigón, que se encienden con parpadeo.
- **Rider con iconos:** equipo habitual, que te adaptas a cualquier equipo, monitores obligatorios y qué necesitas si llevas el tuyo.
- **Booking:** formulario que abre WhatsApp o el email con el mensaje ya escrito.
- **Material para promotores:** ZIP, ficha PDF con QR y logos.
- **Extras:**
  - ES / EN
  - instalable como app (`manifest.webmanifest`) y página 404 propia
  - datos estructurados para Google, `sitemap.xml` y vista previa al compartir
  - accesible: respeta "reducir movimiento"

## TikTok que se actualiza solo
`.github/workflows/tiktok.yml` ejecuta `scripts/update_tiktok.py` cada 3 horas. El script lee tu perfil público de TikTok con yt-dlp, sin claves, y guarda en `data/tiktok.json` y `data/tiktok/`:
- los 3 últimos vídeos, con su portada;
- las cifras del perfil.

Si hay cambios, los sube y la web se actualiza sola en 1-2 minutos.

Para lanzarlo a mano: pestaña **Actions → Actualizar TikTok → Run workflow**.

Si TikTok fallara algún día, la web sigue mostrando lo último guardado. Y si no hubiera datos, usa el widget oficial del perfil.

## Cómo cambiar datos
Todo está en `config.js`. Los textos aceptan `"texto"` o `{ es: "...", en: "..." }`. Lo que esté vacío o entre `[corchetes]` no se muestra.

| Quieres… | Haz esto |
|---|---|
| Que el botón Play suene con TU música | Sube un MP3 a `assets/audio/` y pon su ruta en `audio` |
| Añadir el banner | Súbelo a `assets/photos/` y pon su ruta en `banner` |
| Añadir sets | Pega embeds de SoundCloud/YouTube en `music` |
| Cambiar tu equipo | Edita `rider.groups` |

Archivos:
- `index.html`: estructura
- `styles.css`: diseño
- `js/main.js`: contenido y animaciones
- `js/ice.js`: logo 3D
- `js/sound.js`: audio
