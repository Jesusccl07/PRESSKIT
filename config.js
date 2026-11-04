/* =========================================================================
   CONFIGURACIÓN DEL PRESS KIT — edita SOLO este archivo con tus datos.
   · Los textos pueden ser "texto" o { es: "...", en: "..." } (español / inglés).
   · Lo que esté vacío, entre [corchetes] o sea una cifra en 0 NO se muestra.
   ========================================================================= */
window.PRESSKIT = {
  url: "https://jesusccl07.github.io/PRESSKIT/",

  artist: {
    name: "CLEMENT",
    tagline: { es: "Reggaetón, dembow y trap desde Ciudad Real", en: "Reggaeton, dembow and trap from Ciudad Real, Spain" },
    genres: ["Reggaetón", "Dembow", "Trap"],
    location: { es: "Ciudad Real, España", en: "Ciudad Real, Spain" },
    bpm: 128,                                   // Ritmo de las animaciones y del botón Play
  },

  // Audio propio (opcional): un MP3 de 30-60 s de un set tuyo, p. ej. "assets/audio/clement-set.mp3".
  // Si está vacío, el botón Play usa un ritmo creado en el navegador.
  audio: "",

  // Fondo de la portada: tu aftermovie "La noche mágica", sin sonido, desenfocado y en azul
  heroVideo: {
    wide: "assets/video/hero-wide.mp4", posterWide: "assets/video/hero-wide.jpg",
    tall: "assets/video/hero-tall.mp4", posterTall: "assets/video/hero-tall.jpg",
  },

  logo: {
    main: "assets/logo.webp",
    downloads: [
      { label: { es: "Press kit completo (.zip)", en: "Full press kit (.zip)" }, src: "assets/download/clement-presskit.zip", primary: true },
      { label: { es: "Ficha PDF", en: "One-sheet PDF" }, src: "assets/download/clement-onesheet.pdf" },
      { label: { es: "Logo blanco (PNG)", en: "White logo (PNG)" }, src: "assets/download/clement-logo-blanco.png" },
      { label: { es: "Logo negro (PNG)", en: "Black logo (PNG)" }, src: "assets/download/clement-logo-negro.png" },
    ],
  },

  heroImage: "assets/photos/clement-gafas.webp",
  // Capas de la portada ya calculadas (etalonado frío + contraluz azul), para que el móvil no haga cuentas
  heroLayers: { base: "assets/photos/clement-gafas-graded.webp", rim: "assets/photos/clement-gafas-rim.webp" },
  // Mapas del logo de hielo (relieve y halo) a dos tamaños: ordenador y móvil
  iceMap: { large: "assets/logo-ice-map.webp", small: "assets/logo-ice-map-sm.webp" },
  aboutImage: "assets/photos/clement-cascos.webp",
  banner: "",                                     // Banner horizontal, p. ej. "assets/photos/clement-banner.jpg" (vacío = no se muestra)

  // Frase grande que se enciende al bajar
  statement: {
    es: "Seis años, más de 200 sesiones y una sola regla: que la pista no pare.",
    en: "Six years, more than 200 sets and one rule: the dance floor never stops.",
  },

  stats: [
    { value: 200, suffix: "+", label: { es: "sesiones pinchadas", en: "sets played" } },
    { value: 6,   suffix: "+", label: { es: "años de experiencia", en: "years of experience" } },
  ],

  // SOBRE MÍ
  about: {
    text: {
      es: [
        "Soy Clement, DJ de Ciudad Real. Llevo más de seis años pinchando y más de 200 sesiones a mis espaldas, y hoy soy DJ residente en La Club y en Sala Systema. También he pinchado en salas como Euphoria.",
        "Pincho reggaetón, dembow y trap: sesiones rápidas, mezclas con carácter y la pista arriba de principio a fin. Leo al público y elijo cada tema en el momento, para que nadie se quiera ir a casa.",
        "Fuera de la cabina creo mis propios mashups, mezclando clásicos con lo que suena ahora, y los comparto en TikTok. Me adapto a cualquier sala, a cualquier público y a cualquier equipo.",
      ],
      en: [
        "I'm Clement, a DJ from Ciudad Real, Spain. I've been DJing for more than six years with over 200 sets behind me, and today I'm the resident DJ at La Club and Sala Systema. I've also played venues like Euphoria.",
        "I play reggaeton, dembow and trap: fast sets, mixes with attitude and a dance floor that stays up from start to finish. I read the crowd and pick every track in the moment, so nobody wants to go home.",
        "Outside the booth I make my own mashups, blending classics with what's hot right now, and share them on TikTok. I adapt to any venue, any crowd and any setup.",
      ],
    },
    facts: [
      { label: { es: "Base", en: "Based in" }, value: { es: "Ciudad Real, España", en: "Ciudad Real, Spain" } },
      { label: { es: "Residente en", en: "Resident at" }, value: { es: "La Club y Sala Systema", en: "La Club and Sala Systema" } },
      { label: { es: "Estilos", en: "Genres" }, value: { es: "Reggaetón, dembow y trap", en: "Reggaeton, dembow and trap" } },
      { label: { es: "Experiencia", en: "Experience" }, value: { es: "Más de 6 años y 200 sesiones", en: "6+ years, 200+ sets" } },
    ],
  },

  photos: [
    { src: "assets/photos/clement-cascos.webp", wide: true },
    { src: "assets/photos/clement-gafas.webp" },
    { src: "assets/photos/clement-brazos-cruzados.webp" },
    { src: "assets/photos/clement-sentado.webp" },
    { src: "assets/photos/clement-silla.webp" },
  ],

  // Redes. Los 3 últimos TikToks y las cifras se actualizan solos (GitHub Actions, cada 3 horas).
  // Seguidores, me gusta y visualizaciones suman TikTok + Instagram. Instagram suele bloquear la
  // lectura automática, así que sus cifras pueden quedarse atrás: pon aquí tus totales para corregirlas.
  social: {
    tiktokData: "data/tiktok.json",
    instagramFollowers: 0,   // 0 = usar lo leído automáticamente
    instagramLikes: 0,       // 0 = usar lo leído automáticamente (si Instagram lo deja leer)
    instagramViews: 0,       // 0 = usar lo leído automáticamente (si Instagram lo deja leer)
  },

  // Música: URLs de embed (SoundCloud / Spotify / YouTube / Mixcloud)
  music: [
    // { title: "Live set @ ...", embed: "https://w.soundcloud.com/player/?url=..." },
  ],

  // Salas. resident: true añade el rótulo "Residente"
  events: [
    { venue: "La Club", city: "Ciudad Real", resident: true },
    { venue: "Sala Systema", resident: true },
    { venue: "Euphoria" },
  ],

  // Rider técnico (sencillo: lo justo para que la sala sepa qué necesito)
  rider: {
    groups: [
      {
        icon: "deck",
        title: { es: "Equipo", en: "Gear" },
        items: [
          { es: "Normalmente pincho con equipos Denon DJ, pero me adapto a cualquier sistema Pioneer.", en: "I usually play on Denon DJ gear, but I adapt to any Pioneer setup." },
        ],
      },
      {
        icon: "monitor",
        required: true,
        title: { es: "Monitores de cabina", en: "Booth monitors" },
        items: [
          { es: "Necesito monitores en cabina para poder pinchar.", en: "I need booth monitors to be able to play." },
        ],
      },
      {
        icon: "case",
        title: { es: "Si hace falta, llevo mi equipo", en: "I can bring my own gear" },
        items: [
          { es: "Si la sala no tiene equipo, puedo llevar el mío.", en: "If the venue has no gear, I can bring mine." },
        ],
      },
    ],
    extras: [],
  },

  contact: {
    bookingEmail: "jesusclesan@gmail.com",
    phone: "+34 633 156 465",
    whatsapp: "34633156465",                    // Solo números
    instagram: "jesusccl_",                     // Usuario sin @
    tiktok: "djclement07",                      // Usuario sin @
    soundcloud: "",
    spotify: "",
    youtube: "",
  },
};
