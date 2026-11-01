(() => {
  const C = window.PRESSKIT;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  // Un dato es "hueco" si está vacío o sigue entre [corchetes]: no se muestra
  const isPh = (v) => v == null || String(v).trim() === "" || /^\s*\[.*\]\s*$/.test(String(v));
  const real = (arr) => (arr || []).filter((v) => !isPh(v));
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(pointer: fine)").matches;
  const BPM = C.artist.bpm || 128;
  const root = document.documentElement;

  document.body.classList.add("loading");
  root.style.setProperty("--beat", `${60 / BPM}s`);

  const probe = (src) => new Promise((res) => {
    if (!src) return res(false);
    const i = new Image();
    i.onload = () => res(true);
    i.onerror = () => res(false);
    i.src = src;
  });

  const hideSection = (id) => {
    const s = document.getElementById(id);
    if (s) s.hidden = true;
  };

  /* ===================== RENDER ===================== */
  let hasLogo = false;
  const textLogo = (extra = "") => `<span class="text-logo ${extra}">${esc(C.artist.name)}</span>`;
  const logoHTML = (cls = "") => hasLogo ? `<img src="${C.logo.main}" alt="${esc(C.artist.name)}" class="${cls}">` : textLogo(cls);

  async function renderLogos() {
    hasLogo = await probe(C.logo.main);
    const shine = hasLogo ? `<span class="logo-layer logo-shine" style="--logo:url('${C.logo.main}')"></span>` : "";
    $("#heroLogo").innerHTML = `<span class="logo-stack">${logoHTML("logo-layer logo-main")}${logoHTML("logo-layer logo-glitch g1")}${logoHTML("logo-layer logo-glitch g2")}${shine}</span>`;
    $("#heroLogo").setAttribute("aria-label", C.artist.name);
    $("#loaderLogo").innerHTML = logoHTML();
    $("#navLogo").innerHTML = logoHTML();
    $("#footerLogo").innerHTML = logoHTML();
  }

  const contactItems = () => {
    const k = C.contact;
    return [
      ["phone", "Teléfono", k.phone, `tel:${String(k.phone).replace(/[^\d+]/g, "")}`],
      ["whatsapp", "WhatsApp", k.whatsapp && "Escríbeme", `https://wa.me/${k.whatsapp}`],
      ["mail", "Email booking", k.bookingEmail, `mailto:${k.bookingEmail}`],
      ["instagram", "Instagram", k.instagram && `@${k.instagram}`, `https://instagram.com/${k.instagram}`],
      ["tiktok", "TikTok", k.tiktok && `@${k.tiktok}`, `https://www.tiktok.com/@${k.tiktok}`],
      ["soundcloud", "SoundCloud", k.soundcloud && "Escuchar", k.soundcloud],
      ["spotify", "Spotify", k.spotify && "Escuchar", k.spotify],
      ["youtube", "YouTube", k.youtube && "Ver vídeos", k.youtube],
    ].filter(([, , value]) => !isPh(value));
  };
  const music = () => (C.music || []).filter((m) => m && !isPh(m.embed));

  async function renderHero() {
    if (await probe(C.heroImage)) $("#heroPerson").innerHTML = `<img src="${C.heroImage}" alt="" fetchpriority="high">`;
    const tag = $("#tagline");
    if (isPh(C.artist.tagline)) tag.remove(); else tag.textContent = C.artist.tagline;
    const genres = real(C.artist.genres);
    if (genres.length) $("#genres").innerHTML = genres.map((g) => `<span class="chip">${esc(g)}</span>`).join("");
    else $("#genres").remove();

    const actions = [];
    if (contactItems().length) actions.push(`<a href="#contact" class="btn btn-primary magnetic">Contratar</a>`);
    if (music().length) actions.push(`<a href="#music" class="btn btn-ghost magnetic">Escuchar</a>`);
    actions.push(`<a href="#photos" class="btn ${actions.length ? "btn-ghost" : "btn-primary"} magnetic">Ver fotos</a>`);
    $("#heroActions").innerHTML = actions.slice(0, 2).join("");

    const city = isPh(C.artist.location) ? "" : C.artist.location.split(",")[0];
    const words = [C.artist.name, "DJ", ...genres, city, "Official Press Kit", "Booking"].filter(Boolean);
    const row = words.map((w) => `<span>${esc(w)}</span>`).join("");
    $("#marquee").innerHTML = row.repeat(4);
  }

  async function renderBio() {
    const short = isPh(C.bio.short) ? "" : C.bio.short;
    const long = real(C.bio.long);
    const stats = (C.stats || []).filter((s) => +s.value > 0);
    if (!short && !long.length && !stats.length) return hideSection("bio");

    if (!short && !long.length) $(".bio-grid").hidden = true;
    else {
      $("#bioShort").textContent = short;
      $("#bioLong").innerHTML = long.map((p, i) => `<p class="reveal" style="--d:${i * 0.1}s">${esc(p)}</p>`).join("");
      if (isPh(C.artist.location)) $("#location").remove(); else $("#location").textContent = `◉ ${C.artist.location}`;
      $("#bioPhoto").innerHTML = (await probe(C.bioImage)) ? `<img src="${C.bioImage}" alt="${esc(C.artist.name)}">` : "";
    }
    if (!stats.length) $("#stats").hidden = true;
    else $("#stats").innerHTML = stats.map((s, i) =>
      `<div class="stat neon-card reveal" style="--d:${i * 0.1}s"><strong data-count="${+s.value}" data-suffix="${esc(s.suffix)}">0${esc(s.suffix)}</strong><span>${esc(s.label)}</span></div>`).join("");
  }

  async function renderBanner() {
    if (!(await probe(C.banner))) return;
    $("#bannerImg").innerHTML = `<img src="${C.banner}" alt="${esc(C.artist.name)}">`;
    $("#banner").hidden = false;
  }

  function renderMusic() {
    const list = music();
    if (!list.length) return hideSection("music");
    $("#musicGrid").innerHTML = list.map((m, i) =>
      `<div class="music-card reveal" style="--d:${i * 0.1}s"><iframe src="${esc(m.embed)}" loading="lazy" allow="autoplay; encrypted-media" title="${esc(m.title)}"></iframe><h3>${esc(m.title)}</h3></div>`).join("");
  }

  let galleryList = [];
  async function renderGallery() {
    const ok = await Promise.all(C.photos.map((p) => probe(p.src)));
    const photos = C.photos.filter((_, i) => ok[i]);
    galleryList = photos.map((p) => p.src);
    if (photos.length) {
      $("#sliderStage").innerHTML = photos.map((p, i) =>
        `<figure class="slide${p.wide ? " wide" : ""}" data-i="${i}"><img src="${p.src}" alt="${esc(C.artist.name)} · foto de prensa ${i + 1}" draggable="false"></figure>`).join("");
      $("#sliderDots").innerHTML = photos.map((_, i) => `<button aria-label="Foto ${i + 1}" data-i="${i}"><span></span></button>`).join("");
    } else $("#slider").remove();
    const dls = (C.logo.downloads || []).map((l) =>
      `<a class="btn ${l.primary ? "btn-primary" : "btn-ghost"} magnetic" href="${l.src}" download>↓ ${esc(l.label)}</a>`).join("");
    const card = dls ? `<div class="dl-card neon-card reveal" style="--d:.2s"><div class="dl-logo">${logoHTML()}</div><div class="dl-body"><p>Logos y fotos en alta calidad, con fondo transparente, para carteles y flyers. Incluye ficha en PDF para promotores.</p><div class="dl-btns">${dls}</div></div></div>` : "";
    if (!photos.length && !card) return hideSection("photos");
    $("#gallery").innerHTML = card;
  }

  function renderEvents() {
    const events = (C.events || []).filter((e) => e && !isPh(e.venue));
    // Sin fechas ni ciudades -> lista de salas "Ha pinchado en"
    const venuesOnly = events.every((e) => isPh(e.date) && isPh(e.city));
    if (!events.length) hideSection("events");
    else {
      if (venuesOnly) { $("#events h2").textContent = "Ha pinchado en"; $("#eventsList").classList.add("venues"); }
      $("#eventsList").innerHTML = events.map((e, i) =>
        `<li class="reveal" style="--d:${i * 0.08}s"><span class="date">${venuesOnly ? String(i + 1).padStart(2, "0") : isPh(e.date) ? "" : esc(e.date)}</span><span class="venue">${esc(e.venue)}</span><span class="city">${isPh(e.city) ? "" : esc(e.city)}</span></li>`).join("");
    }

    const rider = real(C.rider);
    if (!rider.length) hideSection("rider");
    else $("#riderList").innerHTML = rider.map((r, i) =>
      `<li class="neon-card reveal" style="--d:${i * 0.08}s"><b>${String(i + 1).padStart(2, "0")}</b><span>${esc(r)}</span></li>`).join("");
  }

  const ICONS = {
    phone: '<path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z"/>',
    mail: '<path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4-8 5-8-5V6l8 5 8-5z"/>',
    whatsapp: '<path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-3.3-.8a11 11 0 0 1-4.3-3.8c-.3-.5-1-1.5-1-2.8s.7-2 .9-2.3c.3-.3.6-.3.8-.3h.6c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.3 0 .5l-.3.5-.4.4c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.2.5.1.6 0l.9-1c.2-.3.4-.2.7-.1l2 1c.3.1.5.2.5.3.1.1.1.6-.1 1.2z"/>',
    instagram: '<path d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4zM17.3 5.5a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4zM21.9 7.1c-.1-1.6-.4-3-1.6-4.2S17.7 1.3 16.1 1.2C14.4 1.1 9.6 1.1 7.9 1.2 6.3 1.3 4.9 1.6 3.7 2.8S2.1 5.5 2 7.1C1.9 8.8 1.9 15.2 2 16.9c.1 1.6.4 3 1.6 4.2s2.6 1.5 4.2 1.6c1.7.1 6.5.1 8.2 0 1.6-.1 3-.4 4.2-1.6s1.5-2.6 1.6-4.2c.1-1.7.1-8.1.1-9.8zm-2.2 11.6a3.3 3.3 0 0 1-1.9 1.9c-1.3.5-4.4.4-5.8.4s-4.5.1-5.8-.4a3.3 3.3 0 0 1-1.9-1.9c-.5-1.3-.4-4.4-.4-5.8s-.1-4.5.4-5.8A3.3 3.3 0 0 1 6.2 3.2c1.3-.5 4.4-.4 5.8-.4s4.5-.1 5.8.4a3.3 3.3 0 0 1 1.9 1.9c.5 1.3.4 4.4.4 5.8s.1 4.5-.4 5.8z"/>',
    tiktok: '<path d="M16.6 2h-3.3v13.4a2.9 2.9 0 1 1-2-2.8V9.2a6.2 6.2 0 1 0 5.3 6.2V8.6a7.6 7.6 0 0 0 4.4 1.4V6.7a4.4 4.4 0 0 1-4.4-4.4z"/>',
    soundcloud: '<path d="M1 14.5c0 1 .5 1.7 1 1.7s1-.7 1-1.7-.5-1.7-1-1.7-1 .7-1 1.7zm3-2.5v5h1v-5zm2-1.5v6.5h1v-6.5zm2-1v7.5h1V9.5zm2-1.5v9h1V8zm2.5-1.5V17h7a3.5 3.5 0 0 0 0-7 3.4 3.4 0 0 0-1.3.3A5.5 5.5 0 0 0 12.5 6.5z"/>',
    spotify: '<path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm4.6 14.4a.6.6 0 0 1-.9.2c-2.4-1.4-5.3-1.8-8.8-1a.6.6 0 1 1-.3-1.2c3.8-.9 7.1-.5 9.8 1.1.3.2.4.6.2.9zm1.2-2.7a.8.8 0 0 1-1.1.3c-2.7-1.7-6.9-2.2-10.1-1.2a.8.8 0 1 1-.5-1.5c3.7-1.1 8.3-.6 11.4 1.3.4.2.5.7.3 1.1zm.1-2.8C14.7 9 9.4 8.8 6.3 9.7a1 1 0 1 1-.6-1.8c3.5-1.1 9.4-.9 13.1 1.3a1 1 0 0 1-.9 1.7z"/>',
    youtube: '<path d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12 31 31 0 0 0 1 16.8a3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.8 31 31 0 0 0-.5-4.8zM9.7 15V9l5.8 3z"/>',
  };
  const linkAttrs = (href) => (href.startsWith("http") ? ' target="_blank" rel="noopener"' : "");

  function renderContact() {
    const items = contactItems();
    $("#year").textContent = new Date().getFullYear();
    if (!items.length) return hideSection("contact");

    const mail = $("#contactMail");
    if (isPh(C.contact.bookingEmail)) mail.remove();
    else { mail.textContent = C.contact.bookingEmail; mail.href = `mailto:${C.contact.bookingEmail}`; }

    // Si el email ya sale en grande, no se repite en tarjeta
    const cards = mail.isConnected ? items.filter(([icon]) => icon !== "mail") : items;
    $("#contactGrid").innerHTML = cards.map(([icon, label, value, href], i) =>
      `<a class="contact-card neon-card reveal" style="--d:${i * 0.06}s" href="${esc(href)}"${linkAttrs(href)}>
        <svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[icon]}</svg><div><small>${label}</small><span>${esc(value)}</span></div></a>`).join("");

    setupBookingForm();

    const social = items.filter(([icon]) => !["phone", "mail"].includes(icon));
    $("#footerSocial").innerHTML = social.map(([icon, label, , href]) =>
      `<a href="${esc(href)}"${linkAttrs(href)} aria-label="${label}"><svg viewBox="0 0 24 24">${ICONS[icon]}</svg></a>`).join("");
  }

  // Formulario de booking: abre WhatsApp o el email con el mensaje ya escrito
  function setupBookingForm() {
    const k = C.contact, form = $("#bookingForm"), err = $("#formError");
    const hasWa = !isPh(k.whatsapp), hasMail = !isPh(k.bookingEmail);
    if (!hasWa && !hasMail) return form.remove();
    $("#formActions").innerHTML =
      (hasWa ? `<button type="submit" class="btn btn-primary magnetic" data-via="wa">Enviar por WhatsApp</button>` : "") +
      (hasMail ? `<button type="submit" class="btn btn-ghost magnetic" data-via="mail">Enviar por email</button>` : "");
    let via = hasWa ? "wa" : "mail";
    $$("#formActions button").forEach((b) => b.addEventListener("click", () => (via = b.dataset.via)));
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const f = Object.fromEntries(new FormData(form));
      if (!f.nombre.trim() || !f.evento.trim()) { err.textContent = "Pon al menos tu nombre y la sala o evento."; return; }
      err.textContent = "";
      const fecha = f.fecha ? new Date(f.fecha + "T12:00").toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" }) : "";
      const lines = [
        `Hola ${C.artist.name}, quiero contratarte.`, "",
        `Nombre: ${f.nombre.trim()}`, `Sala / evento: ${f.evento.trim()}`,
        f.ciudad.trim() && `Ciudad: ${f.ciudad.trim()}`, fecha && `Fecha: ${fecha}`,
        f.mensaje.trim() && `\n${f.mensaje.trim()}`,
      ].filter((l) => l !== "" && l !== false);
      lines.splice(1, 0, "");
      const text = lines.join("\n");
      const url = via === "wa"
        ? `https://wa.me/${k.whatsapp}?text=${encodeURIComponent(text)}`
        : `mailto:${k.bookingEmail}?subject=${encodeURIComponent(`Booking ${C.artist.name}${fecha ? " · " + fecha : ""}`)}&body=${encodeURIComponent(text)}`;
      window.open(url, via === "wa" ? "_blank" : "_self");
    });
  }

  // Numera solo las secciones visibles y oculta del menú las que no hay
  function finalizeLayout() {
    $$(".section").filter((s) => !s.hidden).forEach((s, i) => { $(".num", s).textContent = String(i + 1).padStart(2, "0"); });
    $$("#navLinks a").forEach((a) => {
      const target = document.querySelector(a.getAttribute("href"));
      if (!target || target.hidden) a.hidden = true;
    });
  }

  /* ===================== SONIDO =====================
     Groove sintetizado en el navegador (WebAudio) al BPM de la config.
     Toda la web reacciona a cada bombo cuando está activado. */
  const Sound = (() => {
    let ctx, out, analyser, data, noise, timer, next = 0, step = 0, loop = 0, on = false;
    const s16 = 60 / BPM / 4;
    const kicks = [];
    const ROOTS = [55, 55, 43.65, 49];          // La · La · Fa · Sol
    function setup() {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      out = ctx.createGain(); out.gain.value = 0;
      const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -16; comp.ratio.value = 4;
      analyser = ctx.createAnalyser(); analyser.fftSize = 512; analyser.smoothingTimeConstant = 0.72;
      data = new Uint8Array(analyser.frequencyBinCount);
      out.connect(comp); comp.connect(analyser); analyser.connect(ctx.destination);
      noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
      const d = noise.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    const env = (g, t, peak, decay) => {
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(peak, t + 0.004);
      g.gain.exponentialRampToValueAtTime(0.0001, t + decay);
    };
    function kick(t) {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = "sine"; o.frequency.setValueAtTime(165, t); o.frequency.exponentialRampToValueAtTime(44, t + 0.11);
      env(g, t, 1, 0.42); o.connect(g); g.connect(out); o.start(t); o.stop(t + 0.45);
      kicks.push(t);
    }
    function hat(t, open, vol) {
      const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
      s.buffer = noise; f.type = "highpass"; f.frequency.value = 7500;
      env(g, t, vol, open ? 0.2 : 0.04); s.connect(f); f.connect(g); g.connect(out);
      s.start(t, Math.random() * 0.5); s.stop(t + 0.25);
    }
    function clap(t) {
      const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
      s.buffer = noise; f.type = "bandpass"; f.frequency.value = 1500; f.Q.value = 0.9;
      g.gain.setValueAtTime(0.0001, t);
      [0, 0.011, 0.022].forEach((o) => { g.gain.setValueAtTime(0.45, t + o); g.gain.exponentialRampToValueAtTime(0.06, t + o + 0.009); });
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
      s.connect(f); f.connect(g); g.connect(out); s.start(t); s.stop(t + 0.25);
    }
    function bass(t, freq) {
      const o = ctx.createOscillator(), f = ctx.createBiquadFilter(), g = ctx.createGain();
      o.type = "sawtooth"; o.frequency.value = freq;
      f.type = "lowpass"; f.Q.value = 7; f.frequency.setValueAtTime(950, t); f.frequency.exponentialRampToValueAtTime(140, t + 0.14);
      env(g, t, 0.3, s16 * 1.7); o.connect(f); f.connect(g); g.connect(out); o.start(t); o.stop(t + s16 * 2);
    }
    function stab(t, rootHz, bright) {
      const f = ctx.createBiquadFilter(), g = ctx.createGain();
      f.type = "lowpass"; f.Q.value = 5; f.frequency.setValueAtTime(1200 + bright * 2400, t); f.frequency.exponentialRampToValueAtTime(380, t + 0.26);
      env(g, t, 0.075, 0.32); f.connect(g); g.connect(out);
      [1, 1.189, 1.498].forEach((r) => {
        const o = ctx.createOscillator(); o.type = "sawtooth";
        o.frequency.value = rootHz * r; o.detune.value = (Math.random() - 0.5) * 16;
        o.connect(f); o.start(t); o.stop(t + 0.35);
      });
    }
    function schedule(st, t) {
      const s = st % 16, bar = Math.floor(st / 16) % 4, full = loop > 0;
      if (s % 4 === 0) kick(t);
      if (s % 4 === 2) { hat(t, true, 0.1); bass(t, ROOTS[bar]); }
      else hat(t, false, s % 2 ? 0.035 : 0.06);
      if (bar === 3 && s === 15) bass(t, ROOTS[bar] * 2);
      if (full && (s === 4 || s === 12)) clap(t);
      if (full && (s === 3 || s === 10)) stab(t, ROOTS[bar] * 4, (loop % 4) / 3);
    }
    function tick() {
      while (next < ctx.currentTime + 0.12) {
        schedule(step, next);
        next += s16; step = (step + 1) % 64;
        if (step === 0) loop++;
      }
    }
    function start() {
      if (!ctx) setup();
      ctx.resume();
      const t = ctx.currentTime;
      next = t + 0.06; step = 0; loop = 0; kicks.length = 0;
      out.gain.cancelScheduledValues(t); out.gain.setValueAtTime(out.gain.value, t); out.gain.linearRampToValueAtTime(0.55, t + 0.4);
      clearInterval(timer); timer = setInterval(tick, 25); tick();
      on = true;
    }
    function stop() {
      if (!ctx) return;
      on = false; clearInterval(timer);
      const t = ctx.currentTime;
      out.gain.cancelScheduledValues(t); out.gain.setValueAtTime(out.gain.value, t); out.gain.linearRampToValueAtTime(0, t + 0.3);
    }
    function kickLevel() {
      if (!on) return 0;
      const now = ctx.currentTime;
      while (kicks.length > 1 && kicks[1] <= now) kicks.shift();
      const k = kicks[0];
      return k == null || k > now ? 0 : Math.exp(-(now - k) * 8);
    }
    function spectrum() { if (!on) return null; analyser.getByteFrequencyData(data); return data; }
    return { start, stop, kickLevel, spectrum, get on() { return on; } };
  })();

  function setupSound() {
    const btn = $("#soundBtn"), label = $("#soundLabel");
    const set = (on) => {
      document.body.classList.toggle("playing", on);
      btn.setAttribute("aria-pressed", on);
      label.textContent = on ? "Sound on" : "Play";
    };
    btn.addEventListener("click", () => {
      if (Sound.on) { Sound.stop(); set(false); } else { Sound.start(); set(true); }
    });
    document.addEventListener("visibilitychange", () => { if (document.hidden && Sound.on) { Sound.stop(); set(false); } });
  }

  /* ===================== ANIMACIONES ===================== */
  const tickers = [];
  const frame = (t) => { tickers.forEach((f) => f(t)); requestAnimationFrame(frame); };

  // Nivel del bombo -> variable CSS --kick (0..1) para que todo lata
  let kick = 0;
  tickers.push(() => {
    kick = Sound.kickLevel();
    root.style.setProperty("--kick", kick.toFixed(3));
  });

  const SCRAMBLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#/\\_-=+*<>";
  function scramble(el) {
    const final = el.textContent, start = performance.now(), dur = 750;
    const step = (t) => {
      const p = Math.min((t - start) / dur, 1), n = Math.floor(p * final.length);
      el.textContent = final.slice(0, n) + [...final.slice(n)].map((c) => (c === " " ? " " : SCRAMBLE[(Math.random() * SCRAMBLE.length) | 0])).join("");
      if (p < 1) requestAnimationFrame(step); else el.textContent = final;
    };
    requestAnimationFrame(step);
  }

  function setupReveal() {
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      el.classList.add("in");
      const n = el.querySelector("[data-count]");
      if (n) countUp(n);
      if (el.matches(".section-head") && !reduceMotion) scramble($("h2", el));
      io.unobserve(el);
    }), { threshold: 0.15 });
    $$(".reveal").forEach((el) => io.observe(el));
  }

  function countUp(el) {
    const target = +el.dataset.count, suffix = el.dataset.suffix, t0 = performance.now(), dur = 1800;
    const step = (t) => {
      const p = Math.min((t - t0) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 4))) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  function setupNav() {
    const nav = $("#nav"), bar = $("#progress");
    const onScroll = () => {
      nav.classList.toggle("scrolled", scrollY > 40);
      const max = document.documentElement.scrollHeight - innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
    };
    addEventListener("scroll", onScroll, { passive: true }); onScroll();
    $("#navToggle").onclick = () => nav.classList.toggle("open");
    $("#navLinks").onclick = (e) => { if (e.target.tagName === "A") nav.classList.remove("open"); };
  }

  function setupPointer() {
    const glow = $("#cursorGlow"), ring = $("#cursorRing"), bg = $("#heroBg"), logo = $("#heroLogo"), person = $("#heroPerson");
    const banner = $("#bannerImg");
    let mx = innerWidth / 2, my = innerHeight / 2, gx = mx, gy = my, rx = mx, ry = my;
    addEventListener("pointermove", (e) => { mx = e.clientX; my = e.clientY; ring.classList.add("on"); });
    document.addEventListener("pointerleave", () => ring.classList.remove("on"));
    document.addEventListener("pointerover", (e) => ring.classList.toggle("hover", !!e.target.closest("a, button, figure")));
    tickers.push(() => {
      gx += (mx - gx) * 0.12; gy += (my - gy) * 0.12;
      rx += (mx - rx) * 0.25; ry += (my - ry) * 0.25;
      glow.style.transform = `translate(${gx - 250}px, ${gy - 250}px)`;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%) scale(${1 + kick * 0.5})`;
      const dx = mx / innerWidth - 0.5, dy = my / innerHeight - 0.5;
      const sy = Math.min(scrollY, innerHeight);
      bg.style.transform = `translate(${dx * -20}px, ${dy * -20 + sy * 0.3}px) scale(1.05)`;
      logo.style.transform = `translate(${dx * 18}px, ${dy * 14 - sy * 0.15}px) rotateX(${dy * -8}deg) rotateY(${dx * 8}deg)`;
      person.style.transform = `translate(calc(-50% + ${dx * -10}px), ${sy * 0.12}px)`;
      if (!banner.parentElement.hidden && banner.firstChild) {
        const r = banner.parentElement.getBoundingClientRect();
        if (r.bottom > 0 && r.top < innerHeight) banner.firstChild.style.transform = `translateY(${((r.top + r.height / 2) / innerHeight - 0.5) * -70}px) scale(1.14)`;
      }
    });

    // Inclinación 3D (propiedad "rotate", independiente de las demás animaciones)
    $$(".tilt").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        const a = Math.hypot(x, y) * 16;
        el.style.rotate = a < 0.05 ? "none" : `${-y} ${x} 0 ${a}deg`;
      });
      el.addEventListener("pointerleave", () => (el.style.rotate = ""));
    });

    // Botones magnéticos
    $$(".magnetic, .sound-btn").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        el.style.translate = `${(e.clientX - r.left - r.width / 2) * 0.25}px ${(e.clientY - r.top - r.height / 2) * 0.35}px`;
      });
      el.addEventListener("pointerleave", () => (el.style.translate = ""));
    });
  }

  function setupParticles() {
    const cv = $("#particles"), ctx = cv.getContext("2d"), dpr = Math.min(devicePixelRatio, 2);
    let W, H, pts;
    const resize = () => {
      W = cv.width = innerWidth * dpr; H = cv.height = innerHeight * dpr;
      cv.style.width = innerWidth + "px"; cv.style.height = innerHeight + "px";
      const n = Math.min(90, Math.floor(innerWidth / 16));
      pts = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3, r: Math.random() * 1.6 + 0.4 }));
    };
    resize(); addEventListener("resize", resize);
    const link = 130 * dpr;
    tickers.push(() => {
      ctx.clearRect(0, 0, W, H);
      const m = 1 + kick * 6;
      for (const p of pts) {
        p.x = (p.x + p.vx * m + W) % W; p.y = (p.y + p.vy * m + H) % H;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * dpr * (1 + kick * 0.8), 0, 7);
        ctx.fillStyle = `rgba(169,212,255,${0.55 + kick * 0.4})`; ctx.fill();
      }
      ctx.lineWidth = dpr * 0.6;
      for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
        const a = pts[i], b = pts[j], d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < link) {
          ctx.strokeStyle = `rgba(77,163,255,${(1 - d / link) * (0.18 + kick * 0.3)})`;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
    });
  }

  // Ecualizador: simulado al BPM, o espectro real cuando suena la música
  function setupEQ() {
    const cv = $("#eq"), ctx = cv.getContext("2d"), dpr = Math.min(devicePixelRatio, 2);
    const beatMs = 60000 / BPM;
    let W, H, bars, visible = true;
    const resize = () => { W = cv.width = cv.offsetWidth * dpr; H = cv.height = cv.offsetHeight * dpr; bars = Math.floor(cv.offsetWidth / 9); };
    resize(); addEventListener("resize", resize);
    new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(cv);
    const seeds = Array.from({ length: 400 }, () => Math.random());
    tickers.push((t) => {
      if (!visible) return;
      ctx.clearRect(0, 0, W, H);
      const spec = Sound.spectrum();
      const phase = (t % beatMs) / beatMs, sim = Math.pow(1 - phase, 3);
      const bw = W / bars;
      const grad = ctx.createLinearGradient(0, H, 0, 0);
      grad.addColorStop(0, "rgba(31,111,235,.95)"); grad.addColorStop(0.6, "rgba(77,163,255,.55)"); grad.addColorStop(1, "rgba(169,212,255,.15)");
      ctx.fillStyle = grad;
      for (let i = 0; i < bars; i++) {
        const x = i / bars;
        let h;
        if (spec) {
          const d = Math.abs(x - 0.5) * 2;
          const bin = 1 + Math.floor(d * spec.length * 0.42);
          h = H * Math.max(0.03, (spec[bin] / 255) * (0.75 + seeds[i] * 0.25));
        } else {
          const center = 1 - Math.abs(x - 0.5) * 1.6;
          const wave = 0.5 + 0.5 * Math.sin(t / 380 + i * 0.35 + seeds[i] * 6) * Math.cos(t / 900 + i * 0.12);
          h = H * Math.max(0.04, (0.15 + wave * 0.45 + sim * 0.4 * (x < 0.25 || x > 0.75 ? 1.3 : 0.7)) * Math.max(center, 0.25));
        }
        ctx.fillRect(i * bw + bw * 0.2, H - h, bw * 0.6, h);
      }
    });
  }

  /* Slider 3D (coverflow): autoplay, arrastrar, flechas, puntos y teclado */
  let openLightbox = () => {};
  function setupSlider() {
    const slider = $("#slider");
    if (!slider) return;
    const slides = $$(".slide", slider), dots = $$(".slider-dots button", slider), n = slides.length;
    let cur = 0, timer = null, hover = false, visible = false;
    const AUTOPLAY = 4500;
    const render = () => {
      slides.forEach((s, i) => {
        let o = i - cur;
        if (o > n / 2) o -= n;
        if (o < -n / 2) o += n;
        const a = Math.abs(o);
        s.style.setProperty("--o", o);
        s.style.setProperty("--a", a);
        s.style.zIndex = 20 - a;
        s.classList.toggle("active", o === 0);
        s.style.opacity = a > 2 ? 0 : 1;
        s.style.pointerEvents = a > 2 ? "none" : "auto";
        s.setAttribute("aria-hidden", o !== 0);
      });
      dots.forEach((d, i) => d.classList.toggle("on", i === cur));
      slider.style.setProperty("--autoplay", `${AUTOPLAY}ms`);
    };
    const go = (i) => { cur = (i + n) % n; render(); restart(); };
    const restart = () => {
      clearTimeout(timer);
      dots.forEach((d) => d.classList.remove("run"));
      if (hover || !visible || reduceMotion) return;
      void slider.offsetWidth;
      dots[cur]?.classList.add("run");
      timer = setTimeout(() => go(cur + 1), AUTOPLAY);
    };
    $(".prev", slider).onclick = () => go(cur - 1);
    $(".next", slider).onclick = () => go(cur + 1);
    dots.forEach((d) => (d.onclick = () => go(+d.dataset.i)));
    slider.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") go(cur - 1);
      if (e.key === "ArrowRight") go(cur + 1);
      if (e.key === "Enter") openLightbox(cur);
    });
    slider.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") { hover = true; restart(); } });
    slider.addEventListener("pointerleave", () => { hover = false; restart(); });
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; restart(); }, { threshold: 0.3 }).observe(slider);

    // Arrastrar / deslizar
    let sx = null, moved = false;
    const stage = $("#sliderStage");
    stage.addEventListener("pointerdown", (e) => { sx = e.clientX; moved = false; });
    addEventListener("pointerup", (e) => {
      if (sx == null) return;
      const dx = e.clientX - sx; sx = null;
      if (Math.abs(dx) > 40) { moved = true; go(cur + (dx < 0 ? 1 : -1)); }
    });
    stage.addEventListener("click", (e) => {
      const s = e.target.closest(".slide");
      if (!s || moved) return;
      const i = +s.dataset.i;
      if (i === cur) openLightbox(i); else go(i);
    });
    render();
  }

  function setupLightbox() {
    const lb = $("#lightbox"), img = $("img", lb), dl = $(".lb-download", lb), count = $(".lb-count", lb);
    let idx = 0;
    const show = (i) => {
      idx = (i + galleryList.length) % galleryList.length;
      img.src = dl.href = galleryList[idx];
      count.textContent = `${idx + 1} / ${galleryList.length}`;
    };
    const close = () => { lb.classList.remove("open"); lb.setAttribute("aria-hidden", "true"); };
    openLightbox = (i) => { show(i); lb.classList.add("open"); lb.setAttribute("aria-hidden", "false"); };
    $(".lb-prev", lb).onclick = (e) => { e.stopPropagation(); show(idx - 1); };
    $(".lb-next", lb).onclick = (e) => { e.stopPropagation(); show(idx + 1); };
    lb.addEventListener("click", (e) => { if (e.target === lb || e.target.classList.contains("lb-close")) close(); });
    addEventListener("keydown", (e) => {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(idx - 1);
      if (e.key === "ArrowRight") show(idx + 1);
    });
    let sx = null; // deslizar en móvil
    lb.addEventListener("touchstart", (e) => (sx = e.touches[0].clientX), { passive: true });
    lb.addEventListener("touchend", (e) => {
      if (sx == null) return;
      const dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1));
      sx = null;
    });
  }

  async function init() {
    await renderLogos();
    await Promise.all([renderHero(), renderBio(), renderGallery(), renderBanner()]);
    renderMusic(); renderEvents(); renderContact();
    finalizeLayout();
    setupNav(); setupLightbox(); setupSlider(); setupReveal(); setupSound();
    if (!reduceMotion) {
      setupParticles(); setupEQ();
      if (finePointer) { setupPointer(); setupTrail(); }
    }
    requestAnimationFrame(frame);
    finishLoader();
  }

  // Contador 00 -> 100 del loader
  function finishLoader() {
    const dur = reduceMotion ? 0 : 1300, t0 = performance.now(), count = $("#loaderCount"), fill = $("#loaderFill");
    const step = (t) => {
      const p = dur ? Math.min((t - t0) / dur, 1) : 1, v = Math.round(100 * (1 - Math.pow(1 - p, 2)));
      count.textContent = String(v).padStart(2, "0");
      fill.style.transform = `scaleX(${v / 100})`;
      if (p < 1) return requestAnimationFrame(step);
      $("#loader").classList.add("done"); document.body.classList.remove("loading");
    };
    requestAnimationFrame(step);
  }

  // Estela de neón que sigue al ratón
  function setupTrail() {
    const cv = $("#trail"), ctx = cv.getContext("2d"), dpr = Math.min(devicePixelRatio, 2);
    const pts = [];
    const resize = () => { cv.width = innerWidth * dpr; cv.height = innerHeight * dpr; cv.style.width = innerWidth + "px"; cv.style.height = innerHeight + "px"; };
    resize(); addEventListener("resize", resize);
    addEventListener("pointermove", (e) => pts.push({ x: e.clientX * dpr, y: e.clientY * dpr, t: performance.now() }));
    tickers.push((t) => {
      while (pts.length && t - pts[0].t > 350) pts.shift();
      ctx.clearRect(0, 0, cv.width, cv.height);
      if (pts.length < 2) return;
      ctx.lineCap = ctx.lineJoin = "round";
      for (const [w, col, blur] of [[7 * dpr, "rgba(31,111,235,.35)", 18], [2.2 * dpr, "rgba(200,230,255,.95)", 8]]) {
        ctx.shadowColor = "#4da3ff"; ctx.shadowBlur = blur * dpr;
        for (let i = 1; i < pts.length; i++) {
          const life = 1 - (t - pts[i].t) / 350;
          ctx.globalAlpha = Math.max(0, life);
          ctx.lineWidth = w * (0.3 + life * 0.7 + kick * 0.6);
          ctx.strokeStyle = col;
          ctx.beginPath(); ctx.moveTo(pts[i - 1].x, pts[i - 1].y); ctx.lineTo(pts[i].x, pts[i].y); ctx.stroke();
        }
      }
      ctx.globalAlpha = 1; ctx.shadowBlur = 0;
    });
  }
  init();
})();
