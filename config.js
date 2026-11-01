/* =========================================================================
   CONFIGURACIÓN DEL PRESS KIT — edita SOLO este archivo con tus datos.
   Mientras un dato esté vacío, entre [corchetes] o sea una cifra en 0,
   NO se muestra en la web: así el enlace público nunca enseña huecos.
   ========================================================================= */
window.PRESSKIT = {
  artist: {
    name: "CLEMENT",
    tagline: "Urbano, dembow y trap desde Ciudad Real",
    genres: ["Urbano", "Dembow", "Trap"],
    location: "Ciudad Real, España",
    bpm: 128,                               // Velocidad del "latido" de las animaciones y del botón Play
  },

  // Logo (blanco, fondo transparente). Si no existe, se usa un logo de texto animado.
  logo: {
    main: "assets/logo.webp",
    downloads: [
      { label: "Press kit completo (.zip)", src: "assets/download/clement-presskit.zip", primary: true },
      { label: "Logo blanco (PNG)", src: "assets/download/clement-logo-blanco.png" },
      { label: "Logo negro (PNG)",  src: "assets/download/clement-logo-negro.png" },
    ],
  },

  // Fotos recortadas (sin fondo): se colocan sobre el fondo azul de la web
  heroImage: "assets/photos/clement-gafas.webp",   // Portada (vertical)
  bioImage: "assets/photos/clement-cascos.webp",   // Sección Bio
  banner: "assets/photos/clement-banner.jpg",      // Banner horizontal a pantalla completa (se oculta si no existe)

  bio: {
    short: "CLEMENT es el DJ de Ciudad Real que convierte cada sesión en una fiesta urbana: dembow, trap y lo más fuerte del género, con energía de principio a fin.",
    long: [
      "Con más de seis años detrás de la cabina y más de 300 eventos a sus espaldas, CLEMENT se ha hecho un nombre propio en la noche urbana de Ciudad Real.",
      "Su sonido mezcla urbano, dembow y trap: sets rápidos, transiciones con carácter y una selección pensada para que la pista no pare. Lee al público y sube la energía en el momento justo.",
      "Ha pasado por cabinas como La Club, Sala Systema y Euphoria, y sigue creciendo con una imagen propia y una marca reconocible: CLEMENT.",
    ],
  },

  stats: [
    { value: 300, suffix: "+", label: "Eventos" },
    { value: 6,   suffix: "+", label: "Años pinchando" },
  ],

  // Fotos de prensa (se pueden ampliar y descargar desde la web)
  photos: [
    { src: "assets/photos/clement-cascos.webp", wide: true },
    { src: "assets/photos/clement-gafas.webp" },
    { src: "assets/photos/clement-brazos-cruzados.webp" },
    { src: "assets/photos/clement-sentado.webp" },
    { src: "assets/photos/clement-silla.webp" },
  ],

  // Música: pega URLs de embed (SoundCloud / Spotify / YouTube / Mixcloud)
  music: [
    // { title: "Live Set @ ...", embed: "https://w.soundcloud.com/player/?url=..." },
  ],

  // Salas / eventos. Si añades fecha y ciudad, se muestran en la lista.
  events: [
    { date: "", venue: "La Club",       city: "" },
    { date: "", venue: "Sala Systema",  city: "" },
    { date: "", venue: "Euphoria",      city: "" },
  ],

  // Rider técnico
  rider: [
    "2x Pioneer CDJ-3000 (o CDJ-2000NXS2) enlazados por Pro DJ Link",
    "1x Mixer Pioneer DJM-A9 o DJM-900NXS2",
    "2x Monitores de cabina potentes, a la altura del DJ",
    "1x Micrófono inalámbrico (Shure SM58 / Beta 58) conectado al mixer",
    "Cabina estable, a la altura de la cintura y sin vibraciones",
    "Toma de corriente libre en cabina",
    "Agua y toalla en cabina",
  ],

  contact: {
    bookingEmail: "jesusclesan@gmail.com",
    phone: "+34 633 156 465",
    whatsapp: "34633156465",                // Solo números
    instagram: "jesusccl_",                 // Usuario sin @
    tiktok: "djclement07",                  // Usuario sin @
    soundcloud: "",
    spotify: "",
    youtube: "",
  },
};
