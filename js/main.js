(() => {
  window.__introDone = true; // main.js cargó: la red de seguridad del <head> ya no hace falta
  const C = window.PRESSKIT;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const isPh = (v) => v == null || String(v).trim() === "" || /^\s*\[.*\]\s*$/.test(String(v));
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(pointer: fine)").matches;
  const touch = matchMedia("(pointer: coarse)").matches;
  const conn = navigator.connection || {};
  const slowNet = !!conn.saveData || /(^|-)2g$|^3g$/.test(conn.effectiveType || "");
  const G = window.gsap, ST = window.ScrollTrigger;
  const animated = !!(G && ST) && !reduce;
  const root = document.documentElement;
  const safe = (fn, fb) => { try { return fn(); } catch (e) { return fb; } };
  const store = { get: (k) => safe(() => localStorage.getItem(k), null), set: (k, v) => safe(() => localStorage.setItem(k, v)) };
  const sess = { get: (k) => safe(() => sessionStorage.getItem(k), null), set: (k, v) => safe(() => sessionStorage.setItem(k, v)) };
  const yieldTask = () => new Promise((r) => setTimeout(r, 0)); // trocea el trabajo en tareas cortas
  if (G && ST) {
    G.registerPlugin(ST);
    ST.config({ ignoreMobileResize: true });
    root.classList.add("gsap");
    G.set("#heroLogo", { xPercent: -50, yPercent: -50 });
    G.set(["#heroPerson", "#heroNeon"], { xPercent: -50 });
  }

  /* ===================== IDIOMA ===================== */
  const urlLang = new URLSearchParams(location.search).get("lang");
  let lang = urlLang || store.get("pk-lang") || ((navigator.language || "es").toLowerCase().startsWith("es") ? "es" : "en");
  if (!["es", "en"].includes(lang)) lang = "es";
  root.lang = lang;
  const tr = (v) => (v && typeof v === "object" && !Array.isArray(v) ? v[lang] ?? v.es : v);
  const I18N = {
    es: {
      "nav.about": "Sobre mí", "nav.photos": "Fotos", "nav.social": "Redes", "nav.music": "Música", "nav.venues": "Salas", "nav.rider": "Rider", "nav.booking": "Booking",
      "hero.book": "Contratar", "hero.photos": "Ver fotos", "hero.listen": "Escuchar",
      "about.title": "Sobre mí",
      "photos.title": "Fotos de prensa", "photos.sub": "Sin fondo, listas para carteles y flyers. Toca una foto para ampliarla.",
      "photos.download": "Descargar", "photos.dlTitle": "Material para promotores",
      "photos.dlText": "Logos y fotos en alta calidad con fondo transparente, y la ficha en PDF.",
      "social.title": "En redes", "social.sub": "Mis tres últimos vídeos de TikTok. Se actualizan solos cada vez que subo uno nuevo.",
      "social.followers": "seguidores", "social.followersBoth": "seguidores en TikTok e Instagram", "social.likes": "me gusta", "social.views": "visualizaciones",
      "social.noteTT": "Me gusta y visualizaciones de TikTok.", "social.noteBoth": "Sumando TikTok e Instagram.",
      "social.follow": "Seguir en TikTok", "social.ig": "Instagram", "social.open": "Abrir en TikTok", "social.play": "Reproducir vídeo",
      "social.updated": "Actualizado", "social.sound": "sonido original",
      "music.title": "Música", "venues.title": "Ha pinchado en", "venues.resident": "Residente", "rider.title": "Rider técnico",
      "booking.title": "Reserva una fecha",
      "booking.text": "Cuéntame tu evento y te respondo lo antes posible. El mensaje sale ya redactado por WhatsApp o por email.",
      "form.name": "Nombre", "form.event": "Sala o evento", "form.city": "Ciudad", "form.date": "Fecha",
      "form.message": "Mensaje: horario, aforo, tipo de evento", "form.wa": "Enviar por WhatsApp", "form.mail": "Enviar por email",
      "form.error": "Escribe al menos tu nombre y la sala o evento.",
      "msg.hello": "Hola {name}, quiero contratarte.", "msg.name": "Nombre", "msg.event": "Sala / evento", "msg.city": "Ciudad", "msg.date": "Fecha",
      "contact.phone": "Teléfono", "contact.whatsapp": "WhatsApp", "contact.waValue": "Escríbeme", "contact.mail": "Email",
      "contact.listen": "Escuchar", "contact.watch": "Ver vídeos",
      "footer.rights": "Todos los derechos reservados.", "footer.top": "Volver arriba",
      "sound.play": "Play", "sound.pause": "Pausa", "cursor.view": "Ver", "cursor.play": "Play", "lang.label": "View in English", "ui.swipe": "Desliza",
    },
    en: {
      "nav.about": "About", "nav.photos": "Photos", "nav.social": "Social", "nav.music": "Music", "nav.venues": "Venues", "nav.rider": "Rider", "nav.booking": "Booking",
      "hero.book": "Book CLEMENT", "hero.photos": "See photos", "hero.listen": "Listen",
      "about.title": "About me",
      "photos.title": "Press photos", "photos.sub": "Background-free, ready for posters and flyers. Tap a photo to view it.",
      "photos.download": "Download", "photos.dlTitle": "Promoter assets",
      "photos.dlText": "High-res logos and photos with transparent backgrounds, plus the PDF one-sheet.",
      "social.title": "On social", "social.sub": "My three latest TikTok videos. They update by themselves every time I post a new one.",
      "social.followers": "followers", "social.followersBoth": "followers on TikTok and Instagram", "social.likes": "likes", "social.views": "views",
      "social.noteTT": "Likes and views from TikTok.", "social.noteBoth": "TikTok and Instagram combined.",
      "social.follow": "Follow on TikTok", "social.ig": "Instagram", "social.open": "Open in TikTok", "social.play": "Play video",
      "social.updated": "Updated", "social.sound": "original sound",
      "music.title": "Music", "venues.title": "Has played at", "venues.resident": "Resident", "rider.title": "Technical rider",
      "booking.title": "Book a date",
      "booking.text": "Tell me about your event and I'll get back to you soon. Your message goes out ready-written via WhatsApp or email.",
      "form.name": "Name", "form.event": "Venue or event", "form.city": "City", "form.date": "Date",
      "form.message": "Message: set time, capacity, type of event", "form.wa": "Send via WhatsApp", "form.mail": "Send via email",
      "form.error": "Add at least your name and the venue or event.",
      "msg.hello": "Hi {name}, I'd like to book you.", "msg.name": "Name", "msg.event": "Venue / event", "msg.city": "City", "msg.date": "Date",
      "contact.phone": "Phone", "contact.whatsapp": "WhatsApp", "contact.waValue": "Message me", "contact.mail": "Email",
      "contact.listen": "Listen", "contact.watch": "Watch videos",
      "footer.rights": "All rights reserved.", "footer.top": "Back to top",
      "sound.play": "Play", "sound.pause": "Pause", "cursor.view": "View", "cursor.play": "Play", "lang.label": "Ver en español", "ui.swipe": "Swipe",
    },
  };
  const T = (k) => I18N[lang][k] ?? I18N.es[k] ?? k;
  if (lang === "en") $('meta[name="description"]').content = "Official press kit of CLEMENT, resident DJ at La Club and Sala Systema (Ciudad Real, Spain). Reggaeton, dembow and trap. 6+ years, 200+ sets. Photos, logos, technical rider and booking.";
  // < 10.000: número exacto con su punto (3.002); a partir de ahí, compacto (177,2 mil)
  const num = (n) => n < 10000
    ? String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, lang === "es" ? "." : ",")
    : new Intl.NumberFormat(lang === "es" ? "es-ES" : "en-GB", { notation: "compact", maximumFractionDigits: 1 }).format(n);

  const probe = (src) => new Promise((res) => {
    if (!src) return res(null);
    const i = new Image();
    i.onload = () => res(i); i.onerror = () => res(null);
    i.src = src;
  });
  const hideSection = (id) => { const s = document.getElementById(id); if (s) s.hidden = true; };

  /* ===================== ICONOS ===================== */
  const ICONS = {
    phone: '<path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z"/>',
    mail: '<path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4-8 5-8-5V6l8 5 8-5z"/>',
    whatsapp: '<path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-3.3-.8a11 11 0 0 1-4.3-3.8c-.3-.5-1-1.5-1-2.8s.7-2 .9-2.3c.3-.3.6-.3.8-.3h.6c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.3 0 .5l-.3.5-.4.4c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.2.5.1.6 0l.9-1c.2-.3.4-.2.7-.1l2 1c.3.1.5.2.5.3.1.1.1.6-.1 1.2z"/>',
    instagram: '<path d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4zM17.3 5.5a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4zM21.9 7.1c-.1-1.6-.4-3-1.6-4.2S17.7 1.3 16.1 1.2C14.4 1.1 9.6 1.1 7.9 1.2 6.3 1.3 4.9 1.6 3.7 2.8S2.1 5.5 2 7.1C1.9 8.8 1.9 15.2 2 16.9c.1 1.6.4 3 1.6 4.2s2.6 1.5 4.2 1.6c1.7.1 6.5.1 8.2 0 1.6-.1 3-.4 4.2-1.6s1.5-2.6 1.6-4.2c.1-1.7.1-8.1.1-9.8zm-2.2 11.6a3.3 3.3 0 0 1-1.9 1.9c-1.3.5-4.4.4-5.8.4s-4.5.1-5.8-.4a3.3 3.3 0 0 1-1.9-1.9c-.5-1.3-.4-4.4-.4-5.8s-.1-4.5.4-5.8A3.3 3.3 0 0 1 6.2 3.2c1.3-.5 4.4-.4 5.8-.4s4.5-.1 5.8.4a3.3 3.3 0 0 1 1.9 1.9c.5 1.3.4 4.4.4 5.8s.1 4.5-.4 5.8z"/>',
    tiktok: '<path d="M16.6 2h-3.3v13.4a2.9 2.9 0 1 1-2-2.8V9.2a6.2 6.2 0 1 0 5.3 6.2V8.6a7.6 7.6 0 0 0 4.4 1.4V6.7a4.4 4.4 0 0 1-4.4-4.4z"/>',
    soundcloud: '<path d="M1 14.5c0 1 .5 1.7 1 1.7s1-.7 1-1.7-.5-1.7-1-1.7-1 .7-1 1.7zm3-2.5v5h1v-5zm2-1.5v6.5h1v-6.5zm2-1v7.5h1V9.5zm2-1.5v9h1V8zm2.5-1.5V17h7a3.5 3.5 0 0 0 0-7 3.4 3.4 0 0 0-1.3.3A5.5 5.5 0 0 0 12.5 6.5z"/>',
    spotify: '<path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm4.6 14.4a.6.6 0 0 1-.9.2c-2.4-1.4-5.3-1.8-8.8-1a.6.6 0 1 1-.3-1.2c3.8-.9 7.1-.5 9.8 1.1.3.2.4.6.2.9zm1.2-2.7a.8.8 0 0 1-1.1.3c-2.7-1.7-6.9-2.2-10.1-1.2a.8.8 0 1 1-.5-1.5c3.7-1.1 8.3-.6 11.4 1.3.4.2.5.7.3 1.1zm.1-2.8C14.7 9 9.4 8.8 6.3 9.7a1 1 0 1 1-.6-1.8c3.5-1.1 9.4-.9 13.1 1.3a1 1 0 0 1-.9 1.7z"/>',
    youtube: '<path d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12 31 31 0 0 0 1 16.8a3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.8 31 31 0 0 0-.5-4.8zM9.7 15V9l5.8 3z"/>',
    heart: '<path d="M12 21s-7.5-4.6-9.6-9.2C.8 8.2 3 4.5 6.6 4.5c2.1 0 3.5 1.2 4.4 2.6.9-1.4 2.3-2.6 4.4-2.6 3.6 0 5.8 3.7 4.2 7.3C19.5 16.4 12 21 12 21z"/>',
    comment: '<path d="M12 3C6.5 3 2 6.8 2 11.5c0 2.6 1.4 4.9 3.6 6.5L5 22l4.3-2.3c.9.2 1.8.3 2.7.3 5.5 0 10-3.8 10-8.5S17.5 3 12 3z"/>',
    eye: '<path d="M12 5C6.5 5 2.3 8.6 1 12c1.3 3.4 5.5 7 11 7s9.7-3.6 11-7c-1.3-3.4-5.5-7-11-7zm0 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"/>',
    play: '<path d="M7 4.5v15l13-7.5z"/>',
    pin: '<path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/>',
  };
  const svg = (k) => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[k]}</svg>`;
  // Iconos de línea para el rider (64×64)
  const GEAR = {
    deck: '<rect x="3" y="15" width="58" height="34" rx="3"/><circle cx="16" cy="35" r="8.5"/><circle cx="16" cy="35" r="2"/><circle cx="48" cy="35" r="8.5"/><circle cx="48" cy="35" r="2"/><rect x="26" y="19" width="12" height="9" rx="1"/><path d="M29 33v11M35 33v11M7 20h6M51 20h6"/>',
    swap: '<rect x="5" y="9" width="22" height="14" rx="2"/><rect x="37" y="41" width="22" height="14" rx="2"/><circle cx="12" cy="16" r="3"/><circle cx="52" cy="48" r="3"/><path d="M34 16h18l-6-6M52 16l-6 6M30 48H12l6 6M12 48l6-6"/>',
    monitor: '<rect x="15" y="4" width="34" height="56" rx="3"/><circle cx="32" cy="39" r="11"/><circle cx="32" cy="39" r="4"/><circle cx="32" cy="17" r="5"/><circle cx="32" cy="17" r="1.5"/>',
    case: '<rect x="5" y="19" width="54" height="35" rx="3"/><path d="M23 19v-6h18v6M5 31h54M13 31v6M51 31v6"/><path d="M5 25h6v-6M59 25h-6v-6M5 48h6v6M59 48h-6v6"/>',
  };
  const gear = (k) => `<svg viewBox="0 0 64 64" aria-hidden="true">${GEAR[k] || GEAR.deck}</svg>`;
  const ext = (href) => (href.startsWith("http") ? ' target="_blank" rel="noopener"' : "");

  const contactItems = () => {
    const k = C.contact;
    return [
      ["phone", T("contact.phone"), k.phone, `tel:${String(k.phone).replace(/[^\d+]/g, "")}`],
      ["whatsapp", T("contact.whatsapp"), k.whatsapp && T("contact.waValue"), `https://wa.me/${k.whatsapp}`],
      ["mail", T("contact.mail"), k.bookingEmail, `mailto:${k.bookingEmail}`],
      ["instagram", "Instagram", k.instagram && `@${k.instagram}`, `https://www.instagram.com/${k.instagram}/`],
      ["tiktok", "TikTok", k.tiktok && `@${k.tiktok}`, `https://www.tiktok.com/@${k.tiktok}`],
      ["soundcloud", "SoundCloud", k.soundcloud && T("contact.listen"), k.soundcloud],
      ["spotify", "Spotify", k.spotify && T("contact.listen"), k.spotify],
      ["youtube", "YouTube", k.youtube && T("contact.watch"), k.youtube],
    ].filter(([, , v]) => !isPh(v));
  };
  const music = () => (C.music || []).filter((m) => m && !isPh(m.embed));

  let logoImg = null, galleryList = [];

  /* ===================== CONTENIDO ===================== */
  async function render() {
    $$("[data-i18n]").forEach((el) => (el.textContent = T(el.dataset.i18n)));
    $$("#langBtn span").forEach((s) => s.classList.toggle("on", s.dataset.l === lang));
    $("#langBtn").setAttribute("aria-label", T("lang.label"));
    $("#soundLabel").textContent = T("sound.play");

    const [logo, banner, layer] = await Promise.all([probe(C.logo.main), probe(C.banner), probe(C.heroLayers?.base)]);
    logoImg = logo;
    const name = esc(C.artist.name);
    if (logo) {
      $("#logoFallback").src = C.logo.main;
      $("#navLogo").innerHTML = `<img src="${C.logo.main}" alt="${name}">`;
      $("#footerLogo").innerHTML = `<img src="${C.logo.main}" alt="">`;
    }
    // La foto ya viene en el HTML; solo se cambia si la config apunta a otra o las capas no existen
    const base = $("#personStack .person-base"), rim = $("#personStack .person-rim");
    if (layer) {
      if (!base.src.endsWith(C.heroLayers.base)) base.src = C.heroLayers.base;
      if (C.heroLayers.rim && !rim.src.endsWith(C.heroLayers.rim)) rim.src = C.heroLayers.rim;
    } else if (await probe(C.heroImage)) { base.src = C.heroImage; rim.remove(); }
    else $("#personStack").innerHTML = "";

    // Portada
    const tag = tr(C.artist.tagline);
    if (isPh(tag)) $("#tagline").remove(); else $("#tagline").textContent = tag;
    const acts = [];
    if (contactItems().length) acts.push(`<a href="#booking" class="btn btn-primary">${T("hero.book")}</a>`);
    if (music().length) acts.push(`<a href="#music" class="btn btn-ghost">${T("hero.listen")}</a>`);
    else acts.push(`<a href="#photos" class="btn btn-ghost">${T("hero.photos")}</a>`);
    $("#heroActions").innerHTML = acts.join("");

    // Frase + cifras
    const statement = tr(C.statement);
    const stats = (C.stats || []).filter((s) => +s.value > 0);
    if (isPh(statement) && !stats.length) hideSection("statement");
    if (!isPh(statement)) $("#statementText").innerHTML = statement.split(/\s+/).map((w) => `<span class="w">${esc(w)}</span>`).join(" ");
    else $("#statementText").remove();
    if (stats.length) $("#stats").innerHTML = stats.map((s) =>
      `<div class="stat"><span class="stat-num" data-count="${+s.value}" data-suffix="${esc(s.suffix)}">${+s.value}${esc(s.suffix)}</span><span class="stat-label">${esc(tr(s.label))}</span></div>`).join("");
    else $("#stats").remove();

    if (banner) { $("#bannerImg").innerHTML = `<img src="${C.banner}" alt="${name}">`; $("#banner").hidden = false; }

    // Sobre mí
    const about = (tr(C.about?.text) || []).filter((p) => !isPh(p));
    if (!about.length) hideSection("about");
    else {
      $("#aboutText").innerHTML = about.map((p) => `<p>${esc(p)}</p>`).join("");
      const facts = (C.about.facts || []).filter((f) => !isPh(tr(f.value)));
      if (facts.length) $("#aboutFacts").innerHTML = facts.map((f) => `<div><dt>${esc(tr(f.label))}</dt><dd>${esc(tr(f.value))}</dd></div>`).join("");
      else $("#aboutFacts").remove();
      if (!isPh(C.aboutImage)) { $("#aboutPhoto").innerHTML = `<img src="${C.aboutImage}" alt="${name}" loading="lazy" decoding="async">`; $("#aboutPhoto img").onerror = () => $("#aboutPhoto")?.remove(); } else $("#aboutPhoto").remove();
    }

    // Fotos
    const photos = (C.photos || []).filter((p) => p && !isPh(p.src));
    galleryList = photos.map((p) => p.src);
    if (galleryList[0]) $(".lb-download").href = galleryList[0];
    const dls = (C.logo.downloads || []).map((l) =>
      `<a class="btn ${l.primary ? "btn-primary" : "btn-ghost"}" href="${l.src}" download>${esc(tr(l.label))}</a>`).join("");
    const panels = photos.map((p, i) => `
      <figure class="panel${p.wide ? " wide" : ""}" data-i="${i}" data-cursor="${T("cursor.view")}">
        <div class="panel-frame"><div class="panel-clip"><img src="${p.src}" alt="${name}, foto ${i + 1}" loading="lazy" decoding="async" draggable="false"></div></div>
        <figcaption><span>${i + 1}/${photos.length}</span><a href="${p.src}" download>${T("photos.download")}</a></figcaption>
      </figure>`).join("");
    const dlPanel = dls ? `<div class="panel panel-dl">${logo ? `<img src="${C.logo.main}" alt="">` : ""}<h3>${T("photos.dlTitle")}</h3><p>${T("photos.dlText")}</p><div class="dl-list">${dls}</div></div>` : "";
    if (!panels && !dlPanel) hideSection("photos");
    else {
      $("#track").innerHTML = panels + dlPanel;
      // si alguna foto no existe, se quita su panel (y de la lista del visor)
      $$("#track .panel[data-i] img").forEach((img) => (img.onerror = () => {
        const src = img.getAttribute("src");
        galleryList = galleryList.filter((s) => s !== src);
        img.closest(".panel").remove();
        ST?.refresh();
      }));
    }

    await renderSocial();

    // Música
    const mus = music();
    if (!mus.length) hideSection("music");
    else $("#musicGrid").innerHTML = mus.map((m) => `<iframe src="${esc(m.embed)}" loading="lazy" title="${esc(m.title)}" allow="autoplay; encrypted-media"></iframe>`).join("");

    // Salas como rótulos de neón (una letra "tocada" que parpadea, como en los neones de verdad)
    const events = (C.events || []).filter((e) => e && !isPh(e.venue));
    if (!events.length) hideSection("venues");
    else $("#venueList").innerHTML = events.map((e) => {
      const letters = [...e.venue];
      const candidates = letters.map((c, i) => (c.trim() ? i : -1)).filter((i) => i >= 0);
      const faulty = candidates[Math.floor(Math.random() * candidates.length)];
      const word = letters.map((c, i) => (c === " " ? " " : `<span class="l${i === faulty ? " faulty" : ""}">${esc(c)}</span>`)).join("");
      const meta = [e.date, e.city].filter((v) => !isPh(v)).map(esc).join(", ");
      return `<li><div class="sign-plate"><i class="screw"></i><i class="screw"></i><i class="screw"></i><i class="screw"></i>
        <span class="sign" aria-label="${esc(e.venue)}">${word}</span>${e.resident ? `<span class="sign-sub">${T("venues.resident")}</span>` : ""}</div>
        ${meta ? `<p class="sign-meta">${meta}</p>` : ""}</li>`;
    }).join("");

    // Rider
    const groups = (C.rider?.groups || []).map((g) => ({ ...g, items: (g.items || []).map(tr).filter((t) => !isPh(t)) })).filter((g) => g.items.length);
    if (!groups.length) hideSection("rider");
    else {
      $("#riderGrid").innerHTML = groups.map((g) =>
        `<div class="rider-item${g.required ? " required" : ""}">${gear(g.icon)}<div><h3>${esc(tr(g.title))}</h3>${g.items.map((t) => `<p>${esc(t)}</p>`).join("")}</div></div>`).join("");
      const extras = (C.rider.extras || []).map(tr).filter((t) => !isPh(t));
      if (extras.length) $("#riderExtras").textContent = extras.join(". ") + "."; else $("#riderExtras").remove();
    }

    // Booking
    const items = contactItems();
    if (!items.length) hideSection("booking");
    else {
      $("#contactList").innerHTML = items.map(([icon, label, value, href]) =>
        `<li><a href="${esc(href)}"${ext(href)}>${svg(icon)}<small>${esc(label)}</small><span>${esc(value)}</span></a></li>`).join("");
      $("#footerSocial").innerHTML = items.filter(([i]) => !["phone", "mail"].includes(i)).map(([icon, label, , href]) =>
        `<a href="${esc(href)}"${ext(href)} aria-label="${esc(label)}">${svg(icon)}</a>`).join("");
      $("#menuSocial").innerHTML = items.filter(([i]) => i !== "phone").map(([icon, label, , href]) =>
        `<a href="${esc(href)}"${ext(href)} aria-label="${esc(label)}">${svg(icon)}</a>`).join("");
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

  /* ===================== TIKTOK ===================== */
  async function renderSocial() {
    const handle = C.contact.tiktok, ig = C.contact.instagram;
    if (isPh(handle)) return hideSection("social");
    let data = null;
    try {
      const bucket = Math.floor(Date.now() / 6e5); // evita la caché vieja (cada 10 min)
      const r = await fetch(`${C.social.tiktokData}?v=${bucket}`, { cache: "no-cache" });
      if (r.ok) data = await r.json();
    } catch (e) { /* sin datos: se usa el widget oficial */ }

    // Cifras unificadas: TikTok (automático) + Instagram (seguidores automáticos; me gusta y
    // visualizaciones solo si se ponen en config.social, porque Instagram no los enseña sin iniciar sesión)
    const p = data?.profile || {}, igD = data?.instagram || {};
    const igFollowers = +igD.followers || 0, igLikes = +C.social?.instagramLikes || 0, igViews = +C.social?.instagramViews || 0;
    const followers = (+p.followers || 0) + igFollowers;
    const likes = (+p.likes || 0) + igLikes, views = (+data?.totals?.views || 0) + igViews;
    const stats = [[followers, T(igFollowers ? "social.followersBoth" : "social.followers")], [likes, T("social.likes")], [views, T("social.views")]].filter(([v]) => v > 0);
    if (stats.length) {
      $("#socialStats").innerHTML = stats.map(([v, l]) => `<div><dt>${esc(l)}</dt><dd data-num="${v}">${num(v)}</dd></div>`).join("");
      if (igFollowers) $("#socialStats").insertAdjacentHTML("afterend", `<p class="social-note">${T(igLikes || igViews ? "social.noteBoth" : "social.noteTT")}</p>`);
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
      // Widget oficial del perfil (siempre muestra lo último)
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
    $("#phones").innerHTML = vids.map((v) => {
      const caption = (v.description || "").replace(/\s+/g, " ").trim();
      return `<figure class="phone" data-id="${esc(v.id)}" data-cursor="${T("cursor.play")}">
        <div class="phone-body"><div class="phone-screen">
          <span class="phone-island"></span>
          <div class="phone-status"><span>${clock}</span><svg viewBox="0 0 34 12" aria-hidden="true"><rect x="0" y="7" width="3" height="5" rx="1"/><rect x="5" y="5" width="3" height="7" rx="1"/><rect x="10" y="3" width="3" height="9" rx="1"/><rect x="15" y="1" width="3" height="11" rx="1"/><rect x="22" y="1" width="10" height="10" rx="2.5" fill="none" stroke="#fff" stroke-width="1.2"/><rect x="23.6" y="2.6" width="6.4" height="6.8" rx="1.4"/></svg></div>
          <img class="phone-cover" src="${esc(v.cover)}" alt="" loading="lazy" decoding="async">
          <div class="phone-rail">${[["heart", v.likes], ["comment", v.comments], ["eye", v.views]].filter(([, n]) => n != null).map(([i, n]) => `<span>${svg(i)}${num(+n)}</span>`).join("")}</div>
          <div class="phone-ui"><b>@${esc(handle)}</b><p>${esc(caption)}</p></div>
          <button class="phone-play" type="button" aria-label="${T("social.play")}">${svg("play")}</button>
        </div></div>
        <figcaption class="phone-meta">${v.timestamp ? esc(ago(v.timestamp)) + " · " : ""}<a href="${esc(v.url)}" target="_blank" rel="noopener">${T("social.open")}</a></figcaption>
      </figure>`;
    }).join("");
    // Al tocar: el reproductor oficial de TikTok dentro del móvil
    $$("#phones .phone").forEach((ph) => ph.addEventListener("click", (e) => {
      if (e.target.closest("a") || ph.classList.contains("playing")) return;
      ph.classList.add("playing");
      const src = `https://www.tiktok.com/player/v1/${ph.dataset.id}?autoplay=1&loop=1&controls=1&progress_bar=1&play_button=1&volume_control=1&fullscreen_button=1&timestamp=0&music_info=0&description=0&rel=0&native_context_menu=0&closed_caption=0`;
      $(".phone-screen", ph).insertAdjacentHTML("beforeend", `<iframe src="${src}" title="TikTok" allow="autoplay; fullscreen; encrypted-media; picture-in-picture" allowfullscreen></iframe>`);
      if (Sound.on) $("#soundBtn").click(); // que no se pisen los audios
    }));
  }

  function setupForm() {
    const k = C.contact, form = $("#bookingForm"), err = $("#formError");
    const wa = !isPh(k.whatsapp), mail = !isPh(k.bookingEmail);
    if (!wa && !mail) return form.remove();
    $("#formActions").innerHTML =
      (wa ? `<button type="submit" class="btn btn-primary" data-via="wa">${T("form.wa")}</button>` : "") +
      (mail ? `<button type="submit" class="btn btn-ghost" data-via="mail">${T("form.mail")}</button>` : "");
    let via = wa ? "wa" : "mail";
    $$("#formActions button").forEach((b) => b.addEventListener("click", () => (via = b.dataset.via)));
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const f = Object.fromEntries(new FormData(form));
      if (!f.nombre.trim() || !f.evento.trim()) { err.textContent = T("form.error"); return; }
      err.textContent = "";
      const date = f.fecha ? new Date(f.fecha + "T12:00").toLocaleDateString(lang === "es" ? "es-ES" : "en-GB", { day: "numeric", month: "long", year: "numeric" }) : "";
      const lines = [T("msg.hello").replace("{name}", C.artist.name), "", `${T("msg.name")}: ${f.nombre.trim()}`, `${T("msg.event")}: ${f.evento.trim()}`];
      if (f.ciudad.trim()) lines.push(`${T("msg.city")}: ${f.ciudad.trim()}`);
      if (date) lines.push(`${T("msg.date")}: ${date}`);
      if (f.mensaje.trim()) lines.push("", f.mensaje.trim());
      const text = lines.join("\n");
      const url = via === "wa"
        ? `https://wa.me/${k.whatsapp}?text=${encodeURIComponent(text)}`
        : `mailto:${k.bookingEmail}?subject=${encodeURIComponent(`Booking ${C.artist.name}${date ? " – " + date : ""}`)}&body=${encodeURIComponent(text)}`;
      window.open(url, via === "wa" ? "_blank" : "_self");
    });
  }

  /* ===================== REALISMO DE LA PORTADA ===================== */
  // Vídeo de fondo: el HTML ya lo empezó a cargar (es lo primero que se ve). Aquí solo se cambia
  // de versión si se gira la pantalla, y se pausa cuando la portada no está a la vista.
  function setupVideo() {
    const v = $("#heroVideo"), hv = C.heroVideo;
    if (!hv) return v.remove();
    const pick = () => (innerHeight > innerWidth ? "tall" : "wide");
    let current = v.dataset.k || null;
    const load = () => {
      const k = pick();
      if (k === current || reduce || navigator.connection?.saveData) return;
      current = k;
      v.src = k === "tall" ? hv.tall : hv.wide;
      v.play().catch(() => {});
    };
    if (current && !v.getAttribute("src")?.endsWith(current === "tall" ? hv.tall : hv.wide)) { current = null; } // la config apunta a otro vídeo
    if (!current) load();
    let t; addEventListener("resize", () => { clearTimeout(t); t = setTimeout(load, 300); });
    new IntersectionObserver(([e]) => { if (!v.getAttribute("src")) return; e.isIntersecting ? v.play().catch(() => {}) : v.pause(); }).observe($("#hero"));
  }

  /* ===================== GRIETAS (SVG procedural) ===================== */
  function crackPaths(svgEl, cx, cy, W, H, branches, reach) {
    svgEl.setAttribute("viewBox", `0 0 ${W} ${H}`);
    const R = () => Math.random();
    const paths = [];
    const grow = (x, y, ang, len, depth, width) => {
      let d = `M${x.toFixed(1)} ${y.toFixed(1)}`;
      const segs = 7 + Math.floor(R() * 6), step = len / segs;
      for (let i = 0; i < segs; i++) {
        ang += (R() - 0.5) * 0.7;
        x += Math.cos(ang) * step * (0.6 + R() * 0.8); y += Math.sin(ang) * step * (0.6 + R() * 0.8);
        d += ` L${x.toFixed(1)} ${y.toFixed(1)}`;
        if (depth < 2 && R() < 0.22) grow(x, y, ang + (R() < 0.5 ? 1 : -1) * (0.5 + R() * 0.7), len * 0.45, depth + 1, width * 0.6);
      }
      paths.push([d, width]);
    };
    for (let b = 0; b < branches; b++) grow(cx, cy, (b / branches) * Math.PI * 2 + (R() - 0.5) * 0.5, reach * (0.6 + R() * 0.6), 0, 1.6 + R());
    svgEl.innerHTML = paths.map(([d, w]) => `<path d="${d}" stroke-width="${w.toFixed(2)}"/>`).join("");
    const els = $$("path", svgEl);
    els.forEach((p) => { const l = p.getTotalLength(); p.style.strokeDasharray = l; p.style.strokeDashoffset = l; });
    return els;
  }

  /* ===================== LOGO DE HIELO ===================== */
  let ice = null;
  async function setupIce() {
    const box = $("#heroLogo"), canvas = $("#iceCanvas");
    const small = touch || innerWidth < 900;
    const map = await probe(small ? C.iceMap?.small : C.iceMap?.large);
    if (logoImg) ice = window.IceLogo ? window.IceLogo(canvas, logoImg, map, { every: touch ? 2 : 1 }) : null;
    if (ice) box.style.setProperty("--logo-ar", ice.aspect);
    else {
      canvas.remove(); box.classList.add("fallback");
      if (logoImg) box.style.setProperty("--logo-ar", logoImg.naturalWidth / logoImg.naturalHeight);
    }
  }
  function logoRect() {
    const r = $("#heroLogo").getBoundingClientRect();
    const px = ice ? ice.pad.x : 0.07, py = ice ? ice.pad.y : 0.07;
    return { left: r.left + r.width * px, top: r.top + r.height * py, width: r.width * (1 - 2 * px), height: r.height * (1 - 2 * py) };
  }

  /* ===================== INTRO ===================== */
  function playIntro(onReveal) {
    const intro = $("#intro");
    const skip = !animated || !logoImg || slowNet || sess.get("pk-intro") === "1";
    if (skip) { intro.remove(); onReveal(false); return; }
    const count = $("#introCount"), prog = { v: 0 };
    const tick = () => (count.textContent = Math.round(prog.v));
    const minWait = touch ? 450 : 900, maxFonts = touch ? 1300 : 2500;
    G.to(prog, { v: 88, duration: minWait / 1000 + 0.2, ease: "power1.out", onUpdate: tick });
    const ready = Promise.race([Promise.all([document.fonts ? document.fonts.ready : 0]), new Promise((r) => setTimeout(r, maxFonts))]);
    Promise.all([ready, new Promise((r) => setTimeout(r, minWait))]).then(() =>
      G.to(prog, { v: 100, duration: 0.3, onUpdate: tick, onComplete: assemble }));

    function assemble() {
      const r = logoRect(), wrap = $("#introShards");
      Object.assign(wrap.style, { left: r.left + "px", top: r.top + "px", width: r.width + "px", height: r.height + "px" });
      const cols = innerWidth < 700 ? 6 : 9, rows = 3, P = [];
      for (let y = 0; y <= rows; y++) for (let x = 0; x <= cols; x++) {
        const jx = x > 0 && x < cols ? (Math.random() - 0.5) * 0.7 : 0, jy = y > 0 && y < rows ? (Math.random() - 0.5) * 0.7 : 0;
        P.push([((x + jx) / cols) * 100, ((y + jy) / rows) * 100]);
      }
      const at = (x, y) => P[y * (cols + 1) + x];
      const tris = [];
      for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
        const a = at(x, y), b = at(x + 1, y), c = at(x, y + 1), d = at(x + 1, y + 1);
        if ((x + y) % 2) tris.push([a, b, d], [a, d, c]); else tris.push([a, b, c], [b, d, c]);
      }
      wrap.innerHTML = tris.map((t) => {
        const cx = (t[0][0] + t[1][0] + t[2][0]) / 3, cy = (t[0][1] + t[1][1] + t[2][1]) / 3;
        return `<div class="shard" style="background-image:url('${C.logo.main}');clip-path:polygon(${t.map((p) => `${p[0].toFixed(2)}% ${p[1].toFixed(2)}%`).join(",")});transform-origin:${cx.toFixed(1)}% ${cy.toFixed(1)}%"></div>`;
      }).join("");
      const shards = $$(".shard", wrap);
      const cracks = crackPaths($("#introCracks"), r.left + r.width / 2, r.top + r.height / 2, innerWidth, innerHeight, 14, Math.max(innerWidth, innerHeight) * 0.6);
      const rnd = G.utils.random;
      const tl = G.timeline({ onComplete: () => { intro.remove(); sess.set("pk-intro", "1"); } });
      if (touch) tl.timeScale(1.3); // en móvil, la misma intro pero más ágil
      tl.to(".intro-count", { opacity: 0, duration: 0.3 })
        .from(shards, {
          x: () => rnd(-0.8, 0.8) * innerWidth, y: () => rnd(-0.8, 0.8) * innerHeight, z: () => rnd(-900, 300),
          rotation: () => rnd(-200, 200), rotationX: () => rnd(-120, 120), rotationY: () => rnd(-120, 120),
          opacity: 0, duration: 1.5, ease: "expo.out", stagger: { each: 0.012, from: "random" },
        }, 0.1)
        .addLabel("impact", 1.3)
        .fromTo("#introFlash", { opacity: 0 }, { opacity: 0.9, duration: 0.07, yoyo: true, repeat: 1, ease: "none" }, "impact")
        .to(cracks, { strokeDashoffset: 0, duration: 0.4, ease: "power3.out", stagger: 0.006 }, "impact")
        .to("#introCracks", { opacity: 0, duration: 1, ease: "power2.in" }, "impact+=0.4")
        .to(intro, { backgroundColor: "rgba(3,6,12,0)", duration: 0.9, ease: "power2.out" }, "impact+=0.05")
        .fromTo("#hero", { x: -10 }, { x: 0, duration: 0.6, ease: "elastic.out(1, 0.25)", clearProps: "x" }, "impact")
        .add(() => onReveal(true), "impact");
      if (ice) tl.to(ice, { on: 1, duration: 0.35 }, "impact").to(shards, { opacity: 0, duration: 0.4 }, "impact+=0.2");
      else tl.add(() => $("#heroLogo").classList.add("fallback"), "impact").to(shards, { opacity: 0, duration: 0.4 }, "impact+=0.2");
    }
  }

  function revealHero(fromIntro) {
    document.body.classList.remove("is-loading");
    // la fuente de los rótulos de neón se usa más abajo: se pide ahora, fuera del arranque
    const neonFont = document.createElement("link");
    neonFont.rel = "stylesheet"; neonFont.href = "https://fonts.googleapis.com/css2?family=Tilt+Neon&display=swap";
    document.head.appendChild(neonFont);
    if (ice && !fromIntro) ice.on = 1;
    const neon = $("#heroNeon");
    if (!animated) { neon.classList.add("on"); return; }
    G.timeline({ delay: fromIntro ? 0.15 : 0 })
      .from("#personStack", { yPercent: 12, opacity: 0, duration: 1.4, ease: "expo.out" }, 0)
      .add(() => neon.classList.add("on"), 0.35)
      .from("#heroFoot > *", { y: 30, opacity: 0, duration: 1, ease: "expo.out", stagger: 0.1 }, 0.5)
      .from("#nav > *", { y: -30, opacity: 0, duration: 0.9, ease: "expo.out", stagger: 0.06, clearProps: "transform,opacity" }, 0.6)
      .from("#dock", { opacity: 0, duration: 0.8, ease: "power2.out", clearProps: "opacity" }, 0.8);
    if (!fromIntro && ice) G.from(ice, { on: 0, duration: 0.8 });
    if (lenis) lenis.start();
  }

  /* ===================== SCROLL (Lenis + ScrollTrigger) ===================== */
  let lenis = null;
  function setupScroll() {
    if (!animated) return;
    if (window.Lenis && fine) {
      lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
      lenis.on("scroll", ST.update);
      G.ticker.add((t) => lenis.raf(t * 1000));
      G.ticker.lagSmoothing(0);
      if (document.body.classList.contains("is-loading")) lenis.stop();
    }
    const nav = $("#nav");
    let lastY = 0;
    const onScroll = (y) => {
      nav.classList.toggle("scrolled", y > 40);
      nav.classList.toggle("hide", y > innerHeight * 0.9 && y > lastY);
      lastY = y;
    };
    if (lenis) lenis.on("scroll", (l) => onScroll(l.scroll)); else addEventListener("scroll", () => onScroll(scrollY), { passive: true });

    // 1. Portada fija: el logo sube, tú te acercas, el aro se expande y el hielo se agrieta
    const hero = $("#hero");
    const cracks = crackPaths($("#heroCracks"), hero.clientWidth / 2, hero.clientHeight * 0.47, hero.clientWidth, hero.clientHeight, 11, Math.max(hero.clientWidth, hero.clientHeight) * 0.75);
    G.timeline({ scrollTrigger: { trigger: hero, start: "top top", end: "+=120%", pin: true, scrub: 0.7 } })
      .to("#heroLogo", { y: () => -innerHeight * 0.3, scale: 0.72, ease: "none" }, 0)
      .to("#heroPerson", { scale: 1.18, y: () => innerHeight * 0.04, ease: "none" }, 0)
      .to("#heroNeon", { scale: 1.8, opacity: 0, ease: "none" }, 0)
      .to("#heroVideo", { scale: 1.15, ease: "none" }, 0)
      .to("#heroFoot", { opacity: 0, y: -60, ease: "none", duration: 0.35 }, 0)
      .to(".hero-scroll", { opacity: 0, duration: 0.1 }, 0)
      .to(cracks, { strokeDashoffset: 0, ease: "power1.in", stagger: 0.01, duration: 0.5 }, 0.2)
      .to("#heroLogo", { opacity: 0, filter: "blur(10px)", ease: "none", duration: 0.3 }, 0.62)
      .to(["#heroPerson", ".hero-fog", ".hero-beams"], { opacity: 0, ease: "none", duration: 0.3 }, 0.7)
      .fromTo("#heroVideo", { opacity: 0.62 }, { opacity: 0.08, ease: "none", duration: 0.3, immediateRender: false }, 0.7)
      .to(".hero-bg", { opacity: 0.1, ease: "none", duration: 0.3 }, 0.7)
      .to("#heroCracks", { opacity: 0, ease: "none", duration: 0.15 }, 0.9);

    // 1b. Galería horizontal (escritorio). Se crea antes que lo de debajo para que todo
    //     calcule bien su posición con el espacio que ocupa el pin.
    const mm = G.matchMedia();
    mm.add("(min-width: 901px)", () => {
      const track = $("#track"), sec = $("#photos");
      if (!track || sec.hidden) return;
      const dist = () => Math.max(0, track.scrollWidth - innerWidth);
      const move = G.to(track, { x: () => -dist(), ease: "none",
        scrollTrigger: { trigger: sec, start: "top top", end: () => "+=" + dist(), pin: true, scrub: 0.8, invalidateOnRefresh: true } });
      $$(".panel-clip img", track).forEach((img) => G.fromTo(img, { xPercent: -6 }, { xPercent: 6, ease: "none",
        scrollTrigger: { trigger: img.closest(".panel"), containerAnimation: move, start: "left right", end: "right left", scrub: true } }));
      // Móviles de TikTok: se abren en abanico
      if ($$("#phones .phone").length === 3) G.from("#phones .phone", { y: 140, opacity: 0, rotationX: 28, duration: 1.3, ease: "expo.out", stagger: 0.12, scrollTrigger: { trigger: "#phones", start: "top 80%" } });
    });

    // 2. Títulos: entran cortados en diagonal, como un golpe del logo
    $$(".h2").forEach((h) => G.fromTo(h,
      { clipPath: "polygon(-5% -30%, -5% -30%, -35% 130%, -35% 130%)", x: -40 },
      { clipPath: "polygon(-5% -30%, 140% -30%, 110% 130%, -35% 130%)", x: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: h, start: "top 86%" } }));

    // 3. Frase: las palabras se encienden al bajar
    const words = $$("#statementText .w");
    if (words.length) G.fromTo(words, { opacity: 0.38 }, { opacity: 1, ease: "none", stagger: 0.1,
      scrollTrigger: { trigger: "#statementText", start: "top 78%", end: "bottom 45%", scrub: true } });

    // 4. Cifras que cuentan (también las de TikTok)
    $$("[data-count], [data-num]").forEach((el) => {
      const target = +(el.dataset.count ?? el.dataset.num), suf = el.dataset.suffix || "", o = { v: 0 };
      const fmt = el.dataset.num ? (v) => num(Math.round(v)) : (v) => Math.round(v) + suf;
      el.textContent = fmt(0);
      ST.create({ trigger: el, start: "top 88%", once: true, onEnter: () => G.to(o, { v: target, duration: 2, ease: "power3.out", onUpdate: () => (el.textContent = fmt(o.v)) }) });
    });

    // 5. Parallax suave en banner y foto de "Sobre mí"
    if (!$("#banner").hidden) G.fromTo("#bannerImg img", { yPercent: -8 }, { yPercent: 8, ease: "none", scrollTrigger: { trigger: "#banner", scrub: true } });
    if ($("#aboutPhoto img")) G.fromTo("#aboutPhoto img", { yPercent: 8 }, { yPercent: -4, ease: "none", scrollTrigger: { trigger: "#aboutPhoto", scrub: true } });

    // 7. Rótulos de neón: se encienden con el parpadeo del arranque
    $$(".sign-plate").forEach((plate, i) => ST.create({ trigger: plate, start: "top 80%", once: true, onEnter: () => {
      const seq = [0, 0.06, 0.12, 0.2, 0.34, 0.42, 0.6];
      seq.forEach((t, j) => G.delayedCall(t + i * 0.18, () => plate.classList.toggle("on", j % 2 === 0)));
      G.delayedCall(0.75 + i * 0.18, () => plate.classList.add("on"));
    } }));

    // 8. Rótulo de booking y logo final
    ST.create({ trigger: "#neonSign", start: "top 85%", once: true, onEnter: () => $("#neonSign").classList.add("lit") });
    if ($("#footerLogo img")) G.fromTo("#footerLogo img", { yPercent: 35, opacity: 0 }, { yPercent: 0, opacity: 0.92, ease: "none",
      scrollTrigger: { trigger: ".footer", start: "top bottom", end: "bottom bottom", scrub: true } });

    addEventListener("load", () => ST.refresh());
    document.fonts?.ready.then(() => ST.refresh());
    if (document.readyState === "complete") requestAnimationFrame(() => ST.refresh());
  }

  function setupLinks() {
    const nav = $("#nav"), toggle = $("#navToggle");
    toggle.addEventListener("click", () => { const o = nav.classList.toggle("open"); toggle.setAttribute("aria-expanded", o); document.body.classList.toggle("menu-open", o); o ? lenis?.stop() : lenis?.start(); });
    document.addEventListener("click", (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href"), target = id === "#top" ? 0 : document.querySelector(id);
      if (target == null) return;
      e.preventDefault();
      if (nav.classList.contains("open")) { nav.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); document.body.classList.remove("menu-open"); lenis?.start(); }
      if (lenis) lenis.scrollTo(target, { duration: 1.6 });
      else window.scrollTo({ top: target === 0 ? 0 : target.getBoundingClientRect().top + scrollY, behavior: reduce ? "auto" : "smooth" });
    });
    $("#langBtn").addEventListener("click", () => {
      const next = lang === "es" ? "en" : "es";
      store.set("pk-lang", next);
      const u = new URL(location.href); u.searchParams.set("lang", next); location.href = u.toString();
    });
  }

  /* ===================== PUNTERO ===================== */
  function setupPointer() {
    addEventListener("pointermove", (e) => {
      if (!ice) return;
      const r = $("#iceCanvas")?.getBoundingClientRect();
      if (r && r.bottom > 0) ice.pointTo((e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height);
    }, { passive: true });
    document.addEventListener("pointerleave", () => ice?.pointTo(null));
    if (!fine || !animated) return;

    root.classList.add("has-cursor");
    const cur = $("#cursor"), label = $("#cursorLabel");
    const qx = G.quickTo(cur, "x", { duration: 0.35, ease: "power3" }), qy = G.quickTo(cur, "y", { duration: 0.35, ease: "power3" });
    const px = G.quickTo("#personStack", "x", { duration: 1, ease: "power3" }), py = G.quickTo("#personStack", "y", { duration: 1, ease: "power3" });
    const vx = G.quickTo("#heroVideo", "x", { duration: 1.6, ease: "power3" });
    addEventListener("pointermove", (e) => {
      qx(e.clientX); qy(e.clientY);
      const dx = e.clientX / innerWidth - 0.5, dy = e.clientY / innerHeight - 0.5;
      px(dx * -18); py(dy * -10); vx(dx * 24);
    }, { passive: true });
    document.addEventListener("pointerover", (e) => {
      const lab = e.target.closest("[data-cursor]");
      const text = lab && !lab.classList.contains("playing") && lab.dataset.cursor;
      cur.classList.toggle("has-label", !!text);
      label.textContent = text || "";
      cur.classList.toggle("is-link", !text && !!e.target.closest("a, button, input, textarea, label"));
    });
  }

  /* ===================== SONIDO ===================== */
  function setupSound() {
    const btn = $("#soundBtn"), label = $("#soundLabel");
    const set = (on) => { document.body.classList.toggle("playing", on); btn.setAttribute("aria-pressed", on); label.textContent = T(on ? "sound.pause" : "sound.play"); };
    btn.addEventListener("click", () => { if (Sound.on) { Sound.stop(); set(false); } else { Sound.start(); set(true); } });
    document.addEventListener("visibilitychange", () => { if (document.hidden && Sound.on) { Sound.stop(); set(false); } });
  }

  /* ===================== LIGHTBOX ===================== */
  function setupLightbox() {
    const lb = $("#lightbox"), img = $("img", lb), dl = $(".lb-download", lb), count = $(".lb-count", lb);
    let idx = 0, sx = null, downX = 0;
    const show = (i) => { idx = (i + galleryList.length) % galleryList.length; img.src = dl.href = galleryList[idx]; count.textContent = `${idx + 1}/${galleryList.length}`; };
    const open = (i) => { show(i); lb.classList.add("open"); lb.setAttribute("aria-hidden", "false"); document.body.classList.add("lb-open"); lenis?.stop(); $(".lb-close", lb).focus(); };
    const close = () => { lb.classList.remove("open"); lb.setAttribute("aria-hidden", "true"); document.body.classList.remove("lb-open"); lenis?.start(); };
    const track = $("#track");
    track?.addEventListener("pointerdown", (e) => (downX = e.clientX));
    track?.addEventListener("click", (e) => {
      const p = e.target.closest(".panel[data-i]");
      if (!p || e.target.closest("a") || Math.abs(e.clientX - downX) > 8) return;
      open(Math.max(0, galleryList.indexOf($("img", p).getAttribute("src"))));
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
  // Barra inferior: el botón Contratar/WhatsApp aparece al salir de la portada y se esconde en Booking
  function setupDock() {
    const dock = $("#dock"), hero = $("#hero"), booking = $("#booking");
    let heroIn = true, bookIn = false;
    const upd = () => dock.classList.toggle("cta-off", heroIn || bookIn);
    new IntersectionObserver(([e]) => { heroIn = e.intersectionRatio > 0.5; upd(); }, { threshold: [0, 0.5, 1] }).observe(hero);
    if (!booking.hidden) new IntersectionObserver(([e]) => { bookIn = e.isIntersecting; upd(); }, { rootMargin: "0px 0px -30% 0px" }).observe(booking);
    upd();
  }
  // "Desliza →" en los carruseles; desaparece en cuanto se usa
  function setupSwipeHints() {
    $$(".swipe-hint").forEach((hint) => {
      const scroller = hint.previousElementSibling;
      const inner = scroller?.classList.contains("hscroll") ? scroller : scroller;
      if (!inner) return;
      const done = () => hint.classList.add("used");
      inner.addEventListener("scroll", done, { passive: true, once: true });
      inner.addEventListener("touchstart", done, { passive: true, once: true });
    });
  }
  // Android: al inclinar el móvil se mueve la luz del hielo y tu foto (iOS pide permiso, así que ahí no)
  function setupTilt() {
    if (!touch || reduce || !window.DeviceOrientationEvent || typeof DeviceOrientationEvent.requestPermission === "function") return;
    let raf = 0, last = null, heroVisible = true;
    new IntersectionObserver(([e]) => (heroVisible = e.isIntersecting)).observe($("#hero"));
    const px = G ? G.quickTo("#personStack", "x", { duration: 0.9, ease: "power3" }) : null;
    const py = G ? G.quickTo("#personStack", "y", { duration: 0.9, ease: "power3" }) : null;
    addEventListener("deviceorientation", (e) => {
      if (e.gamma == null || !heroVisible) return;
      last = e;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const gx = Math.max(-1, Math.min(1, last.gamma / 30)), gy = Math.max(-1, Math.min(1, ((last.beta ?? 45) - 45) / 30));
        ice?.pointTo(0.5 + gx * 0.6, 0.38 + gy * 0.5);
        px?.(gx * -12); py?.(gy * -8);
      });
    }, { passive: true });
  }

  /* ===================== BUCLE (hielo + bombo) ===================== */
  function startLoop() {
    let heroVisible = true, lastK = -1;
    const heroEl = $("#hero");
    new IntersectionObserver(([e]) => (heroVisible = e.isIntersecting)).observe(heroEl);
    const frame = () => {
      const k = Sound.kickLevel();
      if (Math.abs(k - lastK) > 0.004) { heroEl.style.setProperty("--kick", k.toFixed(3)); lastK = k; }
      if (ice && heroVisible) { ice.kick = k; ice.render(reduce ? 0 : performance.now() / 1000); }
    };
    if (G) G.ticker.add(frame); else { const raf = () => { frame(); requestAnimationFrame(raf); }; requestAnimationFrame(raf); }
  }

  /* ===================== ARRANQUE ===================== */
  async function init() {
    await render();
    await yieldTask();
    await setupIce();
    setupVideo();
    await yieldTask();
    setupScroll();
    setupLinks();
    setupPointer();
    setupSound();
    setupLightbox();
    startLoop();
    setupDock();
    setupSwipeHints();
    setupTilt();
    playIntro(revealHero);
  }
  init().catch((e) => { console.error(e); $("#intro")?.remove(); document.body.classList.remove("is-loading"); });
})();
