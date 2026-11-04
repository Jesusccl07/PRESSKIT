(() => {
  window.__introDone = true; // main.js cargó: la red de seguridad del <head> ya no hace falta
  const C = window.PRESSKIT;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const isPh = (v) => v == null || String(v).trim() === "" || /^\s*\[.*\]\s*$/.test(String(v));
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(pointer: fine)").matches;
  const G = window.gsap, ST = window.ScrollTrigger;
  const animated = !!(G && ST) && !reduce;
  const root = document.documentElement;
  const safe = (fn, fb) => { try { return fn(); } catch (e) { return fb; } };
  const store = { get: (k) => safe(() => localStorage.getItem(k), null), set: (k, v) => safe(() => localStorage.setItem(k, v)) };
  const sess = { get: (k) => safe(() => sessionStorage.getItem(k), null), set: (k, v) => safe(() => sessionStorage.setItem(k, v)) };
  if (G && ST) {
    G.registerPlugin(ST);
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
      "nav.bio": "Bio", "nav.photos": "Fotos", "nav.music": "Música", "nav.venues": "Salas", "nav.rider": "Rider", "nav.booking": "Booking",
      "hero.book": "Contratar", "hero.photos": "Ver fotos", "hero.listen": "Escuchar",
      "bio.title": "Bio",
      "photos.title": "Fotos de prensa", "photos.sub": "Sin fondo, listas para carteles y flyers. Toca una foto para ampliarla.",
      "photos.download": "Descargar", "photos.dlTitle": "Material para promotores",
      "photos.dlText": "Logos y fotos en alta calidad con fondo transparente, y la ficha en PDF.",
      "music.title": "Música", "venues.title": "Ha pinchado en", "rider.title": "Rider técnico",
      "booking.title": "Reserva una fecha",
      "booking.text": "Cuéntame tu evento y te respondo lo antes posible. El mensaje sale ya redactado por WhatsApp o por email.",
      "form.name": "Nombre", "form.event": "Sala o evento", "form.city": "Ciudad", "form.date": "Fecha",
      "form.message": "Mensaje: horario, aforo, tipo de evento", "form.wa": "Enviar por WhatsApp", "form.mail": "Enviar por email",
      "form.error": "Escribe al menos tu nombre y la sala o evento.",
      "msg.hello": "Hola {name}, quiero contratarte.", "msg.name": "Nombre", "msg.event": "Sala / evento", "msg.city": "Ciudad", "msg.date": "Fecha",
      "contact.phone": "Teléfono", "contact.whatsapp": "WhatsApp", "contact.waValue": "Escríbeme", "contact.mail": "Email",
      "contact.listen": "Escuchar", "contact.watch": "Ver vídeos",
      "footer.rights": "Todos los derechos reservados.", "footer.top": "Volver arriba",
      "sound.play": "Play", "sound.pause": "Pausa", "cursor.view": "Ver", "lang.label": "View in English",
      "loc": "Ciudad Real, España",
    },
    en: {
      "nav.bio": "Bio", "nav.photos": "Photos", "nav.music": "Music", "nav.venues": "Venues", "nav.rider": "Rider", "nav.booking": "Booking",
      "hero.book": "Book CLEMENT", "hero.photos": "See photos", "hero.listen": "Listen",
      "bio.title": "Bio",
      "photos.title": "Press photos", "photos.sub": "Background-free, ready for posters and flyers. Tap a photo to view it.",
      "photos.download": "Download", "photos.dlTitle": "Promoter assets",
      "photos.dlText": "High-res logos and photos with transparent backgrounds, plus the PDF one-sheet.",
      "music.title": "Music", "venues.title": "Has played at", "rider.title": "Technical rider",
      "booking.title": "Book a date",
      "booking.text": "Tell me about your event and I'll get back to you soon. Your message goes out ready-written via WhatsApp or email.",
      "form.name": "Name", "form.event": "Venue or event", "form.city": "City", "form.date": "Date",
      "form.message": "Message: set time, capacity, type of event", "form.wa": "Send via WhatsApp", "form.mail": "Send via email",
      "form.error": "Add at least your name and the venue or event.",
      "msg.hello": "Hi {name}, I'd like to book you.", "msg.name": "Name", "msg.event": "Venue / event", "msg.city": "City", "msg.date": "Date",
      "contact.phone": "Phone", "contact.whatsapp": "WhatsApp", "contact.waValue": "Message me", "contact.mail": "Email",
      "contact.listen": "Listen", "contact.watch": "Watch videos",
      "footer.rights": "All rights reserved.", "footer.top": "Back to top",
      "sound.play": "Play", "sound.pause": "Pause", "cursor.view": "View", "lang.label": "Ver en español",
    },
  };
  const T = (k) => I18N[lang][k] ?? I18N.es[k] ?? k;
  if (lang === "en") {
    $('meta[name="description"]').content = "Official press kit of CLEMENT, urbano, dembow and trap DJ from Ciudad Real, Spain: bio, press photos, logos, technical rider and booking.";
  }

  const probe = (src) => new Promise((res) => {
    if (!src) return res(null);
    const i = new Image();
    i.onload = () => res(i); i.onerror = () => res(null);
    i.src = src;
  });
  const hideSection = (id) => { const s = document.getElementById(id); if (s) s.hidden = true; };

  /* ===================== CONTENIDO ===================== */
  const ICONS = {
    phone: '<path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z"/>',
    mail: '<path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4-8 5-8-5V6l8 5 8-5z"/>',
    whatsapp: '<path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-3.3-.8a11 11 0 0 1-4.3-3.8c-.3-.5-1-1.5-1-2.8s.7-2 .9-2.3c.3-.3.6-.3.8-.3h.6c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.3 0 .5l-.3.5-.4.4c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.2.5.1.6 0l.9-1c.2-.3.4-.2.7-.1l2 1c.3.1.5.2.5.3.1.1.1.6-.1 1.2z"/>',
    instagram: '<path d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4zM17.3 5.5a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4zM21.9 7.1c-.1-1.6-.4-3-1.6-4.2S17.7 1.3 16.1 1.2C14.4 1.1 9.6 1.1 7.9 1.2 6.3 1.3 4.9 1.6 3.7 2.8S2.1 5.5 2 7.1C1.9 8.8 1.9 15.2 2 16.9c.1 1.6.4 3 1.6 4.2s2.6 1.5 4.2 1.6c1.7.1 6.5.1 8.2 0 1.6-.1 3-.4 4.2-1.6s1.5-2.6 1.6-4.2c.1-1.7.1-8.1.1-9.8zm-2.2 11.6a3.3 3.3 0 0 1-1.9 1.9c-1.3.5-4.4.4-5.8.4s-4.5.1-5.8-.4a3.3 3.3 0 0 1-1.9-1.9c-.5-1.3-.4-4.4-.4-5.8s-.1-4.5.4-5.8A3.3 3.3 0 0 1 6.2 3.2c1.3-.5 4.4-.4 5.8-.4s4.5-.1 5.8.4a3.3 3.3 0 0 1 1.9 1.9c.5 1.3.4 4.4.4 5.8s.1 4.5-.4 5.8z"/>',
    tiktok: '<path d="M16.6 2h-3.3v13.4a2.9 2.9 0 1 1-2-2.8V9.2a6.2 6.2 0 1 0 5.3 6.2V8.6a7.6 7.6 0 0 0 4.4 1.4V6.7a4.4 4.4 0 0 1-4.4-4.4z"/>',
    soundcloud: '<path d="M1 14.5c0 1 .5 1.7 1 1.7s1-.7 1-1.7-.5-1.7-1-1.7-1 .7-1 1.7zm3-2.5v5h1v-5zm2-1.5v6.5h1v-6.5zm2-1v7.5h1V9.5zm2-1.5v9h1V8zm2.5-1.5V17h7a3.5 3.5 0 0 0 0-7 3.4 3.4 0 0 0-1.3.3A5.5 5.5 0 0 0 12.5 6.5z"/>',
    spotify: '<path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm4.6 14.4a.6.6 0 0 1-.9.2c-2.4-1.4-5.3-1.8-8.8-1a.6.6 0 1 1-.3-1.2c3.8-.9 7.1-.5 9.8 1.1.3.2.4.6.2.9zm1.2-2.7a.8.8 0 0 1-1.1.3c-2.7-1.7-6.9-2.2-10.1-1.2a.8.8 0 1 1-.5-1.5c3.7-1.1 8.3-.6 11.4 1.3.4.2.5.7.3 1.1zm.1-2.8C14.7 9 9.4 8.8 6.3 9.7a1 1 0 1 1-.6-1.8c3.5-1.1 9.4-.9 13.1 1.3a1 1 0 0 1-.9 1.7z"/>',
    youtube: '<path d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12 31 31 0 0 0 1 16.8a3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.8 31 31 0 0 0-.5-4.8zM9.7 15V9l5.8 3z"/>',
    pin: '<path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/>',
  };
  const svg = (k) => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[k]}</svg>`;
  const ext = (href) => (href.startsWith("http") ? ' target="_blank" rel="noopener"' : "");
  const contactItems = () => {
    const k = C.contact;
    return [
      ["phone", T("contact.phone"), k.phone, `tel:${String(k.phone).replace(/[^\d+]/g, "")}`],
      ["whatsapp", T("contact.whatsapp"), k.whatsapp && T("contact.waValue"), `https://wa.me/${k.whatsapp}`],
      ["mail", T("contact.mail"), k.bookingEmail, `mailto:${k.bookingEmail}`],
      ["instagram", "Instagram", k.instagram && `@${k.instagram}`, `https://instagram.com/${k.instagram}`],
      ["tiktok", "TikTok", k.tiktok && `@${k.tiktok}`, `https://www.tiktok.com/@${k.tiktok}`],
      ["soundcloud", "SoundCloud", k.soundcloud && T("contact.listen"), k.soundcloud],
      ["spotify", "Spotify", k.spotify && T("contact.listen"), k.spotify],
      ["youtube", "YouTube", k.youtube && T("contact.watch"), k.youtube],
    ].filter(([, , v]) => !isPh(v));
  };
  const music = () => (C.music || []).filter((m) => m && !isPh(m.embed));

  let logoImg = null, galleryList = [];

  async function render() {
    $$("[data-i18n]").forEach((el) => (el.textContent = T(el.dataset.i18n)));
    $$("#langBtn span").forEach((s) => s.classList.toggle("on", s.dataset.l === lang));
    $("#langBtn").setAttribute("aria-label", T("lang.label"));
    $("#soundLabel").textContent = T("sound.play");

    const [logo, hero, bioImg, banner] = await Promise.all([probe(C.logo.main), probe(C.heroImage), probe(C.bioImage), probe(C.banner)]);
    logoImg = logo;
    const name = esc(C.artist.name);
    if (logo) {
      $("#logoFallback").src = C.logo.main;
      $("#navLogo").innerHTML = `<img src="${C.logo.main}" alt="${name}">`;
      $("#footerLogo").innerHTML = `<img src="${C.logo.main}" alt="">`;
    }
    if (hero) $("#heroPerson").innerHTML = `<img src="${C.heroImage}" alt="" fetchpriority="high">`;

    // Hero
    const tag = tr(C.artist.tagline);
    if (isPh(tag)) $("#tagline").remove(); else $("#tagline").textContent = tag;
    const acts = [];
    if (contactItems().length) acts.push(`<a href="#booking" class="btn btn-primary">${T("hero.book")}</a>`);
    if (music().length) acts.push(`<a href="#music" class="btn btn-ghost">${T("hero.listen")}</a>`);
    else acts.push(`<a href="#photos" class="btn btn-ghost">${T("hero.photos")}</a>`);
    $("#heroActions").innerHTML = acts.join("");

    // Frase + cifras
    const short = tr(C.bio.short);
    const stats = (C.stats || []).filter((s) => +s.value > 0);
    if (isPh(short) && !stats.length) hideSection("statement");
    if (!isPh(short)) $("#statementText").innerHTML = short.split(/\s+/).map((w) => `<span class="w">${esc(w)}</span>`).join(" ");
    else $("#statementText").remove();
    if (stats.length) $("#stats").innerHTML = stats.map((s) =>
      `<div class="stat"><span class="stat-num" data-count="${+s.value}" data-suffix="${esc(s.suffix)}">${+s.value}${esc(s.suffix)}</span><span class="stat-label">${esc(tr(s.label))}</span></div>`).join("");
    else $("#stats").remove();

    if (banner) { $("#bannerImg").innerHTML = `<img src="${C.banner}" alt="${name}">`; $("#banner").hidden = false; }

    // Bio
    const long = (tr(C.bio.long) || []).filter((p) => !isPh(p));
    if (!long.length) hideSection("bio");
    else {
      const loc = tr(C.artist.location);
      $("#bioText").innerHTML = long.map((p) => `<p>${esc(p)}</p>`).join("") +
        (isPh(loc) ? "" : `<p class="bio-location">${svg("pin")}${esc(loc)}</p>`);
      if (bioImg) $("#bioPhoto").innerHTML = `<img src="${C.bioImage}" alt="${name}">`; else $("#bioPhoto").remove();
    }

    // Fotos
    const ok = await Promise.all(C.photos.map((p) => probe(p.src)));
    const photos = C.photos.filter((_, i) => ok[i]);
    galleryList = photos.map((p) => p.src);
    if (galleryList[0]) $(".lb-download").href = galleryList[0];
    const dls = (C.logo.downloads || []).map((l) =>
      `<a class="btn ${l.primary ? "btn-primary" : "btn-ghost"}" href="${l.src}" download>${esc(tr(l.label))}</a>`).join("");
    const panels = photos.map((p, i) => `
      <figure class="panel${p.wide ? " wide" : ""}" data-i="${i}" data-cursor="${T("cursor.view")}">
        <div class="panel-frame liquid"><img src="${p.src}" alt="${name}, foto ${i + 1}" loading="lazy" draggable="false"></div>
        <figcaption><span>${i + 1}/${photos.length}</span><a href="${p.src}" download>${T("photos.download")}</a></figcaption>
      </figure>`).join("");
    const dlPanel = dls ? `<div class="panel panel-dl">${logo ? `<img src="${C.logo.main}" alt="">` : ""}<h3>${T("photos.dlTitle")}</h3><p>${T("photos.dlText")}</p><div class="dl-list">${dls}</div></div>` : "";
    if (!panels && !dlPanel) hideSection("photos"); else $("#track").innerHTML = panels + dlPanel;

    // Música
    const mus = music();
    if (!mus.length) hideSection("music");
    else $("#musicGrid").innerHTML = mus.map((m) => `<iframe src="${esc(m.embed)}" loading="lazy" title="${esc(m.title)}" allow="autoplay; encrypted-media"></iframe>`).join("");

    // Salas
    const events = (C.events || []).filter((e) => e && !isPh(e.venue));
    if (!events.length) hideSection("venues");
    else $("#venueList").innerHTML = events.map((e) => {
      const meta = [e.date, e.city].filter((v) => !isPh(v)).map(esc).join(", ");
      return `<li><span class="venue">${esc(e.venue)}</span>${meta ? `<span class="venue-meta">${meta}</span>` : ""}</li>`;
    }).join("");

    // Rider
    const rider = (C.rider || []).map(tr).filter((r) => !isPh(r));
    if (!rider.length) hideSection("rider"); else $("#riderList").innerHTML = rider.map((r) => `<li>${esc(r)}</li>`).join("");

    // Booking
    const items = contactItems();
    if (!items.length) hideSection("booking");
    else {
      $("#contactList").innerHTML = items.map(([icon, label, value, href]) =>
        `<li><a href="${esc(href)}"${ext(href)}>${svg(icon)}<small>${esc(label)}</small><span>${esc(value)}</span></a></li>`).join("");
      $("#footerSocial").innerHTML = items.filter(([i]) => !["phone", "mail"].includes(i)).map(([icon, label, , href]) =>
        `<a href="${esc(href)}"${ext(href)} aria-label="${esc(label)}">${svg(icon)}</a>`).join("");
      setupForm();
    }
    $("#year").textContent = new Date().getFullYear();

    $$("#navLinks a").forEach((a) => { const t = document.querySelector(a.getAttribute("href")); if (!t || t.hidden) a.hidden = true; });
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
    for (let b = 0; b < branches; b++) {
      const ang = (b / branches) * Math.PI * 2 + (R() - 0.5) * 0.5;
      grow(cx, cy, ang, reach * (0.6 + R() * 0.6), 0, 1.6 + R());
    }
    svgEl.innerHTML = paths.map(([d, w]) => `<path d="${d}" stroke-width="${w.toFixed(2)}"/>`).join("");
    const els = $$("path", svgEl);
    els.forEach((p) => { const l = p.getTotalLength(); p.style.strokeDasharray = l; p.style.strokeDashoffset = l; });
    return els;
  }

  /* ===================== LOGO DE HIELO ===================== */
  let ice = null;
  function setupIce() {
    const box = $("#heroLogo"), canvas = $("#iceCanvas");
    if (logoImg) ice = window.IceLogo ? window.IceLogo(canvas, logoImg) : null;
    if (ice) {
      box.style.setProperty("--logo-ar", ice.aspect);
    } else {
      canvas.remove(); box.classList.add("fallback");
      if (logoImg) box.style.setProperty("--logo-ar", logoImg.naturalWidth / logoImg.naturalHeight);
    }
  }
  // Rectángulo donde se dibuja el logo (sin el margen del halo)
  function logoRect() {
    const r = $("#heroLogo").getBoundingClientRect();
    const px = ice ? ice.pad.x : 0.07, py = ice ? ice.pad.y : 0.07;
    return { left: r.left + r.width * px, top: r.top + r.height * py, width: r.width * (1 - 2 * px), height: r.height * (1 - 2 * py) };
  }

  /* ===================== INTRO ===================== */
  function playIntro(onReveal) {
    const intro = $("#intro");
    const skip = !animated || !logoImg || sess.get("pk-intro") === "1";
    if (skip) { intro.remove(); onReveal(false); return; }
    const count = $("#introCount"), prog = { v: 0 };
    const tick = () => (count.textContent = Math.round(prog.v));
    G.to(prog, { v: 88, duration: 1.1, ease: "power1.out", onUpdate: tick });
    const ready = Promise.race([Promise.all([document.fonts ? document.fonts.ready : 0]), new Promise((r) => setTimeout(r, 2500))]);
    Promise.all([ready, new Promise((r) => setTimeout(r, 900))]).then(() =>
      G.to(prog, { v: 100, duration: 0.3, onUpdate: tick, onComplete: assemble }));

    function assemble() {
      const r = logoRect(), wrap = $("#introShards");
      Object.assign(wrap.style, { left: r.left + "px", top: r.top + "px", width: r.width + "px", height: r.height + "px" });
      // Triangulación con jitter -> esquirlas
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

  // Entrada del resto de la portada
  function revealHero(fromIntro) {
    document.body.classList.remove("is-loading");
    if (ice && !fromIntro) ice.on = 1;
    const neon = $("#heroNeon");
    if (!animated) { neon.classList.add("on"); return; }
    const d = fromIntro ? 0.15 : 0;
    G.timeline({ delay: d })
      .from("#heroPerson img", { yPercent: 12, opacity: 0, duration: 1.4, ease: "expo.out" }, 0)
      .add(() => neon.classList.add("on"), 0.35)
      .from("#heroFoot > *", { y: 30, opacity: 0, duration: 1, ease: "expo.out", stagger: 0.1 }, 0.5)
      .from("#nav > *", { y: -30, opacity: 0, duration: 0.9, ease: "expo.out", stagger: 0.06, clearProps: "transform,opacity" }, 0.6)
      .from(".sound-btn", { y: 80, duration: 0.9, ease: "expo.out" }, 0.8);
    if (!fromIntro && ice) G.from(ice, { on: 0, duration: 0.8 });
    if (lenis) lenis.start();
  }

  /* ===================== SCROLL (Lenis + ScrollTrigger) ===================== */
  let lenis = null;
  function setupScroll() {
    if (!animated) return;
    if (window.Lenis) {
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
      .to("#heroFoot", { opacity: 0, y: -60, ease: "none", duration: 0.35 }, 0)
      .to(".hero-scroll", { opacity: 0, duration: 0.1 }, 0)
      .to(cracks, { strokeDashoffset: 0, ease: "power1.in", stagger: 0.01, duration: 0.5 }, 0.2)
      .to("#heroLogo", { opacity: 0, filter: "blur(10px)", ease: "none", duration: 0.3 }, 0.62)
      .to("#heroPerson", { opacity: 0, ease: "none", duration: 0.3 }, 0.7)
      .to(".hero-bg", { opacity: 0.2, ease: "none", duration: 0.3 }, 0.7)
      .to("#heroCracks", { opacity: 0, ease: "none", duration: 0.15 }, 0.9);

    // 2. Títulos: entran cortados en diagonal, como un golpe del logo
    $$(".h2").forEach((h) => G.fromTo(h,
      { clipPath: "polygon(-5% -30%, -5% -30%, -35% 130%, -35% 130%)", x: -40 },
      { clipPath: "polygon(-5% -30%, 140% -30%, 110% 130%, -35% 130%)", x: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: h, start: "top 86%" } }));

    // 3. Frase: las palabras se encienden al bajar
    const words = $$("#statementText .w");
    if (words.length) G.fromTo(words, { opacity: 0.38 }, { opacity: 1, ease: "none", stagger: 0.1,
      scrollTrigger: { trigger: "#statementText", start: "top 78%", end: "bottom 45%", scrub: true } });

    // 4. Cifras que cuentan
    $$("[data-count]").forEach((el) => {
      const o = { v: 0 }, target = +el.dataset.count, suf = el.dataset.suffix;
      el.textContent = "0" + suf;
      ST.create({ trigger: el, start: "top 85%", once: true, onEnter: () =>
        G.to(o, { v: target, duration: 2, ease: "power3.out", onUpdate: () => (el.textContent = Math.round(o.v) + suf) }) });
    });

    // 5. Banner y foto de bio con parallax
    if (!$("#banner").hidden) G.fromTo("#bannerImg img", { yPercent: -8 }, { yPercent: 8, ease: "none", scrollTrigger: { trigger: "#banner", scrub: true } });
    if ($("#bioPhoto img")) G.fromTo("#bioPhoto img", { yPercent: 8 }, { yPercent: -4, ease: "none", scrollTrigger: { trigger: "#bioPhoto", scrub: true } });

    // 6. Galería horizontal (escritorio)
    const mm = G.matchMedia();
    mm.add("(min-width: 901px)", () => {
      const track = $("#track"), sec = $("#photos");
      if (!track || sec.hidden) return;
      const dist = () => Math.max(0, track.scrollWidth - innerWidth);
      const move = G.to(track, { x: () => -dist(), ease: "none",
        scrollTrigger: { trigger: sec, start: "top top", end: () => "+=" + dist(), pin: true, scrub: 0.8, invalidateOnRefresh: true } });
      $$(".panel-frame img", track).forEach((img) => G.fromTo(img, { xPercent: -6 }, { xPercent: 6, ease: "none",
        scrollTrigger: { trigger: img.closest(".panel"), containerAnimation: move, start: "left right", end: "right left", scrub: true } }));
    });

    // 7. Salas: el nombre se rellena de hielo al bajar
    $$(".venue").forEach((v) => G.fromTo(v, { backgroundPosition: "100% 0" }, { backgroundPosition: "0% 0", ease: "none",
      scrollTrigger: { trigger: v, start: "top 88%", end: "top 48%", scrub: true } }));

    // 8. Rótulo de neón y logo final
    ST.create({ trigger: "#neonSign", start: "top 85%", once: true, onEnter: () => $("#neonSign").classList.add("lit") });
    if ($("#footerLogo img")) G.fromTo("#footerLogo img", { yPercent: 35, opacity: 0 }, { yPercent: 0, opacity: 0.92, ease: "none",
      scrollTrigger: { trigger: ".footer", start: "top bottom", end: "bottom bottom", scrub: true } });

    // Recalcular cuando cargan imágenes y fuentes
    addEventListener("load", () => ST.refresh());
    document.fonts?.ready.then(() => ST.refresh());
    if (document.readyState === "complete") requestAnimationFrame(() => ST.refresh());
  }

  // Enlaces internos con scroll suave
  function setupLinks() {
    const nav = $("#nav"), toggle = $("#navToggle");
    toggle.addEventListener("click", () => { const o = nav.classList.toggle("open"); toggle.setAttribute("aria-expanded", o); o ? lenis?.stop() : lenis?.start(); });
    document.addEventListener("click", (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href"), target = id === "#top" ? 0 : document.querySelector(id);
      if (target == null) return;
      e.preventDefault();
      if (nav.classList.contains("open")) { nav.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); lenis?.start(); }
      if (lenis) lenis.scrollTo(target, { duration: 1.6 });
      else window.scrollTo({ top: target === 0 ? 0 : target.getBoundingClientRect().top + scrollY, behavior: reduce ? "auto" : "smooth" });
    });
    $("#langBtn").addEventListener("click", () => {
      const next = lang === "es" ? "en" : "es";
      store.set("pk-lang", next);
      const u = new URL(location.href); u.searchParams.set("lang", next); location.href = u.toString();
    });
  }

  /* ===================== PUNTERO: luz del hielo, cursor, parallax, efecto líquido ===================== */
  function setupPointer() {
    const hero = $("#hero");
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
    const px = G.quickTo("#heroPerson img", "x", { duration: 1, ease: "power3" }), py = G.quickTo("#heroPerson img", "y", { duration: 1, ease: "power3" });
    addEventListener("pointermove", (e) => {
      qx(e.clientX); qy(e.clientY);
      const dx = e.clientX / innerWidth - 0.5, dy = e.clientY / innerHeight - 0.5;
      px(dx * -18); py(dy * -10);
    }, { passive: true });
    document.addEventListener("pointerover", (e) => {
      const lab = e.target.closest("[data-cursor]");
      const text = lab && lab.dataset.cursor;
      cur.classList.toggle("has-label", !!text);
      label.textContent = text || "";
      cur.classList.toggle("is-link", !text && !!e.target.closest("a, button, input, textarea, label"));
    });

    // Efecto líquido al pasar por las fotos
    const map = $("#liquidMap"), noise = $("#liquidNoise");
    let wobble = null;
    $$(".liquid").forEach((el) => {
      el.addEventListener("pointerenter", () => {
        el.classList.add("is-liquid");
        G.to(map, { attr: { scale: 34 }, duration: 0.7, ease: "power2.out", overwrite: true });
        wobble = G.to(noise, { attr: { baseFrequency: "0.011 0.02" }, duration: 1.4, ease: "sine.inOut", yoyo: true, repeat: -1 });
      });
      el.addEventListener("pointerleave", () => {
        wobble?.kill();
        G.to(map, { attr: { scale: 0 }, duration: 0.6, ease: "power2.out", overwrite: true, onComplete: () => el.classList.remove("is-liquid") });
      });
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
    const open = (i) => { show(i); lb.classList.add("open"); lb.setAttribute("aria-hidden", "false"); lenis?.stop(); $(".lb-close", lb).focus(); };
    const close = () => { lb.classList.remove("open"); lb.setAttribute("aria-hidden", "true"); lenis?.start(); };
    const track = $("#track");
    track?.addEventListener("pointerdown", (e) => (downX = e.clientX));
    track?.addEventListener("click", (e) => {
      const p = e.target.closest(".panel[data-i]");
      if (!p || e.target.closest("a") || Math.abs(e.clientX - downX) > 8) return;
      open(+p.dataset.i);
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

  /* ===================== BUCLE (hielo + bombo) ===================== */
  function startLoop() {
    let heroVisible = true;
    new IntersectionObserver(([e]) => (heroVisible = e.isIntersecting)).observe($("#hero"));
    const frame = () => {
      const k = Sound.kickLevel();
      root.style.setProperty("--kick", k.toFixed(3));
      if (ice && heroVisible) { ice.kick = k; ice.render(reduce ? 0 : performance.now() / 1000); }
    };
    if (G) G.ticker.add(frame); else { const raf = () => { frame(); requestAnimationFrame(raf); }; requestAnimationFrame(raf); }
  }

  /* ===================== ARRANQUE ===================== */
  async function init() {
    const yieldTask = () => new Promise((r) => setTimeout(r, 0)); // trocea el arranque en tareas cortas
    await render();
    await yieldTask();
    setupIce();
    await yieldTask();
    setupScroll();
    setupLinks();
    setupPointer();
    setupSound();
    setupLightbox();
    startLoop();
    playIntro(revealHero);
  }
  init().catch((e) => { console.error(e); $("#intro")?.remove(); document.body.classList.remove("is-loading"); });
})();
