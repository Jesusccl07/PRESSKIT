/* =========================================================================
   CONFIGURACIÓN DEL PRESS KIT — edita SOLO este archivo con tus datos.
   Todo lo que está entre [corchetes] es un hueco para rellenar.
   Las imágenes van en la carpeta /assets (mira assets/LEEME.md).
   ========================================================================= */
window.PRESSKIT = {
  artist: {
    name: "CLEMENT",                       // Nombre artístico (sale en el logo de texto si no hay logo.png)
    tagline: "[Tu frase / estilo en una línea]",
    genres: ["[Género 1]", "[Género 2]", "[Género 3]"],
    location: "[Ciudad, País]",
    bpm: 128,                               // Velocidad del "latido" de las animaciones
  },

  // Logo (blanco, fondo transparente). Si no existe, se usa un logo de texto animado.
  logo: {
    main: "assets/logo.webp",
    downloads: [
      { label: "Logo blanco (PNG)", src: "assets/download/clement-logo-blanco.png" },
      { label: "Logo negro (PNG)",  src: "assets/download/clement-logo-negro.png" },
    ],
  },

  // Fotos recortadas (sin fondo): se colocan sobre el fondo azul de la web
  heroImage: "assets/photos/clement-gafas.webp",   // Portada (vertical)
  bioImage: "assets/photos/clement-cascos.webp",   // Sección Bio
  banner: "assets/photos/clement-banner.jpg",      // Banner horizontal a pantalla completa (se oculta si no existe)

  bio: {
    short: "[Bio corta: 2-3 frases. Quién eres, qué pinchas y qué te hace diferente.]",
    long: [
      "[Párrafo 1: tus inicios y cómo empezaste a pinchar.]",
      "[Párrafo 2: tu sonido, influencias y lo que se vive en tus sets.]",
      "[Párrafo 3: logros, clubs, festivales, producciones y próximos pasos.]",
    ],
  },

  stats: [
    { value: 0,  suffix: "+", label: "Eventos" },
    { value: 0,  suffix: "+", label: "Años pinchando" },
    { value: 0,  suffix: "K", label: "Seguidores" },
    { value: 0,  suffix: "",  label: "Ciudades" },
  ],

  // Fotos de prensa (se pueden descargar desde la web)
  photos: [
    { src: "assets/photos/clement-cascos.webp",          wide: true },
    { src: "assets/photos/clement-gafas.webp" },
    { src: "assets/photos/clement-brazos-cruzados.webp" },
    { src: "assets/photos/clement-sentado.webp" },
    { src: "assets/photos/clement-silla.webp" },
  ],

  // Música: pega URLs de embed (SoundCloud / Spotify / YouTube / Mixcloud)
  music: [
    // { title: "Live Set @ ...", embed: "https://w.soundcloud.com/player/?url=..." },
  ],

  // Eventos / clubs / festivales donde has pinchado
  events: [
    { date: "[Fecha]", venue: "[Club / Festival]", city: "[Ciudad]" },
    { date: "[Fecha]", venue: "[Club / Festival]", city: "[Ciudad]" },
    { date: "[Fecha]", venue: "[Club / Festival]", city: "[Ciudad]" },
  ],

  // Rider técnico
  rider: [
    "2x Pioneer CDJ-3000 (o CDJ-2000NXS2)",
    "1x Mixer Pioneer DJM-900NXS2 / DJM-A9",
    "2x Monitores de cabina de alta potencia",
    "Mesa estable a la altura de la cintura",
    "[Añade aquí lo que necesites]",
  ],

  contact: {
    bookingEmail: "[booking@tumarca.com]",
    phone: "[+34 600 000 000]",
    whatsapp: "",                           // Solo números, ej: "34600000000"
    instagram: "",                          // Usuario sin @, ej: "clement.dj"
    tiktok: "",                             // Usuario sin @
    soundcloud: "",                         // URL completa
    spotify: "",                            // URL completa
    youtube: "",                            // URL completa
  },
};
