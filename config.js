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

  // Logos: si los archivos no existen, se usa un logo de texto animado.
  logo: {
    main: "assets/logo.png",                // Logo principal (PNG/SVG con fondo transparente)
    icon: "assets/logo-icon.png",           // Isotipo / símbolo (opcional)
  },

  heroImage: "assets/hero.jpg",             // Foto grande de portada

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
    "assets/photos/foto1.jpg",
    "assets/photos/foto2.jpg",
    "assets/photos/foto3.jpg",
    "assets/photos/foto4.jpg",
    "assets/photos/foto5.jpg",
    "assets/photos/foto6.jpg",
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
