(() => {
  const C = window.PRESSKIT;
  const $ = (s, el = document) => el.querySelector(s);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.body.classList.add("loading");
  document.title = `${C.artist.name} · Press Kit`;
  document.documentElement.style.setProperty("--beat", `${60 / (C.artist.bpm || 128)}s`);

  // Comprueba si una imagen existe
  const probe = (src) => new Promise((res) => {
    if (!src) return res(false);
    const i = new Image();
    i.onload = () => res(true);
    i.onerror = () => res(false);
    i.src = src;
  });

  const textLogo = (extra = "") => `<span class="text-logo ${extra}">${esc(C.artist.name)}</span>`;

  async function renderLogos() {
    const hasLogo = await probe(C.logo.main);
    const alt = esc(C.artist.name);
    const main = (cls = "") => hasLogo ? `<img src="${C.logo.main}" alt="${alt}" class="${cls}">` : textLogo(cls);
    // Capa de brillo recortada con la forma del logo
    const shine = hasLogo ? `<div class="logo-layer logo-shine" style="--logo:url('${C.logo.main}')"></div>` : "";
    $("#heroLogo").innerHTML = `<div class="logo-stack">${main("logo-layer logo-main")}${main("logo-layer logo-glitch g1")}${main("logo-layer logo-glitch g2")}${shine}</div>`;
    $("#loaderLogo").innerHTML = main();
    $("#navLogo").innerHTML = main();
    $("#footerLogo").innerHTML = main();
  }

  async function renderHero() {
    if (await probe(C.heroImage)) {
      $("#heroPerson").innerHTML = `<img src="${C.heroImage}" alt="${esc(C.artist.name)}">`;
    }
    $("#tagline").textContent = C.artist.tagline;
    $("#genres").innerHTML = C.artist.genres.map((g) => `<span class="chip">${esc(g)}</span>`).join("");
    const words = [C.artist.name, ...C.artist.genres, "Press Kit", "Booking"];
    const row = words.map((w) => `<span>${esc(w)}</span>`).join("");
    $("#marquee").innerHTML = row + row + row + row;
  }

  async function renderBio() {
    $("#bioShort").textContent = C.bio.short;
    $("#bioLong").innerHTML = C.bio.long.map((p, i) => `<p class="reveal" style="--d:${i * 0.1}s">${esc(p)}</p>`).join("");
    $("#location").textContent = `◉ ${C.artist.location}`;
    const photo = C.bioImage;
    $("#bioPhoto").innerHTML = (await probe(photo)) ? `<img src="${photo}" alt="${esc(C.artist.name)}">` : `<div class="ph">Tu foto<br>${esc(photo)}</div>`;
    $("#stats").innerHTML = C.stats.map((s, i) =>
      `<div class="stat reveal" style="--d:${i * 0.1}s"><strong data-count="${s.value}" data-suffix="${esc(s.suffix)}">0${esc(s.suffix)}</strong><span>${esc(s.label)}</span></div>`).join("");
  }

  async function renderBanner() {
    if (!(await probe(C.banner))) return;
    $("#bannerImg").innerHTML = `<img src="${C.banner}" alt="${esc(C.artist.name)}">`;
    $("#banner").hidden = false;
    const sec = $("#banner"), img = $("#bannerImg img");
    addEventListener("scroll", () => {
      const r = sec.getBoundingClientRect(), p = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
      img.style.transform = `translateY(${p * -60}px) scale(1.12)`;
    }, { passive: true });
  }

  function renderMusic() {
    const grid = $("#musicGrid");
    if (!C.music.length) {
      grid.innerHTML = `<div class="music-empty reveal"><div class="vinyl"></div><p>Añade tus sets en <code>config.js → music</code> (embeds de SoundCloud, Spotify, YouTube o Mixcloud).</p></div>`;
      return;
    }
    grid.innerHTML = C.music.map((m, i) =>
      `<div class="music-card reveal" style="--d:${i * 0.1}s"><iframe src="${esc(m.embed)}" loading="lazy" allow="autoplay; encrypted-media"></iframe><h3>${esc(m.title)}</h3></div>`).join("");
  }

  async function renderGallery() {
    const ok = await Promise.all(C.photos.map((p) => probe(p.src)));
    const figs = C.photos.map((p, i) => {
      const cls = `reveal${p.wide ? " wide" : ""}`, d = `--d:${(i % 3) * 0.1}s`;
      return ok[i]
        ? `<figure class="${cls}" style="${d}" data-src="${p.src}"><img src="${p.src}" alt="${esc(C.artist.name)} · foto de prensa ${i + 1}" loading="lazy"></figure>`
        : `<figure class="${cls}" style="${d}"><div class="ph">Foto ${i + 1}<br>${esc(p.src)}</div></figure>`;
    }).join("");
    const dls = (C.logo.downloads || []).map((l) => `<a class="btn btn-ghost" href="${l.src}" download>↓ ${esc(l.label)}</a>`).join("");
    const card = dls ? `<div class="dl-card reveal" style="--d:.2s"><div class="dl-logo"><img src="${C.logo.main}" alt=""></div><p>Logos en alta calidad para carteles y flyers</p>${dls}</div>` : "";
    $("#gallery").innerHTML = figs + card;
  }

  function renderEvents() {
    $("#eventsList").innerHTML = C.events.map((e, i) =>
      `<li class="reveal" style="--d:${i * 0.08}s"><span class="date">${esc(e.date)}</span><span class="venue">${esc(e.venue)}</span><span class="city">${esc(e.city)}</span></li>`).join("");
    $("#riderList").innerHTML = C.rider.map((r, i) =>
      `<li class="reveal" style="--d:${i * 0.08}s"><b>${String(i + 1).padStart(2, "0")}</b><span>${esc(r)}</span></li>`).join("");
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
  const isPlaceholder = (v) => !v || /^\[.*\]$/.test(v);

  function renderContact() {
    const k = C.contact;
    const mail = $("#contactMail");
    mail.textContent = k.bookingEmail;
    if (!isPlaceholder(k.bookingEmail)) mail.href = `mailto:${k.bookingEmail}`;
    const items = [
      ["phone", "Teléfono", k.phone, `tel:${String(k.phone).replace(/[^\d+]/g, "")}`],
      ["whatsapp", "WhatsApp", k.whatsapp ? `+${k.whatsapp}` : "", `https://wa.me/${k.whatsapp}`],
      ["mail", "Email booking", k.bookingEmail, `mailto:${k.bookingEmail}`],
      ["instagram", "Instagram", k.instagram ? `@${k.instagram}` : "", `https://instagram.com/${k.instagram}`],
      ["tiktok", "TikTok", k.tiktok ? `@${k.tiktok}` : "", `https://www.tiktok.com/@${k.tiktok}`],
      ["soundcloud", "SoundCloud", k.soundcloud ? "Escuchar" : "", k.soundcloud],
      ["spotify", "Spotify", k.spotify ? "Escuchar" : "", k.spotify],
      ["youtube", "YouTube", k.youtube ? "Ver vídeos" : "", k.youtube],
    ];
    $("#contactGrid").innerHTML = items.map(([icon, label, value, href], i) => {
      const empty = isPlaceholder(value);
      const ext = href && href.startsWith("http") ? ' target="_blank" rel="noopener"' : "";
      return `<a class="contact-card reveal${empty ? " empty" : ""}" style="--d:${i * 0.06}s" ${empty ? "" : `href="${esc(href)}"${ext}`}>
        <svg viewBox="0 0 24 24">${ICONS[icon]}</svg><div><small>${label}</small><span>${esc(value || "Añadir en config.js")}</span></div></a>`;
    }).join("");
    $("#year").textContent = new Date().getFullYear();
  }

  // ---------- Animaciones ----------
  function setupReveal() {
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("in");
      const n = e.target.querySelector("[data-count]");
      if (n) countUp(n);
      io.unobserve(e.target);
    }), { threshold: 0.15 });
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
  }

  function countUp(el) {
    const target = +el.dataset.count, suffix = el.dataset.suffix, t0 = performance.now(), dur = 1800;
    const step = (t) => {
      const p = Math.min((t - t0) / dur, 1), v = Math.round(target * (1 - Math.pow(1 - p, 4)));
      el.textContent = v + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  function setupNav() {
    const nav = $("#nav");
    addEventListener("scroll", () => nav.classList.toggle("scrolled", scrollY > 40), { passive: true });
    $("#navToggle").onclick = () => nav.classList.toggle("open");
    $("#navLinks").onclick = (e) => { if (e.target.tagName === "A") nav.classList.remove("open"); };
  }

  function setupCursorAndParallax() {
    const glow = $("#cursorGlow"), bg = $("#heroBg"), logo = $("#heroLogo"), person = $("#heroPerson");
    let mx = innerWidth / 2, my = innerHeight / 2, gx = mx, gy = my;
    addEventListener("pointermove", (e) => { mx = e.clientX; my = e.clientY; });
    const loop = () => {
      gx += (mx - gx) * 0.12; gy += (my - gy) * 0.12;
      glow.style.left = gx + "px"; glow.style.top = gy + "px";
      const dx = (mx / innerWidth - 0.5), dy = (my / innerHeight - 0.5);
      const sy = Math.min(scrollY, innerHeight);
      bg.style.transform = `translate(${dx * -20}px, ${dy * -20 + sy * 0.3}px) scale(1.05)`;
      logo.style.transform = `translate(${dx * 18}px, ${dy * 14 - sy * 0.15}px) rotateX(${dy * -8}deg) rotateY(${dx * 8}deg)`;
      person.style.transform = `translate(calc(-50% + ${dx * -10}px), ${sy * 0.12}px)`;
      requestAnimationFrame(loop);
    };
    loop();
    document.querySelectorAll(".tilt").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(900px) rotateY(${x * 10}deg) rotateX(${y * -10}deg)`;
      });
      el.addEventListener("pointerleave", () => (el.style.transform = ""));
    });
  }

  function setupParticles() {
    const cv = $("#particles"), ctx = cv.getContext("2d");
    let W, H, pts;
    const resize = () => {
      W = cv.width = innerWidth * devicePixelRatio; H = cv.height = innerHeight * devicePixelRatio;
      cv.style.width = innerWidth + "px"; cv.style.height = innerHeight + "px";
      const n = Math.min(90, Math.floor(innerWidth / 16));
      pts = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3, r: Math.random() * 1.6 + 0.4 }));
    };
    resize(); addEventListener("resize", resize);
    const link = 130 * devicePixelRatio;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      for (const p of pts) {
        p.x = (p.x + p.vx + W) % W; p.y = (p.y + p.vy + H) % H;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * devicePixelRatio, 0, 7); ctx.fillStyle = "rgba(169,212,255,.6)"; ctx.fill();
      }
      for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
        const a = pts[i], b = pts[j], d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < link) { ctx.strokeStyle = `rgba(77,163,255,${(1 - d / link) * 0.18})`; ctx.lineWidth = devicePixelRatio * 0.6; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
      }
      requestAnimationFrame(draw);
    };
    draw();
  }

  // Ecualizador sincronizado al BPM
  function setupEQ() {
    const cv = $("#eq"), ctx = cv.getContext("2d");
    const beatMs = 60000 / (C.artist.bpm || 128);
    let W, H, bars;
    const resize = () => { W = cv.width = cv.offsetWidth * devicePixelRatio; H = cv.height = cv.offsetHeight * devicePixelRatio; bars = Math.floor(cv.offsetWidth / 9); };
    resize(); addEventListener("resize", resize);
    const seeds = Array.from({ length: 400 }, () => Math.random());
    const draw = (t) => {
      ctx.clearRect(0, 0, W, H);
      const phase = (t % beatMs) / beatMs, kick = Math.pow(1 - phase, 3);
      const bw = W / bars;
      const grad = ctx.createLinearGradient(0, H, 0, 0);
      grad.addColorStop(0, "rgba(31,111,235,.9)"); grad.addColorStop(0.6, "rgba(77,163,255,.5)"); grad.addColorStop(1, "rgba(169,212,255,.1)");
      ctx.fillStyle = grad;
      for (let i = 0; i < bars; i++) {
        const x = i / bars, center = 1 - Math.abs(x - 0.5) * 1.6;
        const wave = 0.5 + 0.5 * Math.sin(t / 380 + i * 0.35 + seeds[i] * 6) * Math.cos(t / 900 + i * 0.12);
        const h = H * Math.max(0.04, (0.15 + wave * 0.45 + kick * 0.4 * (x < 0.25 || x > 0.75 ? 1.3 : 0.7)) * Math.max(center, 0.25));
        ctx.fillRect(i * bw + bw * 0.2, H - h, bw * 0.6, h);
      }
      requestAnimationFrame(draw);
    };
    requestAnimationFrame(draw);
  }

  function setupLightbox() {
    const lb = $("#lightbox"), img = $("img", lb), dl = $(".lb-download", lb);
    $("#gallery").addEventListener("click", (e) => {
      const fig = e.target.closest("figure[data-src]");
      if (!fig) return;
      img.src = dl.href = fig.dataset.src;
      lb.classList.add("open");
    });
    lb.addEventListener("click", (e) => { if (e.target !== img && e.target !== dl) lb.classList.remove("open"); });
    addEventListener("keydown", (e) => { if (e.key === "Escape") lb.classList.remove("open"); });
  }

  async function init() {
    await renderLogos();
    await Promise.all([renderHero(), renderBio(), renderGallery(), renderBanner()]);
    renderMusic(); renderEvents(); renderContact();
    setupNav(); setupLightbox(); setupReveal();
    if (!reduceMotion) { setupParticles(); setupEQ(); setupCursorAndParallax(); }
    setTimeout(() => { $("#loader").classList.add("done"); document.body.classList.remove("loading"); }, reduceMotion ? 0 : 1300);
  }
  init();
})();
