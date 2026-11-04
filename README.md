# CLEMENT · DJ Press Kit

Web pública: **https://jesusccl07.github.io/PRESSKIT/** · versión en inglés: `?lang=en`

## Qué hay dentro
- **Intro de cine:** el logo se forma con cristales de hielo que vuelan y encajan, con grietas y destello (una vez por visita).
- **Logo de hielo en WebGL** (`js/ice.js`): relieve, grietas internas, escarcha, reflejos tipo cromo y halo neón. La luz sigue al ratón, y con el botón Play late con cada bombo. Si el navegador no tiene WebGL, se muestra el PNG.
- **Scroll tipo película** con GSAP + ScrollTrigger y scroll suave con Lenis:
  - la portada se queda fija, se agrieta y se acerca
  - el texto se enciende palabra a palabra
  - las cifras cuentan hacia arriba
  - la galería es horizontal
  - las salas se rellenan de hielo
- **ES / EN** con un botón (se recuerda la elección).
- **Booking:** el formulario abre WhatsApp o el email con el mensaje ya escrito.
- **Material para promotores:** ZIP, ficha PDF y logos.
- **Accesible:** respeta "reducir movimiento" y funciona con teclado. Lighthouse: accesibilidad, buenas prácticas y SEO al 100.

## Cómo cambiar datos
Todo está en `config.js`. Los textos aceptan `"texto"` o `{ es: "...", en: "..." }`. Lo que esté vacío o entre `[corchetes]` no se muestra.

| Quieres… | Haz esto |
|---|---|
| Que el botón Play suene con TU música | Sube un MP3 a `assets/audio/` y pon su ruta en `audio` |
| Añadir el banner | Súbelo a `assets/photos/` y pon su ruta en `banner` |
| Añadir sets | Pega embeds de SoundCloud/YouTube en `music` |
| Fechas en las salas | Rellena `date` y `city` en `events` |

Archivos: `index.html` (estructura) · `styles.css` (diseño) · `js/main.js` (animaciones y contenido) · `js/ice.js` (logo 3D) · `js/sound.js` (audio).

Cada cambio subido a la rama publicada se actualiza en la web en 1-2 minutos (GitHub Pages).
