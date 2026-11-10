(() => {
  window.__introDone = true; // main.js cargó: la red de seguridad del <head> ya no hace falta
  const C = window.PRESSKIT;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const isPh = (v) => v == null || String(v).trim() === "" || /^\s*\[.*\]\s*$/.test(String(v));
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const touch = matchMedia("(pointer: coarse)").matches;
  const conn = navigator.connection || {};
  const slowNet = !!conn.saveData || /(^|-)2g$|^3g$/.test(conn.effectiveType || "");
  const G = window.gsap, ST = window.ScrollTrigger;
  const animated = !!(G && ST) && !reduce;
  const root = document.documentElement;
  const safe = (fn, fb) => { try { return fn(); } catch (e) { return fb; } };
  const store = { get: (k) => safe(() => localStorage.getItem(k), null), set: (k, v) => safe(() => localStorage.setItem(k, v)) };
  const sess = { get: (k) => safe(() => sessionStorage.getItem(k), null), set: (k, v) => safe(() => sessionStorage.setItem(k, v)) };
  if (G && ST) { G.registerPlugin(ST); ST.config({ ignoreMobileResize: true }); }

  /* ===================== IDIOMA ===================== */
  const urlLang = new URLSearchParams(location.search).get("lang");
  let lang = urlLang || store.get("bota-lang") || ((navigator.language || "es").toLowerCase().startsWith("es") ? "es" : "en");
  if (!["es", "en"].includes(lang)) lang = "es";
  root.lang = lang;
  const tr = (v) => (v && typeof v === "object" && !Array.isArray(v) ? v[lang] ?? v.es : v);
  const I18N = {
    es: {
      "nav.about": "Sobre mí", "nav.events": "Eventos", "nav.photos": "Fotos", "nav.social": "Redes", "nav.rider": "Equipo", "nav.booking": "Reservar",
      "hero.book": "Reservar fecha", "hero.events": "Ver eventos", "hero.years": "Más de {n} años de experiencia",
      "years.label": "Años detrás de la cabina",
      "about.title": "Sobre mí",
      "events.title": "Eventos", "events.sub": "Cada evento es un canal distinto de la mesa: lo preparo contigo y lo ajusto en directo según el ambiente.",
      "venues.played": "También he pinchado en",
      "photos.title": "Fotos", "photos.sub": "Fotos de estudio en alta calidad para carteles e invitaciones. Toca una para verla en grande.",
      "photos.download": "Descargar", "photos.dlTitle": "Material para descargar", "photos.dlText": "Logos en blanco y negro, fotos y la ficha en PDF.",
      "social.title": "En redes", "social.sub": "Mis tres últimos vídeos de TikTok. Se actualizan solos cada vez que subo uno nuevo.",
      "social.followers": "seguidores", "social.followersBoth": "seguidores en TikTok e Instagram", "social.likes": "me gusta", "social.views": "visualizaciones",
      "social.noteTT": "Me gusta y visualizaciones de TikTok.", "social.noteBoth": "Sumando TikTok e Instagram.",
      "social.noteLikesTT": "Me gusta de TikTok; el resto suma TikTok e Instagram.", "social.noteViewsTT": "Visualizaciones de TikTok; el resto suma TikTok e Instagram.",
      "social.follow": "Seguir en TikTok", "social.open": "Abrir en TikTok", "social.play": "Reproducir vídeo", "social.updated": "Actualizado",
      "rider.title": "Equipo",
      "booking.title": "Reserva tu fecha", "booking.text": "Cuéntame cómo es tu evento y te respondo lo antes posible. El mensaje sale ya redactado por WhatsApp o por email.",
      "form.name": "Nombre", "form.type": "Tipo de evento", "form.date": "Fecha", "form.place": "Lugar", "form.guests": "Invitados (aprox.)",
      "form.sound": "Equipo de sonido", "form.message": "Mensaje: horario, estilo de música, lo que quieras", "form.wa": "Enviar por WhatsApp", "form.mail": "Enviar por email",
      "form.error": "Escribe al menos tu nombre.", "form.pick": "Elige una opción",
      "type.boda": "Boda", "type.cumple": "Cumpleaños", "type.grad": "Graduación", "type.fiesta": "Fiesta privada", "type.otro": "Otro",
      "snd.yes": "Sí, necesito equipo de sonido", "snd.no": "No, el sitio ya tiene", "snd.unk": "No lo sé todavía",
      "msg.hello": "Hola {name}, quiero contratarte para un evento.", "msg.name": "Nombre", "msg.type": "Evento", "msg.date": "Fecha", "msg.place": "Lugar", "msg.guests": "Invitados", "msg.sound": "Sonido",
      "contact.phone": "Teléfono", "contact.whatsapp": "WhatsApp", "contact.waValue": "Escríbeme", "contact.mail": "Email",
      "footer.rights": "Todos los derechos reservados.", "footer.top": "Volver arriba",
      "sound.play": "Play", "sound.pause": "Pausa", "lang.label": "View in English", "ui.swipe": "Desliza", "ui.skip": "Saltar al contenido",
    },
    en: {
      "nav.about": "About", "nav.events": "Events", "nav.photos": "Photos", "nav.social": "Social", "nav.rider": "Gear", "nav.booking": "Book",
      "hero.book": "Book a date", "hero.events": "See events", "hero.years": "More than {n} years of experience",
      "years.label": "Years behind the decks",
      "about.title": "About me",
      "events.title": "Events", "events.sub": "Every event is a different channel on the mixer: I plan it with you and fine-tune it live to the vibe.",
      "venues.played": "I've also played in",
      "photos.title": "Photos", "photos.sub": "High-quality studio photos for posters and invitations. Tap one to see it full size.",
      "photos.download": "Download", "photos.dlTitle": "Downloads", "photos.dlText": "White and black logos, photos and the PDF one-sheet.",
      "social.title": "On social", "social.sub": "My three latest TikTok videos. They update by themselves every time I post a new one.",
      "social.followers": "followers", "social.followersBoth": "followers on TikTok and Instagram", "social.likes": "likes", "social.views": "views",
      "social.noteTT": "Likes and views from TikTok.", "social.noteBoth": "TikTok and Instagram combined.",
      "social.noteLikesTT": "Likes from TikTok; the rest is TikTok and Instagram combined.", "social.noteViewsTT": "Views from TikTok; the rest is TikTok and Instagram combined.",
      "social.follow": "Follow on TikTok", "social.open": "Open in TikTok", "social.play": "Play video", "social.updated": "Updated",
      "rider.title": "Gear",
      "booking.title": "Book your date", "booking.text": "Tell me about your event and I'll get back to you soon. Your message goes out ready-written via WhatsApp or email.",
      "form.name": "Name", "form.type": "Type of event", "form.date": "Date", "form.place": "Place", "form.guests": "Guests (approx.)",
      "form.sound": "Sound system", "form.message": "Message: times, music style, anything else", "form.wa": "Send via WhatsApp", "form.mail": "Send via email",
      "form.error": "Add at least your name.", "form.pick": "Choose an option",
      "type.boda": "Wedding", "type.cumple": "Birthday", "type.grad": "Graduation", "type.fiesta": "Private party", "type.otro": "Other",
      "snd.yes": "Yes, I need a sound system", "snd.no": "No, the venue has one", "snd.unk": "Not sure yet",
      "msg.hello": "Hi {name}, I'd like to book you for an event.", "msg.name": "Name", "msg.type": "Event", "msg.date": "Date", "msg.place": "Place", "msg.guests": "Guests", "msg.sound": "Sound",
      "contact.phone": "Phone", "contact.whatsapp": "WhatsApp", "contact.waValue": "Message me", "contact.mail": "Email",
      "footer.rights": "All rights reserved.", "footer.top": "Back to top",
      "sound.play": "Play", "sound.pause": "Pause", "lang.label": "Ver en español", "ui.swipe": "Swipe", "ui.skip": "Skip to content",
    },
  };
  const T = (k) => I18N[lang][k] ?? I18N.es[k] ?? k;
  if (lang === "en") $('meta[name="description"]').content = "Official press kit of DJ BOTA: 30+ years as a DJ for weddings, birthdays, graduations and private parties. Denon DJ Prime 4+ and own sound system. Photos, logos and contact.";
  const num = (n) => n < 10000
    ? String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, lang === "es" ? "." : ",")
    : new Intl.NumberFormat(lang === "es" ? "es-ES" : "en-GB", { notation: "compact", maximumFractionDigits: 1 }).format(n);
  const hideSection = (id) => { const s = document.getElementById(id); if (s) s.hidden = true; };

  /* ===================== ICONOS ===================== */
  const ICONS = {
    phone: '<path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z"/>',
    mail: '<path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4-8 5-8-5V6l8 5 8-5z"/>',
    whatsapp: '<path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-3.3-.8a11 11 0 0 1-4.3-3.8c-.3-.5-1-1.5-1-2.8s.7-2 .9-2.3c.3-.3.6-.3.8-.3h.6c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.3 0 .5l-.3.5-.4.4c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.2.5.1.6 0l.9-1c.2-.3.4-.2.7-.1l2 1c.3.1.5.2.5.3.1.1.1.6-.1 1.2z"/>',
    instagram: '<path d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4zM17.3 5.5a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4zM21.9 7.1c-.1-1.6-.4-3-1.6-4.2S17.7 1.3 16.1 1.2C14.4 1.1 9.6 1.1 7.9 1.2 6.3 1.3 4.9 1.6 3.7 2.8S2.1 5.5 2 7.1C1.9 8.8 1.9 15.2 2 16.9c.1 1.6.4 3 1.6 4.2s2.6 1.5 4.2 1.6c1.7.1 6.5.1 8.2 0 1.6-.1 3-.4 4.2-1.6s1.5-2.6 1.6-4.2c.1-1.7.1-8.1.1-9.8zm-2.2 11.6a3.3 3.3 0 0 1-1.9 1.9c-1.3.5-4.4.4-5.8.4s-4.5.1-5.8-.4a3.3 3.3 0 0 1-1.9-1.9c-.5-1.3-.4-4.4-.4-5.8s-.1-4.5.4-5.8A3.3 3.3 0 0 1 6.2 3.2c1.3-.5 4.4-.4 5.8-.4s4.5-.1 5.8.4a3.3 3.3 0 0 1 1.9 1.9c.5 1.3.4 4.4.4 5.8s.1 4.5-.4 5.8z"/>',
    tiktok: '<path d="M16.6 2h-3.3v13.4a2.9 2.9 0 1 1-2-2.8V9.2a6.2 6.2 0 1 0 5.3 6.2V8.6a7.6 7.6 0 0 0 4.4 1.4V6.7a4.4 4.4 0 0 1-4.4-4.4z"/>',
    heart: '<path d="M12 21s-7.5-4.6-9.6-9.2C.8 8.2 3 4.5 6.6 4.5c2.1 0 3.5 1.2 4.4 2.6.9-1.4 2.3-2.6 4.4-2.6 3.6 0 5.8 3.7 4.2 7.3C19.5 16.4 12 21 12 21z"/>',
    comment: '<path d="M12 3C6.5 3 2 6.8 2 11.5c0 2.6 1.4 4.9 3.6 6.5L5 22l4.3-2.3c.9.2 1.8.3 2.7.3 5.5 0 10-3.8 10-8.5S17.5 3 12 3z"/>',
    eye: '<path d="M12 5C6.5 5 2.3 8.6 1 12c1.3 3.4 5.5 7 11 7s9.7-3.6 11-7c-1.3-3.4-5.5-7-11-7zm0 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"/>',
    play: '<path d="M7 4.5v15l13-7.5z"/>',
    pin: '<path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/>',
  };
  const svg = (k) => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[k]}</svg>`;
  // Iconos de línea (64×64) para eventos y equipo
  const LINE = {
    ring: '<circle cx="25" cy="40" r="15"/><circle cx="39" cy="40" r="15"/><path d="M28 12h8l4 5-8 7-8-7z"/>',
    cake: '<path d="M10 54h44M15 54V35h34v19M15 43c4 3 8 3 11.3 0s7.7-3 11.4 0 8 3 11.3 0"/><path d="M24 35v-7M32 35v-9M40 35v-7"/><path d="M32 20c-2.2-2-2.2-5 0-7.5 2.2 2.5 2.2 5.5 0 7.5zM24 22c-1.6-1.5-1.6-3.8 0-5.6 1.6 1.8 1.6 4.1 0 5.6zM40 22c-1.6-1.5-1.6-3.8 0-5.6 1.6 1.8 1.6 4.1 0 5.6z"/>',
    cap: '<path d="M4 26l28-12 28 12-28 12z"/><path d="M16 31v11c0 4 7 8 16 8s16-4 16-8V31"/><path d="M58 27v14"/><circle cx="58" cy="44" r="2.5"/>',
    party: '<circle cx="30" cy="38" r="17"/><path d="M13 38h34M30 21v34M18 27c8 4 16 4 24 0M18 49c8-4 16-4 24 0M24 22c-3 10-3 22 0 32M36 22c3 10 3 22 0 32M30 21V8"/><path d="M52 8l2 4.5 4.5 1.5-4.5 2-1.5 4.5-2-4.5-4.5-1.5 4.5-2z"/>',
    prime: '<rect x="3" y="16" width="58" height="32" rx="4"/><circle cx="15" cy="34" r="8"/><circle cx="49" cy="34" r="8"/><rect x="25" y="20" width="14" height="9" rx="1"/><path d="M28 34v9M32 34v9M36 34v9"/>',
    swap: '<rect x="5" y="9" width="22" height="14" rx="2"/><rect x="37" y="41" width="22" height="14" rx="2"/><circle cx="12" cy="16" r="3"/><circle cx="52" cy="48" r="3"/><path d="M34 16h18l-6-6M52 16l-6 6M30 48H12l6 6M12 48l6-6"/>',
    speaker: '<rect x="14" y="4" width="36" height="56" rx="4"/><circle cx="32" cy="39" r="11"/><circle cx="32" cy="39" r="4"/><circle cx="32" cy="17" r="5"/>',
  };
  const line = (k, cls = "") => `<svg class="${cls}" viewBox="0 0 64 64" aria-hidden="true">${LINE[k] || LINE.party}</svg>`;
  const ext = (href) => (href.startsWith("http") ? ' target="_blank" rel="noopener"' : "");
  const contactItems = () => {
    const k = C.contact;
    return [
      ["phone", T("contact.phone"), k.phone, `tel:${String(k.phone).replace(/[^\d+]/g, "")}`],
      ["whatsapp", T("contact.whatsapp"), k.whatsapp && T("contact.waValue"), `https://wa.me/${k.whatsapp}`],
      ["mail", T("contact.mail"), k.bookingEmail, `mailto:${k.bookingEmail}`],
      ["instagram", "Instagram", k.instagram && `@${k.instagram}`, `https://www.instagram.com/${k.instagram}/`],
      ["tiktok", "TikTok", k.tiktok && `@${k.tiktok}`, `https://www.tiktok.com/@${k.tiktok}`],
    ].filter(([, , v]) => !isPh(v));
  };

  let galleryList = [];

  /* ===================== CONTENIDO ===================== */
  async function render() {
    $$("[data-i18n]").forEach((el) => (el.textContent = T(el.dataset.i18n)));
    $$("#langBtn span").forEach((s) => s.classList.toggle("on", s.dataset.l === lang));
    $("#langBtn").setAttribute("aria-label", T("lang.label"));
    $("#soundLabel").textContent = T("sound.play");
    const name = esc(C.artist.name), logo = C.logo.main;

    // Logos (portada, menú, etiqueta del disco y pie)
    $("#heroLogo").src = logo;
    $("#labelLogo").src = logo;
    $("#navLogo").innerHTML = `<img src="${logo}" alt="${name}">`;
    $("#footerLogo").innerHTML = `<img src="${logo}" alt="" loading="lazy">`;
    if (!isPh(C.heroImage) && !$("#heroPhoto img").src.endsWith(C.heroImage)) $("#heroPhoto img").src = C.heroImage;
    const ring = (lang === "es" ? "DJ BOTA · BODAS · CUMPLEAÑOS · GRADUACIONES · FIESTAS PRIVADAS · " : "DJ BOTA · WEDDINGS · BIRTHDAYS · GRADUATIONS · PRIVATE PARTIES · ");
    $("#ringText").textContent = ring;

    // Portada
    const tag = tr(C.artist.tagline);
    if (isPh(tag)) $("#tagline").remove(); else $("#tagline").textContent = tag;
    if (+C.years > 0) $("#heroYears").textContent = T("hero.years").replace("{n}", C.years); else $("#heroYears").remove();
    $("#heroActions").innerHTML = `<a href="#booking" class="btn btn-primary">${T("hero.book")}</a><a href="#events" class="btn btn-ghost">${T("hero.events")}</a>`;

    // 30 años
    if (+C.years > 0) {
      $("#yearsNum").textContent = C.years;
      $("#yearsLabel").textContent = T("years.label");
      const st = tr(C.statement);
      if (isPh(st)) $("#statementText").remove(); else $("#statementText").textContent = st;
    } else hideSection("years");

    // Sobre mí
    const about = (tr(C.about?.text) || []).filter((p) => !isPh(p));
    if (!about.length) hideSection("about");
    else {
      $("#aboutText").innerHTML = about.map((p) => `<p>${esc(p)}</p>`).join("");
      const facts = (C.about.facts || []).filter((f) => !isPh(tr(f.value)));
      if (facts.length) $("#aboutFacts").innerHTML = facts.map((f) => `<div><dt>${esc(tr(f.label))}</dt><dd>${esc(tr(f.value))}</dd></div>`).join("");
      else $("#aboutFacts").remove();
      if (!isPh(C.aboutImage)) $("#aboutPhoto").innerHTML = `<img src="${C.aboutImage}" alt="${name}" loading="lazy" decoding="async">`;
      else $("#aboutPhoto").remove();
    }

    // Eventos: canales de la mesa
    const evs = (C.eventTypes || []).filter((e) => !isPh(tr(e.title)));
    if (!evs.length) hideSection("events");
    else $("#mixer").innerHTML = evs.map((e) => `
      <article class="channel">
        <div class="ch-content">${line(e.icon, "ev-icon")}<div class="ch-body"><h3>${esc(tr(e.title))}</h3><p>${esc(tr(e.text))}</p></div></div>
        <div class="ch-rail" aria-hidden="true"><span class="vu"></span><span class="fader"><i class="fader-cap"></i></span></div>
      </article>`).join("");
    const places = (C.venues || []).map((v) => [v.venue, v.city].filter((x) => !isPh(x)).join(", ")).filter(Boolean);
    if (places.length) $("#venuesLine").innerHTML = `${svg("pin")}<span>${T("venues.played")} ${esc(places.join(" · "))}.</span>`;

    // Fotos
    const photos = (C.photos || []).filter((p) => p && !isPh(p.src));
    galleryList = photos.map((p) => p.src);
    if (!photos.length) hideSection("photos");
    else $("#gallery").innerHTML = photos.map((p, i) => `
      <figure class="shot" data-i="${i}">
        <div class="shot-frame"><img src="${p.src}" alt="${name}, foto ${i + 1}" loading="lazy" decoding="async" draggable="false"></div>
        <figcaption><span>${i + 1}/${photos.length}</span><a href="${p.src}" download>${T("photos.download")}</a></figcaption>
      </figure>`).join("");
    const dls = (C.logo.downloads || []).map((l) => `<a class="btn ${l.primary ? "btn-primary" : "btn-ghost"}" href="${l.src}" download>${esc(tr(l.label))}</a>`).join("");
    if (dls) $("#downloads").innerHTML = `<h3>${T("photos.dlTitle")}</h3>${dls}<p>${T("photos.dlText")}</p>`; else $("#downloads").remove();

    await renderSocial();

    // Equipo: la Prime 4+ dibujada + la lista
    const groups = (C.rider?.groups || []).map((g) => ({ ...g, items: (g.items || []).map(tr).filter((t) => !isPh(t)) })).filter((g) => g.items.length);
    if (!groups.length) hideSection("rider");
    else {
      $("#riderList").innerHTML = groups.map((g, i) =>
        `<div class="rider-item${i === 0 ? " main" : ""}">${line(g.icon)}<div><h3>${esc(tr(g.title))}</h3>${g.items.map((t) => `<p>${esc(t)}</p>`).join("")}</div></div>`).join("");
      $("#prime").innerHTML = primeSVG();
    }

    // Booking
    const items = contactItems();
    if (!items.length) hideSection("booking");
    else {
      $("#contactList").innerHTML = items.map(([icon, label, value, href]) =>
        `<li><a href="${esc(href)}"${ext(href)}>${svg(icon)}<small>${esc(label)}</small><span>${esc(value)}</span></a></li>`).join("");
      const social = items.filter(([i]) => !["phone", "mail"].includes(i));
      $("#footerSocial").innerHTML = social.map(([icon, label, , href]) => `<a href="${esc(href)}"${ext(href)} aria-label="${esc(label)}">${svg(icon)}</a>`).join("");
      $("#menuSocial").innerHTML = items.filter(([i]) => i !== "phone").map(([icon, label, , href]) => `<a href="${esc(href)}"${ext(href)} aria-label="${esc(label)}">${svg(icon)}</a>`).join("");
      if (!isPh(C.contact.whatsapp)) {
        const wa = $("#dockWa");
        wa.href = `https://wa.me/${C.contact.whatsapp}?text=${encodeURIComponent(T("msg.hello").replace("{name}", C.artist.name))}`;
        wa.innerHTML = svg("whatsapp"); wa.hidden = false;
      }
      setupForm();
    }
    $("#year").textContent = new Date().getFullYear();
    $$('#navLinks > a[href^="#"]').forEach((a) => { const t = document.querySelector(a.getAttribute("href")); if (!t || t.hidden) a.hidden = true; });
  }

  // Denon DJ Prime 4+ en línea (platos, pantalla con la onda, faders y pads)
  function primeSVG() {
    let bars = "";
    for (let i = 0, x = 0; i < 150; i++, x += 4) {
      const h = 6 + Math.abs(Math.sin(i * 0.37) * 26 + Math.sin(i * 1.7) * 14 + (i % 8 === 0 ? 18 : 0));
      bars += `<rect x="${x}" y="${-h / 2}" width="2.4" height="${h}"/>`;
    }
    const pads = (x0) => [0, 1].map((r) => [0, 1, 2, 3].map((c) => `<rect class="pad" x="${x0 + c * 52}" y="${44 + r * 40}" width="44" height="30" rx="5"/>`).join("")).join("");
    const jog = (cx) => `<g><circle class="ln" cx="${cx}" cy="285" r="106"/><circle class="body" cx="${cx}" cy="285" r="96"/>
      <g class="jog" data-cx="${cx}"><circle class="ln" cx="${cx}" cy="285" r="80" stroke-dasharray="3 9"/><path class="ln" d="M${cx} 199v26"/><circle class="acc" cx="${cx}" cy="211" r="4"/></g>
      <circle class="screen" cx="${cx}" cy="285" r="36"/><circle class="acc" cx="${cx}" cy="285" r="36" stroke-dasharray="40 186"/></g>`;
    const faders = [375, 425, 475, 525].map((x, i) => `<circle class="ln" cx="${x}" cy="236" r="9"/><path class="ln" d="M${x} 262v90"/><rect class="fcap" x="${x - 13}" y="${300 - (i % 2) * 22}" width="26" height="12" rx="2" fill="#b3aaa3"/>`).join("");
    return `<svg viewBox="0 0 900 430">
      <defs><clipPath id="scr"><rect x="304" y="40" width="292" height="154" rx="6"/></clipPath></defs>
      <rect class="body" x="10" y="10" width="880" height="410" rx="28"/>
      ${pads(38)}${pads(654)}
      <rect class="screen" x="300" y="36" width="300" height="162" rx="9"/>
      <g clip-path="url(#scr)"><g id="primeWave" class="wave" transform="translate(304 92)">${bars}</g><g class="wave" transform="translate(304 152)" opacity=".55" id="primeWave2">${bars}</g></g>
      <path d="M450 40v154" stroke="#f1ebe5" stroke-width="1.6"/>
      <text class="brand" x="450" y="218" text-anchor="middle">PRIME 4+</text>
      ${faders}
      <path class="ln" d="M405 388h90"/><rect x="438" y="381" width="24" height="14" rx="2" fill="#b3aaa3"/>
      ${jog(150)}${jog(750)}
    </svg>`;
  }

  /* ===================== TIKTOK ===================== */
  async function renderSocial() {
    const handle = C.contact.tiktok, ig = C.contact.instagram;
    if (isPh(handle)) return hideSection("social");
    let data = null;
    try {
      const r = await fetch(`${C.social.tiktokData}?v=${Math.floor(Date.now() / 6e5)}`, { cache: "no-cache" });
      if (r.ok) data = await r.json();
    } catch (e) { /* sin datos: se usa el widget oficial */ }
    const p = data?.profile || {}, igD = data?.instagram || {};
    const igNum = (key, cfg) => +C.social?.[cfg] || +igD[key] || 0;
    const igFollowers = igNum("followers", "instagramFollowers"), igLikes = igNum("likes", "instagramLikes"), igViews = igNum("views", "instagramViews");
    const followers = (+p.followers || 0) + igFollowers, likes = (+p.likes || 0) + igLikes, views = (+data?.totals?.views || 0) + igViews;
    const stats = [[followers, T(igFollowers ? "social.followersBoth" : "social.followers")], [likes, T("social.likes")], [views, T("social.views")]].filter(([v]) => v > 0);
    if (stats.length) {
      $("#socialStats").innerHTML = stats.map(([v, l]) => `<div><dt>${esc(l)}</dt><dd data-num="${v}">${num(v)}</dd></div>`).join("");
      const note = igLikes && igViews ? "social.noteBoth" : igLikes ? "social.noteViewsTT" : igViews ? "social.noteLikesTT" : "social.noteTT";
      if (igFollowers) $("#socialStats").insertAdjacentHTML("afterend", `<p class="social-note">${T(note)}</p>`);
    } else $("#socialStats").remove();
    $("#socialActions").innerHTML =
      `<a class="btn btn-primary" href="https://www.tiktok.com/@${esc(handle)}" target="_blank" rel="noopener">${svg("tiktok")}${T("social.follow")}</a>` +
      (isPh(ig) ? "" : `<a class="btn btn-ghost" href="https://www.instagram.com/${esc(ig)}/" target="_blank" rel="noopener">${svg("instagram")}@${esc(ig)}</a>`);
    if (data?.updated) {
      const d = new Date(data.updated).toLocaleDateString(lang === "es" ? "es-ES" : "en-GB", { day: "numeric", month: "long" });
      $(".social-info").insertAdjacentHTML("beforeend", `<p class="social-updated">${T("social.updated")}: ${esc(d)}</p>`);
    }
    const vids = (data?.latest || []).filter((v) => v.id && v.cover).slice(0, 3);
    if (!vids.length) {
      $("#phones").innerHTML = `<div class="tiktok-fallback"><blockquote class="tiktok-embed" cite="https://www.tiktok.com/@${esc(handle)}" data-unique-id="${esc(handle)}" data-embed-type="creator" style="max-width:780px;min-width:288px"><section><a target="_blank" rel="noopener" href="https://www.tiktok.com/@${esc(handle)}">@${esc(handle)}</a></section></blockquote></div>`;
      const s = document.createElement("script"); s.async = true; s.src = "https://www.tiktok.com/embed.js"; document.body.appendChild(s);
      return;
    }
    const rtf = new Intl.RelativeTimeFormat(lang === "es" ? "es" : "en", { numeric: "auto" });
    const ago = (ts) => {
      const days = Math.round((ts * 1000 - Date.now()) / 864e5);
      return Math.abs(days) < 1 ? rtf.format(Math.round((ts * 1000 - Date.now()) / 36e5), "hour") : Math.abs(days) < 30 ? rtf.format(days, "day") : rtf.format(Math.round(days / 30), "month");
    };
    const clock = new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
    $("#phones").innerHTML = vids.map((v) => `<figure class="phone" data-id="${esc(v.id)}">
        <div class="phone-body"><div class="phone-screen">
          <span class="phone-island"></span>
          <div class="phone-status"><span>${clock}</span><svg viewBox="0 0 34 12" aria-hidden="true"><rect x="0" y="7" width="3" height="5" rx="1"/><rect x="5" y="5" width="3" height="7" rx="1"/><rect x="10" y="3" width="3" height="9" rx="1"/><rect x="15" y="1" width="3" height="11" rx="1"/><rect x="22" y="1" width="10" height="10" rx="2.5" fill="none" stroke="#fff" stroke-width="1.2"/><rect x="23.6" y="2.6" width="6.4" height="6.8" rx="1.4"/></svg></div>
          <img class="phone-cover" src="${esc(v.cover)}" alt="" loading="lazy" decoding="async">
          <div class="phone-rail">${[["heart", v.likes], ["comment", v.comments], ["eye", v.views]].filter(([, n]) => n != null).map(([i, n]) => `<span>${svg(i)}${num(+n)}</span>`).join("")}</div>
          <div class="phone-ui"><b>@${esc(handle)}</b><p>${esc((v.description || "").replace(/\s+/g, " ").trim())}</p></div>
          <button class="phone-play" type="button" aria-label="${T("social.play")}">${svg("play")}</button>
        </div></div>
        <figcaption class="phone-meta">${v.timestamp ? esc(ago(v.timestamp)) + " · " : ""}<a href="${esc(v.url)}" target="_blank" rel="noopener">${T("social.open")}</a></figcaption>
      </figure>`).join("");
    $$("#phones .phone").forEach((ph) => ph.addEventListener("click", (e) => {
      if (e.target.closest("a") || ph.classList.contains("playing")) return;
      ph.classList.add("playing");
      const src = `https://www.tiktok.com/player/v1/${ph.dataset.id}?autoplay=1&loop=1&controls=1&progress_bar=1&play_button=1&volume_control=1&fullscreen_button=1&timestamp=0&music_info=0&description=0&rel=0&native_context_menu=0&closed_caption=0`;
      $(".phone-screen", ph).insertAdjacentHTML("beforeend", `<iframe src="${src}" title="TikTok" allow="autoplay; fullscreen; encrypted-media; picture-in-picture" allowfullscreen></iframe>`);
      if (window.Sound?.on) $("#soundBtn").click();
    }));
  }

  /* ===================== RESERVA ===================== */
  function setupForm() {
    const k = C.contact, form = $("#bookingForm"), err = $("#formError");
    const wa = !isPh(k.whatsapp), mail = !isPh(k.bookingEmail);
    if (!wa && !mail) return form.remove();
    const opts = (keys) => `<option value="">${T("form.pick")}</option>` + keys.map((x) => `<option value="${x}">${T(x)}</option>`).join("");
    $("#typeSelect").innerHTML = opts(["type.boda", "type.cumple", "type.grad", "type.fiesta", "type.otro"]);
    $("#soundSelect").innerHTML = opts(["snd.yes", "snd.no", "snd.unk"]);
    $("#formActions").innerHTML =
      (wa ? `<button type="submit" class="btn btn-primary" data-via="wa">${svg("whatsapp")}${T("form.wa")}</button>` : "") +
      (mail ? `<button type="submit" class="btn btn-ghost" data-via="mail">${svg("mail")}${T("form.mail")}</button>` : "");
    let via = wa ? "wa" : "mail";
    $$("#formActions button").forEach((b) => b.addEventListener("click", () => (via = b.dataset.via)));
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const f = Object.fromEntries(new FormData(form));
      if (!f.nombre.trim()) { err.textContent = T("form.error"); return; }
      err.textContent = "";
      const date = f.fecha ? new Date(f.fecha + "T12:00").toLocaleDateString(lang === "es" ? "es-ES" : "en-GB", { day: "numeric", month: "long", year: "numeric" }) : "";
      const lines = [T("msg.hello").replace("{name}", C.artist.name), "", `${T("msg.name")}: ${f.nombre.trim()}`];
      if (f.tipo) lines.push(`${T("msg.type")}: ${T(f.tipo)}`);
      if (date) lines.push(`${T("msg.date")}: ${date}`);
      if (f.lugar.trim()) lines.push(`${T("msg.place")}: ${f.lugar.trim()}`);
      if (f.invitados.trim()) lines.push(`${T("msg.guests")}: ${f.invitados.trim()}`);
      if (f.sonido) lines.push(`${T("msg.sound")}: ${T(f.sonido)}`);
      if (f.mensaje.trim()) lines.push("", f.mensaje.trim());
      const text = lines.join("\n");
      const subject = `${f.tipo ? T(f.tipo) : "Evento"} – ${C.artist.name}${date ? " – " + date : ""}`;
      const url = via === "wa" ? `https://wa.me/${k.whatsapp}?text=${encodeURIComponent(text)}`
        : `mailto:${k.bookingEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
      window.open(url, via === "wa" ? "_blank" : "_self");
    });
  }

  /* ===================== EL DISCO (giro, scratch con el scroll, brillo con el ratón) ===================== */
  const spin = { angle: Math.random() * 360, speed: 0, base: 200, boost: 0 }; // 33⅓ rpm = 200 °/s
  let scrollVel = 0;
  function setupRecord() {
    const sheen = $(".record-sheen");
    if (!touch) addEventListener("pointermove", (e) => sheen.style.setProperty("--sheen", `${(e.clientX / innerWidth - 0.5) * 40}deg`), { passive: true });
    if (ST) ST.create({ start: 0, end: "max", onUpdate: (self) => (scrollVel = self.getVelocity()) });
  }

  /* ===================== POLVO EN LA LUZ ===================== */
  function setupDust() {
    const cv = $("#heroDust"), ctx = cv.getContext("2d");
    if (!ctx || reduce) return () => {};
    const dpr = Math.min(devicePixelRatio || 1, 1.5), N = touch ? 28 : 64;
    let W = 0, H = 0, P = [];
    const size = () => {
      W = cv.clientWidth; H = cv.clientHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      P = Array.from({ length: N }, () => ({ x: Math.random() * W, y: Math.random() * H, r: 0.6 + Math.random() * 1.8, v: 6 + Math.random() * 16, ph: Math.random() * 6.3, s: 0.4 + Math.random() }));
    };
    size(); addEventListener("resize", size);
    let last = 0;
    return (t) => {
      const dt = Math.min(0.05, (t - last) / 1000 || 0.016); last = t;
      ctx.clearRect(0, 0, W, H);
      const lx = W * (W > 900 ? 0.7 : 0.5), ly = H * 0.3, R = Math.max(W, H) * 0.55;
      for (const p of P) {
        p.y -= p.v * dt; p.x += Math.sin(t / 1000 * p.s + p.ph) * 8 * dt;
        if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
        const d = Math.hypot(p.x - lx, p.y - ly) / R, a = Math.max(0, 1 - d) * (0.35 + 0.35 * Math.sin(t / 700 * p.s + p.ph));
        if (a <= 0.01) continue;
        ctx.fillStyle = `rgba(255,${150 + Math.round(p.s * 40)},${90 + Math.round(p.s * 30)},${a.toFixed(3)})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill();
      }
    };
  }

  /* ===================== INTRO: arranca el disco, baja la aguja, suena ===================== */
  function playIntro(onReveal) {
    const intro = $("#intro"), rec = $("#record");
    const skip = !animated || slowNet || sess.get("bota-intro") === "1";
    if (skip) { intro.remove(); spin.speed = spin.base; onReveal(false); return; }
    const r = rec.getBoundingClientRect();
    const size = Math.min(innerWidth * 0.78, innerHeight * 0.6);
    const s = size / r.width, dx = innerWidth / 2 - (r.left + r.width / 2), dy = innerHeight / 2 - (r.top + r.height / 2);
    rec.style.zIndex = 201;
    G.set(rec, { x: dx, y: dy, scale: s });
    // Brazo: pivote arriba a la derecha del disco
    const arm = $("#tonearm"), cx = innerWidth / 2, cy = innerHeight / 2;
    const aw = size * 0.5, ah = aw * 2.1;
    Object.assign(arm.style, { width: aw + "px", height: ah + "px", left: cx + size * 0.5 - aw * 0.75 + size * 0.06 + "px", top: cy - size * 0.5 - ah * 0.095 - size * 0.04 + "px" });
    G.set(arm, { rotation: -24, transformOrigin: "75% 9.5%" });
    const waves = $$("#introWaves i");
    waves.forEach((w) => Object.assign(w.style, { width: size + "px", height: size + "px", left: cx - size / 2 + "px", top: cy - size / 2 + "px" }));
    const tl = G.timeline({ onComplete: () => { rec.style.zIndex = ""; G.set(rec, { clearProps: "x,y,scale" }); intro.remove(); sess.set("bota-intro", "1"); } });
    if (touch) tl.timeScale(1.2);
    tl.fromTo(rec, { opacity: 0 }, { opacity: 1, duration: 0.4 }, 0)
      .to(spin, { speed: spin.base * 1.35, duration: 1.1, ease: "power2.in" }, 0)
      .to(arm, { rotation: 0, duration: 0.8, ease: "power3.inOut" }, 0.25)
      .addLabel("drop", 1.05)
      .fromTo(waves, { scale: 1, opacity: 0.85 }, { scale: 2.6, opacity: 0, duration: 1.3, ease: "power2.out", stagger: 0.16 }, "drop")
      .to(rec, { scale: s * 1.04, duration: 0.08, yoyo: true, repeat: 1, ease: "power1.inOut" }, "drop")
      .to(arm, { opacity: 0, duration: 0.35 }, "drop+=0.35")
      .to(intro, { backgroundColor: "rgba(8,6,5,0)", duration: 0.9, ease: "power2.out" }, "drop+=0.3")
      .to(rec, { x: 0, y: 0, scale: 1, duration: 1.15, ease: "expo.inOut" }, "drop+=0.3")
      .to(spin, { speed: spin.base, duration: 1.2, ease: "power2.out" }, "drop+=0.3")
      .add(() => onReveal(true), "drop+=0.55");
  }

  function revealHero(fromIntro) {
    document.body.classList.remove("is-loading");
    if (!animated) return;
    G.timeline({ delay: fromIntro ? 0 : 0.1 })
      .fromTo("#heroPhoto", { opacity: 0, scale: 1.06 }, { opacity: 1, scale: 1, duration: 1.8, ease: "power2.out", clearProps: "scale" }, 0)
      .from("#heroCopy > *", { y: 34, opacity: 0, duration: 1, ease: "expo.out", stagger: 0.09 }, 0.25)
      .from("#nav > *", { y: -24, opacity: 0, duration: 0.8, ease: "expo.out", stagger: 0.05, clearProps: "transform,opacity" }, 0.5);
    if (!fromIntro) G.from("#record", { opacity: 0, rotation: -40, duration: 1.4, ease: "expo.out", clearProps: "rotation" });
  }

  /* ===================== SCROLL ===================== */
  function setupScroll() {
    const nav = $("#nav");
    let lastY = 0;
    addEventListener("scroll", () => {
      const y = scrollY;
      nav.classList.toggle("scrolled", y > 40);
      nav.classList.toggle("hide", y > innerHeight * 0.9 && y > lastY && !nav.classList.contains("open"));
      lastY = y;
    }, { passive: true });
    if (!animated) return;

    // Portada: el disco y la foto se separan al bajar
    const hs = { trigger: "#hero", start: "top top", end: "bottom top", scrub: true };
    G.to("#heroPhoto", { yPercent: 12, ease: "none", scrollTrigger: hs });
    G.to("#record", { yPercent: 22, ease: "none", scrollTrigger: hs }); // yPercent: no choca con el x/y de la intro
    G.to("#heroCopy", { y: -60, opacity: 0.2, ease: "none", scrollTrigger: { ...hs, end: "70% top" } });

    // Títulos: un crossfader naranja barre y deja el texto
    $$(".h2").forEach((h) => {
      const wipe = $(".wipe", h), txt = $("span", h);
      const tl = G.timeline({ scrollTrigger: { trigger: h, start: "top 85%" } });
      tl.set(txt, { opacity: 0 })
        .fromTo(wipe, { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, duration: 0.45, ease: "power3.in" })
        .set(txt, { opacity: 1 })
        .set(wipe, { transformOrigin: "right center" })
        .to(wipe, { scaleX: 0, duration: 0.55, ease: "power3.out" });
    });

    // 30 años: el número se llena de naranja y cuenta mientras bajas
    const yn = $("#yearsNum");
    if (yn) {
      const o = { v: 0 }, target = +C.years || 0;
      G.timeline({ scrollTrigger: { trigger: "#years", start: "top 80%", end: "center 55%", scrub: 0.6 } })
        .fromTo(yn, { "--fill": "0%" }, { "--fill": "100%", ease: "none" }, 0)
        .fromTo(o, { v: 0 }, { v: target, ease: "power1.out", onUpdate: () => (yn.textContent = Math.round(o.v)) }, 0);
      G.from(".years-copy > *", { y: 30, opacity: 0, duration: 1, ease: "expo.out", stagger: 0.1, scrollTrigger: { trigger: "#years", start: "top 70%" } });
    }

    // Eventos: los faders suben al entrar
    $$(".fader-cap").forEach((cap, i) => G.fromTo(cap, { bottom: "0%" }, { bottom: `${48 + ((i * 17) % 34)}%`, duration: 1.2, ease: "power3.out", delay: i * 0.08, scrollTrigger: { trigger: "#mixer", start: "top 80%" } }));
    G.from(".channel", { y: 40, opacity: 0, duration: 1, ease: "expo.out", stagger: 0.08, scrollTrigger: { trigger: "#mixer", start: "top 85%" } });

    // Fotos y "Sobre mí"
    if ($("#aboutPhoto img")) G.fromTo("#aboutPhoto img", { yPercent: -6 }, { yPercent: 2, ease: "none", scrollTrigger: { trigger: "#aboutPhoto", scrub: true } });
    G.from(".shot", { y: 60, opacity: 0, duration: 1.1, ease: "expo.out", stagger: 0.1, scrollTrigger: { trigger: "#gallery", start: "top 85%" } });
    if ($$("#phones .phone").length === 3 && !touch) G.from("#phones .phone", { y: 120, opacity: 0, rotationX: 24, duration: 1.3, ease: "expo.out", stagger: 0.12, scrollTrigger: { trigger: "#phones", start: "top 80%" } });
    G.from(".rider-item", { x: 30, opacity: 0, duration: 0.9, ease: "expo.out", stagger: 0.1, scrollTrigger: { trigger: "#riderList", start: "top 85%" } });
    G.from("#prime", { y: 40, opacity: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: "#prime", start: "top 85%" } });

    // Cifras de TikTok que cuentan
    $$("[data-num]").forEach((el) => {
      const target = +el.dataset.num, o = { v: 0 };
      el.textContent = num(0);
      ST.create({ trigger: el, start: "top 90%", once: true, onEnter: () => G.to(o, { v: target, duration: 2, ease: "power3.out", onUpdate: () => (el.textContent = num(Math.round(o.v))) }) });
    });
    if ($("#footerLogo img")) G.from("#footerLogo img", { y: 40, opacity: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: ".footer", start: "top 85%" } });
    addEventListener("load", () => ST.refresh());
    document.fonts?.ready.then(() => ST.refresh());
  }

  function setupLinks() {
    const nav = $("#nav"), toggle = $("#navToggle");
    const close = () => { nav.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); document.body.classList.remove("menu-open"); };
    toggle.addEventListener("click", () => { const o = nav.classList.toggle("open"); toggle.setAttribute("aria-expanded", o); document.body.classList.toggle("menu-open", o); });
    document.addEventListener("click", (e) => { if (e.target.closest("#navLinks a")) close(); });
    $("#langBtn").addEventListener("click", () => {
      const next = lang === "es" ? "en" : "es";
      store.set("bota-lang", next);
      const u = new URL(location.href); u.searchParams.set("lang", next); location.href = u.toString();
    });
  }

  /* ===================== SONIDO ===================== */
  function setupSound() {
    const btn = $("#soundBtn"), label = $("#soundLabel");
    if (!window.Sound) return btn.remove();
    const set = (on) => { document.body.classList.toggle("playing", on); btn.setAttribute("aria-pressed", on); label.textContent = T(on ? "sound.pause" : "sound.play"); };
    btn.addEventListener("click", () => { if (Sound.on) { Sound.stop(); set(false); } else { Sound.start(); set(true); } });
    document.addEventListener("visibilitychange", () => { if (document.hidden && Sound.on) { Sound.stop(); set(false); } });
  }

  /* ===================== VISOR DE FOTOS ===================== */
  function setupLightbox() {
    const lb = $("#lightbox"), img = $("img", lb), dl = $(".lb-download", lb), count = $(".lb-count", lb);
    let idx = 0, sx = null;
    const show = (i) => { idx = (i + galleryList.length) % galleryList.length; img.src = dl.href = galleryList[idx]; count.textContent = `${idx + 1}/${galleryList.length}`; };
    const open = (i) => { show(i); lb.classList.add("open"); lb.setAttribute("aria-hidden", "false"); document.body.classList.add("lb-open"); $(".lb-close", lb).focus(); };
    const close = () => { lb.classList.remove("open"); lb.setAttribute("aria-hidden", "true"); document.body.classList.remove("lb-open"); };
    $("#gallery")?.addEventListener("click", (e) => {
      const s = e.target.closest(".shot");
      if (!s || e.target.closest("a")) return;
      open(Math.max(0, galleryList.indexOf($("img", s).getAttribute("src"))));
    });
    $(".lb-prev", lb).onclick = () => show(idx - 1);
    $(".lb-next", lb).onclick = () => show(idx + 1);
    $(".lb-close", lb).onclick = close;
    lb.addEventListener("click", (e) => { if (e.target === lb) close(); });
    addEventListener("keydown", (e) => {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(idx - 1);
      if (e.key === "ArrowRight") show(idx + 1);
    });
    lb.addEventListener("touchstart", (e) => (sx = e.touches[0].clientX), { passive: true });
    lb.addEventListener("touchend", (e) => { if (sx == null) return; const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1)); sx = null; });
  }

  /* ===================== MÓVIL ===================== */
  function setupDock() {
    const dock = $("#dock"), hero = $("#hero"), booking = $("#booking");
    let heroIn = true, bookIn = false;
    const upd = () => dock.classList.toggle("cta-off", heroIn || bookIn);
    new IntersectionObserver(([e]) => { heroIn = e.intersectionRatio > 0.5; upd(); }, { threshold: [0, 0.5, 1] }).observe(hero);
    if (!booking.hidden) new IntersectionObserver(([e]) => { bookIn = e.isIntersecting; upd(); }, { rootMargin: "0px 0px -30% 0px" }).observe(booking);
    upd();
    $$(".swipe-hint").forEach((hint) => {
      const sc = hint.previousElementSibling, done = () => hint.classList.add("used");
      sc?.addEventListener("scroll", done, { passive: true, once: true });
      sc?.addEventListener("touchstart", done, { passive: true, once: true });
    });
  }

  /* ===================== BUCLE: disco, vúmetros, Prime 4+ y polvo ===================== */
  function startLoop(dust) {
    const spinEl = $("#recordSpin"), hero = $("#hero");
    const vus = $$(".vu"), lv = vus.map(() => 0.1);
    const jogs = $$("#prime .jog"), wave = $("#primeWave"), wave2 = $("#primeWave2"), pads = $$("#prime .pad");
    const vis = { hero: true, events: false, prime: false };
    const watch = (el, k) => el && new IntersectionObserver(([e]) => (vis[k] = e.isIntersecting)).observe(el);
    watch(hero, "hero"); watch($("#mixer"), "events"); watch($("#prime"), "prime");
    let last = performance.now(), lastK = -1, acc = 0, wx = 0;
    const frame = () => {
      const now = performance.now(), dt = Math.min(0.05, (now - last) / 1000); last = now;
      const playing = !!window.Sound?.on, k = playing ? Sound.kickLevel() : 0;
      if (Math.abs(k - lastK) > 0.004) { hero.style.setProperty("--kick", k.toFixed(3)); lastK = k; }
      // Disco: 33⅓ rpm (45 con música); el scroll lo empuja o lo frena como un scratch
      const target = (playing ? 270 : spin.base) * (spin.speed > 0 ? spin.speed / spin.base : 0) + Math.max(-900, Math.min(900, scrollVel * 0.35));
      spin.boost += (target - spin.boost) * Math.min(1, dt * 6);
      spin.angle = (spin.angle + spin.boost * dt) % 360;
      if (vis.hero && !reduce) { spinEl.style.transform = `rotate(${spin.angle.toFixed(2)}deg)`; dust(now); }
      scrollVel *= 0.9;
      acc += dt;
      if (acc < (touch ? 1 / 30 : 1 / 60)) return;
      acc = 0;
      if (vis.events) vus.forEach((v, i) => {
        const t = now / 1000;
        const tg = playing ? Math.min(1, 0.25 + k * 0.7 + Math.random() * 0.25) : 0.12 + 0.07 * Math.sin(t * 1.6 + i * 1.3) + 0.05 * Math.sin(t * 4.1 + i);
        lv[i] += (tg - lv[i]) * (tg > lv[i] ? 0.6 : 0.18);
        v.style.setProperty("--lvl", lv[i].toFixed(3));
      });
      if (vis.prime && !reduce) {
        jogs.forEach((j) => j.setAttribute("transform", `rotate(${spin.angle.toFixed(1)} ${j.dataset.cx} 285)`));
        wx = (wx + dt * (playing ? 90 : 40)) % 300;
        wave?.setAttribute("transform", `translate(${(304 - wx).toFixed(1)} 92)`);
        wave2?.setAttribute("transform", `translate(${(304 - wx * 0.7).toFixed(1)} 152)`);
        const beat = Math.floor(now / (60000 / (C.artist.bpm || 124))) % 8;
        pads.forEach((p, i) => p.classList.toggle("on", (i % 8) === beat && (playing || i < 8)));
      }
    };
    if (G) G.ticker.add(frame); else { const raf = () => { frame(); requestAnimationFrame(raf); }; requestAnimationFrame(raf); }
  }

  /* ===================== ARRANQUE ===================== */
  async function init() {
    await render();
    setupRecord();
    const dust = setupDust();
    setupScroll();
    setupLinks();
    setupSound();
    setupLightbox();
    setupDock();
    startLoop(dust);
    playIntro(revealHero);
  }
  init().catch((e) => { console.error(e); $("#intro")?.remove(); document.body.classList.remove("is-loading"); });
})();
