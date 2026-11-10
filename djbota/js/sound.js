/* Motor de sonido del botón Play.
   - Si config.audio tiene un MP3, lo reproduce y detecta los bombos de ese audio.
   - Si no, sintetiza en el navegador un groove a los BPM de la config.
   En ambos casos expone kickLevel() (0..1) para que la web lata con el ritmo. */
window.Sound = (() => {
  const C = window.PRESSKIT;
  const BPM = C.artist.bpm || 128;
  const s16 = 60 / BPM / 4;
  const ROOTS = [55, 55, 43.65, 49];
  let ctx, out, analyser, data, noise, timer, next = 0, step = 0, loop = 0, on = false;
  let audioEl = null, lastKick = -1, avgLow = 0;
  const kicks = [];

  function setup() {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    out = ctx.createGain(); out.gain.value = 0;
    const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -16; comp.ratio.value = 4;
    analyser = ctx.createAnalyser(); analyser.fftSize = 512; analyser.smoothingTimeConstant = 0.6;
    data = new Uint8Array(analyser.frequencyBinCount);
    out.connect(comp); comp.connect(analyser); analyser.connect(ctx.destination);
    if (C.audio) {
      audioEl = new Audio(C.audio);
      audioEl.loop = true; audioEl.crossOrigin = "anonymous";
      ctx.createMediaElementSource(audioEl).connect(out);
    } else {
      noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
      const d = noise.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
  }
  const env = (g, t, peak, decay) => {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, t + decay);
  };
  const wire = (...nodes) => { for (let i = 0; i < nodes.length - 1; i++) nodes[i].connect(nodes[i + 1]); };
  function kick(t) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = "sine"; o.frequency.setValueAtTime(165, t); o.frequency.exponentialRampToValueAtTime(44, t + 0.11);
    env(g, t, 1, 0.42); wire(o, g, out); o.start(t); o.stop(t + 0.45);
    kicks.push(t);
  }
  function hat(t, open, vol) {
    const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = noise; f.type = "highpass"; f.frequency.value = 7500;
    env(g, t, vol, open ? 0.2 : 0.04); wire(s, f, g, out); s.start(t, Math.random() * 0.5); s.stop(t + 0.25);
  }
  function clap(t) {
    const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = noise; f.type = "bandpass"; f.frequency.value = 1500; f.Q.value = 0.9;
    g.gain.setValueAtTime(0.0001, t);
    [0, 0.011, 0.022].forEach((o) => { g.gain.setValueAtTime(0.45, t + o); g.gain.exponentialRampToValueAtTime(0.06, t + o + 0.009); });
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
    wire(s, f, g, out); s.start(t); s.stop(t + 0.25);
  }
  function bass(t, freq) {
    const o = ctx.createOscillator(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    o.type = "sawtooth"; o.frequency.value = freq;
    f.type = "lowpass"; f.Q.value = 7; f.frequency.setValueAtTime(950, t); f.frequency.exponentialRampToValueAtTime(140, t + 0.14);
    env(g, t, 0.3, s16 * 1.7); wire(o, f, g, out); o.start(t); o.stop(t + s16 * 2);
  }
  function stab(t, rootHz, bright) {
    const f = ctx.createBiquadFilter(), g = ctx.createGain();
    f.type = "lowpass"; f.Q.value = 5; f.frequency.setValueAtTime(1200 + bright * 2400, t); f.frequency.exponentialRampToValueAtTime(380, t + 0.26);
    env(g, t, 0.075, 0.32); wire(f, g, out);
    [1, 1.189, 1.498].forEach((r) => {
      const o = ctx.createOscillator(); o.type = "sawtooth";
      o.frequency.value = rootHz * r; o.detune.value = (Math.random() - 0.5) * 16;
      o.connect(f); o.start(t); o.stop(t + 0.35);
    });
  }
  function schedule(st, t) {
    const s = st % 16, bar = Math.floor(st / 16) % 4, full = loop > 0;
    if (s % 4 === 0) kick(t);
    if (s % 4 === 2) { hat(t, true, 0.1); bass(t, ROOTS[bar]); } else hat(t, false, s % 2 ? 0.035 : 0.06);
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
  function fade(to, dur) {
    const t = ctx.currentTime;
    out.gain.cancelScheduledValues(t); out.gain.setValueAtTime(out.gain.value, t); out.gain.linearRampToValueAtTime(to, t + dur);
  }
  function start() {
    if (!ctx) setup();
    ctx.resume();
    kicks.length = 0;
    if (audioEl) audioEl.play();
    else { next = ctx.currentTime + 0.06; step = 0; loop = 0; clearInterval(timer); timer = setInterval(tick, 25); tick(); }
    fade(audioEl ? 0.9 : 0.55, 0.4);
    on = true;
  }
  function stop() {
    if (!ctx || !on) return;
    on = false; clearInterval(timer); fade(0, 0.3);
    if (audioEl) setTimeout(() => !on && audioEl.pause(), 320);
  }
  function kickLevel() {
    if (!on) return 0;
    const now = ctx.currentTime;
    if (audioEl) {
      // Detección de bombo: energía de graves por encima de su media reciente
      analyser.getByteFrequencyData(data);
      const low = (data[1] + data[2] + data[3]) / 3;
      avgLow = avgLow * 0.92 + low * 0.08;
      if (low > avgLow * 1.18 && low > 120 && now - lastKick > 0.22) lastKick = now;
      return lastKick < 0 ? 0 : Math.exp(-(now - lastKick) * 8);
    }
    while (kicks.length > 1 && kicks[1] <= now) kicks.shift();
    const k = kicks[0];
    return k == null || k > now ? 0 : Math.exp(-(now - k) * 8);
  }
  return { start, stop, kickLevel, get on() { return on; } };
})();
