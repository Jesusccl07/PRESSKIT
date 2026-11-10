/* =========================================================================
   CONFIGURACIÓN DEL PRESS KIT DE DJ BOTA — edita SOLO este archivo con sus datos.
   · Los textos pueden ser "texto" o { es: "...", en: "..." } (español / inglés).
   · Lo que esté vacío, entre [corchetes] o sea una cifra en 0 NO se muestra.
   ========================================================================= */
window.PRESSKIT = {
  url: "https://jesusccl07.github.io/PRESSKIT/djbota/",

  artist: {
    name: "DJ BOTA",
    tagline: { es: "DJ para bodas, cumpleaños, graduaciones y fiestas privadas", en: "DJ for weddings, birthdays, graduations and private parties" },
    bpm: 124,                                   // Ritmo del botón Play (y de los vúmetros)
  },

  // Audio propio (opcional): un MP3 de 30-60 s, p. ej. "assets/audio/bota.mp3". Vacío = ritmo creado en el navegador.
  audio: "",

  logo: {
    main: "assets/logo.webp",
    downloads: [
      { label: { es: "Press kit completo (.zip)", en: "Full press kit (.zip)" }, src: "assets/download/djbota-presskit.zip", primary: true },
      { label: { es: "Ficha PDF", en: "One-sheet PDF" }, src: "assets/download/djbota-ficha.pdf" },
      { label: { es: "Logo blanco (PNG)", en: "White logo (PNG)" }, src: "assets/download/djbota-logo-blanco.png" },
      { label: { es: "Logo negro (PNG)", en: "Black logo (PNG)" }, src: "assets/download/djbota-logo-negro.png" },
    ],
  },

  heroImage: "assets/photos/bota-brazos-cruzados.webp",
  aboutImage: "assets/photos/bota-sentado.webp",

  // La cifra grande que cuenta al bajar
  years: 30,
  statement: {
    es: "Más de treinta años poniendo a bailar a varias generaciones. Del vinilo a la Prime 4+, siempre con la pista llena.",
    en: "More than thirty years getting several generations dancing. From vinyl to the Prime 4+, always with a full dance floor.",
  },

  // SOBRE MÍ
  about: {
    text: {
      es: [
        "Soy DJ Bota y llevo más de 30 años poniendo música. Empecé con vinilos y hoy pincho con una Denon DJ Prime 4+, pero lo importante sigue siendo lo mismo: que la gente lo pase en grande.",
        "Lo mío son los eventos privados: bodas, cumpleaños, graduaciones y fiestas de todo tipo. Preparo cada evento con quien me contrata y en la pista leo al público para que bailen todas las edades, de los clásicos de siempre a lo que suena hoy.",
        "También he pinchado en Puertollano. Me adapto a cualquier espacio y a cualquier equipo, y si hace falta llevo mi propio equipo de sonido.",
      ],
      en: [
        "I'm DJ Bota and I've been playing music for more than 30 years. I started on vinyl and today I play on a Denon DJ Prime 4+, but what matters is still the same: that everyone has a great time.",
        "Private events are my thing: weddings, birthdays, graduations and all kinds of parties. I plan every event with whoever books me, and on the night I read the crowd so every age dances, from the all-time classics to what's playing today.",
        "I've also played in Puertollano, Spain. I adapt to any space and any setup, and if needed I bring my own sound system.",
      ],
    },
    facts: [
      { label: { es: "Experiencia", en: "Experience" }, value: { es: "Más de 30 años", en: "30+ years" } },
      { label: { es: "Eventos", en: "Events" }, value: { es: "Bodas, cumpleaños, graduaciones y fiestas privadas", en: "Weddings, birthdays, graduations and private parties" } },
      { label: { es: "Equipo", en: "Gear" }, value: "Denon DJ Prime 4+" },
      { label: { es: "Sonido", en: "Sound" }, value: { es: "Equipo propio, si lo necesitas", en: "Own sound system, if you need it" } },
    ],
  },

  // EVENTOS (cada uno es un canal de la mesa). icon: ring | cake | cap | party
  eventTypes: [
    { icon: "ring", title: { es: "Bodas", en: "Weddings" }, text: { es: "Ceremonia, cóctel, primer baile y fiesta: la música justa para cada momento del día.", en: "Ceremony, drinks, first dance and party: the right music for every moment of the day." } },
    { icon: "cake", title: { es: "Cumpleaños", en: "Birthdays" }, text: { es: "Música para todas las edades, para que se anime desde el más pequeño hasta los abuelos.", en: "Music for every age, so everyone joins in, from the kids to the grandparents." } },
    { icon: "cap", title: { es: "Graduaciones", en: "Graduations" }, text: { es: "La noche de fin de etapa: los éxitos del momento y los temas que canta todo el mundo.", en: "The end-of-school night: today's hits and the songs everybody sings." } },
    { icon: "party", title: { es: "Fiestas privadas", en: "Private parties" }, text: { es: "Aniversarios, reuniones o cualquier celebración: me adapto al ambiente y al público.", en: "Anniversaries, get-togethers or any celebration: I adapt to the vibe and the crowd." } },
  ],
  // Locales donde ha pinchado (aparecen debajo de los eventos). Ej.: { venue: "Nombre del local", city: "Puertollano" }
  venues: [
    { venue: "", city: "Puertollano" },
  ],

  photos: [
    { src: "assets/photos/bota-brazos-cruzados.webp" },
    { src: "assets/photos/bota-sentado.webp" },
    { src: "assets/photos/bota-cascos.webp" },
    { src: "assets/photos/bota-perfil.webp" },
  ],

  // Redes. Los 3 últimos TikToks y las cifras se actualizan solos (GitHub Actions, cada 3 horas).
  // Seguidores, me gusta y visualizaciones suman TikTok + Instagram. Instagram suele bloquear la
  // lectura automática: pon aquí sus totales para sumarlos (0 = usar lo leído automáticamente).
  social: {
    tiktokData: "data/tiktok.json",
    instagramFollowers: 0,
    instagramLikes: 0,
    instagramViews: 0,
  },

  // EQUIPO
  rider: {
    groups: [
      { icon: "prime", title: { es: "Equipo recomendado", en: "Recommended gear" }, items: [{ es: "Denon DJ Prime 4+: es el equipo con el que pincho.", en: "Denon DJ Prime 4+: it's the setup I play on." }] },
      { icon: "swap", title: { es: "Me adapto", en: "I adapt" }, items: [{ es: "Puedo pinchar con cualquier tipo de equipo.", en: "I can play on any kind of gear." }] },
      { icon: "speaker", title: { es: "Sonido propio", en: "Own sound system" }, items: [{ es: "Tengo equipo de sonido propio. Si lo necesitas, lo llevo: tú eliges.", en: "I have my own sound system. If you need it, I bring it: your choice." }] },
    ],
  },

  contact: {
    bookingEmail: "d.j.botadj@gmail.com",
    phone: "+34 615 156 526",
    whatsapp: "34615156526",                    // Solo números
    instagram: "d.j.bota",                      // Usuario sin @
    tiktok: "d.j.bota",                         // Usuario sin @
  },
};
