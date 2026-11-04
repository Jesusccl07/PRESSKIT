/* =========================================================================
   CONFIGURACIÓN DEL PRESS KIT — edita SOLO este archivo con tus datos.
   · Los textos pueden ser "texto" o { es: "...", en: "..." } (español / inglés).
   · Lo que esté vacío, entre [corchetes] o sea una cifra en 0 NO se muestra.
   ========================================================================= */
window.PRESSKIT = {
  url: "https://jesusccl07.github.io/PRESSKIT/",

  artist: {
    name: "CLEMENT",
    tagline: { es: "Urbano, dembow y trap desde Ciudad Real", en: "Urbano, dembow and trap from Ciudad Real, Spain" },
    genres: ["Urbano", "Dembow", "Trap"],
    location: { es: "Ciudad Real, España", en: "Ciudad Real, Spain" },
    bpm: 128,                                   // Ritmo de las animaciones y del botón Play
  },

  // Audio propio (opcional): pon aquí un MP3 de 30-60 s de un set tuyo, p. ej. "assets/audio/clement-set.mp3".
  // Si está vacío, el botón Play usa un ritmo creado en el navegador.
  audio: "",

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
  bioImage: "assets/photos/clement-cascos.webp",
  banner: "",                                     // Banner horizontal, p. ej. "assets/photos/clement-banner.jpg" (vacío = no se muestra)

  bio: {
    short: {
      es: "CLEMENT es el DJ de Ciudad Real que convierte cada sesión en una fiesta urbana: dembow, trap y lo más fuerte del género, con energía de principio a fin.",
      en: "CLEMENT is the Ciudad Real DJ who turns every set into an urban party: dembow, trap and the hardest hitters of the genre, with energy from start to finish.",
    },
    long: {
      es: [
        "Con más de seis años detrás de la cabina y más de 300 eventos a sus espaldas, CLEMENT se ha hecho un nombre propio en la noche urbana de Ciudad Real.",
        "Su sonido mezcla urbano, dembow y trap: sets rápidos, transiciones con carácter y una selección pensada para que la pista no pare. Lee al público y sube la energía en el momento justo.",
        "Ha pasado por cabinas como La Club, Sala Systema y Euphoria, y sigue creciendo con una imagen propia y una marca reconocible.",
      ],
      en: [
        "With more than six years behind the decks and over 300 events played, CLEMENT has made a name for himself in Ciudad Real's urban nightlife.",
        "His sound blends urbano, dembow and trap: fast sets, transitions with attitude and a selection built to keep the dance floor moving. He reads the crowd and lifts the energy at exactly the right moment.",
        "He has played booths like La Club, Sala Systema and Euphoria, and keeps growing with a look and a brand of his own.",
      ],
    },
  },

  stats: [
    { value: 300, suffix: "+", label: { es: "eventos", en: "events" } },
    { value: 6,   suffix: "+", label: { es: "años pinchando", en: "years behind the decks" } },
  ],

  photos: [
    { src: "assets/photos/clement-cascos.webp", wide: true },
    { src: "assets/photos/clement-gafas.webp" },
    { src: "assets/photos/clement-brazos-cruzados.webp" },
    { src: "assets/photos/clement-sentado.webp" },
    { src: "assets/photos/clement-silla.webp" },
  ],

  // Música: URLs de embed (SoundCloud / Spotify / YouTube / Mixcloud)
  music: [
    // { title: "Live set @ ...", embed: "https://w.soundcloud.com/player/?url=..." },
  ],

  // Salas / eventos. Si añades fecha y ciudad, se muestran.
  events: [
    { date: "", venue: "La Club",      city: "" },
    { date: "", venue: "Sala Systema", city: "" },
    { date: "", venue: "Euphoria",     city: "" },
  ],

  rider: [
    { es: "2 Pioneer CDJ-3000 (o CDJ-2000NXS2) enlazados por Pro DJ Link", en: "2 Pioneer CDJ-3000 (or CDJ-2000NXS2) linked via Pro DJ Link" },
    { es: "Mixer Pioneer DJM-A9 o DJM-900NXS2", en: "Pioneer DJM-A9 or DJM-900NXS2 mixer" },
    { es: "2 monitores de cabina potentes, a la altura del DJ", en: "2 powerful booth monitors at DJ height" },
    { es: "Micrófono inalámbrico (Shure SM58 / Beta 58) conectado al mixer", en: "Wireless mic (Shure SM58 / Beta 58) into the mixer" },
    { es: "Cabina estable, a la altura de la cintura y sin vibraciones", en: "Stable, waist-high booth with no vibration" },
    { es: "Toma de corriente libre en cabina", en: "Free power outlet in the booth" },
    { es: "Agua y toalla en cabina", en: "Water and a towel in the booth" },
  ],

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
