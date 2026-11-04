/* Logo de cromo helado en WebGL.
   A partir del PNG del logo se crea un mapa: R = forma, G = relieve (desenfoque corto),
   B = halo (desenfoque largo). El shader pinta las letras como metal pulido y frío: reflejan
   un "cielo" claro arriba y un suelo azul abajo, con la línea del horizonte brillante, y el
   bisel capta la luz, que sigue al ratón (o al móvil). Cada pocos segundos pasa un destello.
   El borde nítido lo pone una máscara CSS con el propio logo, así se ve perfecto aunque el
   lienzo se dibuje a menos resolución. El halo azul es una imagen aparte (assets/logo-glow.webp). */
window.IceLogo = function (canvas, img, mapImg, opts = {}) {
  const PAD = 0.08; // margen alrededor del logo (fracción del ancho del logo), para el halo
  let gl;
  try { gl = canvas.getContext("webgl", { premultipliedAlpha: true, alpha: true, antialias: false }); } catch (e) { return null; }
  if (!gl) return null;

  // ---------- Mapa del logo ----------
  // Lo normal: el mapa viene pre-calculado (assets/logo-ice-map*.webp) y el móvil no hace cuentas.
  // Si no está, se calcula aquí a partir del logo.
  let TW, TH, padPx, tex = null;
  if (mapImg) {
    TW = mapImg.naturalWidth; TH = mapImg.naturalHeight;
    padPx = Math.round((TW * PAD) / (1 + 2 * PAD));
  } else {
    const m = computeMap();
    if (!m) return null;
    ({ TW, TH, padPx, tex } = m);
  }

  function computeMap() {
  const aspect = img.naturalWidth / img.naturalHeight;
  const logoW = 1300, padPx = Math.round(logoW * PAD), logoH = Math.round(logoW / aspect);
  const TW = logoW + padPx * 2, TH = logoH + padPx * 2;
  const c2 = document.createElement("canvas"); c2.width = TW; c2.height = TH;
  const x2 = c2.getContext("2d");
  x2.drawImage(img, padPx, padPx, logoW, logoH);
  let src;
  try { src = x2.getImageData(0, 0, TW, TH).data; } catch (e) { return null; } // file:// bloquea la lectura

  const N = TW * TH, alpha = new Float32Array(N);
  for (let i = 0; i < N; i++) alpha[i] = src[i * 4 + 3] / 255;

  // Desenfoque nativo del navegador (GPU) si está disponible; si no, el de JS
  function nativeBlur(r) {
    const c = document.createElement("canvas"); c.width = TW; c.height = TH;
    const x = c.getContext("2d");
    if (!("filter" in x)) return null;
    x.filter = `blur(${r}px)`;
    if (x.filter === "none") return null;
    x.drawImage(img, padPx, padPx, logoW, logoH);
    const d = x.getImageData(0, 0, TW, TH).data, out = new Float32Array(N);
    let sum = 0;
    for (let i = 0; i < N; i++) { out[i] = d[i * 4 + 3] / 255; sum += out[i]; }
    // Comprobación: si el filtro no se aplicó, los bordes seguirían duros
    let soft = 0;
    for (let i = 0; i < N; i += 97) if (out[i] > 0.05 && out[i] < 0.95) soft++;
    return soft > 20 && sum > 0 ? out : null;
  }
  // Desenfoque de caja separable (3 pasadas ≈ gaussiano)
  function blur(input, r) {
    let a = Float32Array.from(input), b = new Float32Array(N);
    for (let pass = 0; pass < 3; pass++) {
      for (let y = 0; y < TH; y++) {           // horizontal
        let acc = 0; const row = y * TW;
        for (let x = -r; x <= r; x++) acc += a[row + Math.min(TW - 1, Math.max(0, x))];
        for (let x = 0; x < TW; x++) {
          b[row + x] = acc / (2 * r + 1);
          acc += a[row + Math.min(TW - 1, x + r + 1)] - a[row + Math.max(0, x - r)];
        }
      }
      for (let x = 0; x < TW; x++) {           // vertical
        let acc = 0;
        for (let y = -r; y <= r; y++) acc += b[Math.min(TH - 1, Math.max(0, y)) * TW + x];
        for (let y = 0; y < TH; y++) {
          a[y * TW + x] = acc / (2 * r + 1);
          acc += b[Math.min(TH - 1, y + r + 1) * TW + x] - b[Math.max(0, y - r) * TW + x];
        }
      }
    }
    return a;
  }
  // Radio gaussiano ≈ radio de caja * 1.7 (3 pasadas)
  const bevel = nativeBlur(5) || blur(alpha, 3), halo = nativeBlur(36) || blur(alpha, 22);
  const tex = new Uint8Array(N * 4);
  for (let i = 0; i < N; i++) {
    tex[i * 4] = alpha[i] * 255;
    tex[i * 4 + 1] = Math.min(255, bevel[i] * 255);
    tex[i * 4 + 2] = Math.min(255, halo[i] * 340);
    tex[i * 4 + 3] = 255;
  }
  return { TW, TH, padPx, tex };
  }

  // ---------- Shaders ----------
  const VS = `attribute vec2 p; varying vec2 vUv; void main(){ vUv = p * .5 + .5; gl_Position = vec4(p, 0., 1.); }`;
  const FS = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uTex;
  uniform vec2 uMouse;
  uniform float uAspect, uTime, uKick, uOn;
  float rel(vec2 uv){ return texture2D(uTex, uv).g; }
  void main(){
    vec2 uv = vec2(vUv.x, 1. - vUv.y);
    float cov = smoothstep(0., .4, texture2D(uTex, uv).r); // cobertura generosa: el borde lo recorta la máscara
    if (cov <= 0.) { gl_FragColor = vec4(0.); return; }
    // Relieve: normal del bisel, con el paso medido en el logo (igual en el mapa grande y en el pequeño)
    vec2 e = vec2(1.5 / 1508., 1.5 / 443.);
    float hx = rel(uv + vec2(e.x, 0.)) - rel(uv - vec2(e.x, 0.));
    float hy = rel(uv + vec2(0., e.y)) - rel(uv - vec2(0., e.y));
    vec3 n = normalize(vec3(-hx, hy, .22));
    vec2 m = clamp(uMouse - .5, -.6, .6);
    // Reflejo del entorno: claro arriba, azul profundo abajo y un horizonte brillante en medio
    float y = (uv.y - .5) * 3.2 - n.y * 1.1 + m.y * .55 + n.x * .25;
    float sky = 1. - smoothstep(-.035, .035, y);
    vec3 top = mix(vec3(.6, .77, 1.), vec3(.97, .99, 1.), smoothstep(0., .9, -y));
    vec3 bot = mix(vec3(.04, .13, .4), vec3(.3, .58, 1.), smoothstep(0., .9, y));
    vec3 col = mix(bot, top, sky);
    col += vec3(.8, .93, 1.) * (1. - smoothstep(0., .12, abs(y + .06))) * .55;
    // Luz principal: da forma al bisel y deja un brillo duro donde pega
    vec3 L = normalize(vec3(m.x * 1.8 - .3, .5 - m.y * 1.8, .8));
    float diff = max(dot(n, L), 0.);
    float spec = pow(max(dot(reflect(-L, n), vec3(0., 0., 1.)), 0.), 48.);
    col *= .82 + .3 * diff;
    col = mix(col, vec3(.62, .88, 1.), clamp((1. - n.z) * 1.6, 0., 1.) * .45);
    col += vec3(.9, .97, 1.) * spec * 1.2;
    // Destello que cruza el logo cada 7 s
    float ph = fract(uTime / 7.), bx = mix(-.3, 1.3, smoothstep(0., .35, ph)) * uAspect;
    col += (1. - smoothstep(0., .09, abs(bx - (uv.x * uAspect - uv.y * .6)))) * .5;
    col *= 1. + .3 * uKick;
    gl_FragColor = vec4(col * cov, cov) * uOn;
  }`;
  function sh(type, s) {
    const o = gl.createShader(type); gl.shaderSource(o, s); gl.compileShader(o);
    if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) { console.warn(gl.getShaderInfoLog(o)); return null; }
    return o;
  }
  const vs = sh(gl.VERTEX_SHADER, VS), fs = sh(gl.FRAGMENT_SHADER, FS);
  if (!vs || !fs) return null;
  const prog = gl.createProgram(); gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);
  const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, "p"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const t0 = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t0);
  gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
  if (tex) gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, TW, TH, 0, gl.RGBA, gl.UNSIGNED_BYTE, tex);
  else {
    // datos, no color: sin gestión de color ni premultiplicado
    gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    try { gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, mapImg); } catch (e) { return null; }
  }
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  const U = {};
  ["uTex", "uMouse", "uAspect", "uTime", "uKick", "uOn"].forEach((n) => (U[n] = gl.getUniformLocation(prog, n)));
  gl.uniform1i(U.uTex, 0);
  gl.uniform1f(U.uAspect, TW / TH);

  // Borde nítido: máscara CSS con el logo original, encajada en la zona del logo dentro del lienzo
  const mask = {
    Image: `url("${img.currentSrc || img.src}")`,
    Size: `${((1 - (2 * padPx) / TW) * 100).toFixed(3)}% ${((1 - (2 * padPx) / TH) * 100).toFixed(3)}%`,
    Position: "center", Repeat: "no-repeat",
  };
  for (const [k, v] of Object.entries(mask)) { canvas.style["mask" + k] = v; canvas.style["webkitMask" + k] = v; }
  gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

  const state = { mouse: [0.5, 0.3], target: null, kick: 0, on: 0 };
  // Calidad adaptativa por niveles: si un dispositivo va justo, baja la resolución, luego los fps
  // y, si aun así no puede, deja el logo como imagen fija (sin gastar batería).
  // Mide el coste en CPU de cada dibujo y también si los fotogramas llegan tarde (GPU saturada).
  let quality = 1, cost = 0, gap = 16, frameN = 0, drawn = 0, every = opts.every || 1, frozen = false, lastT = 0;
  function resize() {
    const dpr = Math.min(devicePixelRatio || 1, 2) * quality;
    const w = Math.max(2, Math.round(canvas.clientWidth * dpr)), h = Math.max(2, Math.round(canvas.clientHeight * dpr));
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h); }
  }
  function degrade() {
    if (quality > 0.6) quality = Math.max(0.6, quality - 0.2);
    else if (every < 2) every = 2;        // 30 fps
    else if (every < 6) every = 6;        // 10 fps
    else frozen = true;                   // imagen fija
  }
  function render(timeSec) {
    if (state.on <= 0.001 || frozen) return;       // invisible o congelado: no se dibuja
    const now = performance.now();
    if (lastT) gap = gap * 0.9 + Math.min(200, now - lastT) * 0.1;
    lastT = now;
    if (++frameN % every) return;
    draw(timeSec);
    const dt = performance.now() - now;
    drawn++;
    cost = drawn < 4 ? dt : cost * 0.8 + dt * 0.2;
    // Un dibujo muy lento degrada al momento; si no, se revisa cada 20 dibujos
    if (dt > 40 || (drawn % 20 === 0 && (cost > 9 || gap > 30))) degrade();
  }
  function draw(timeSec) {
    resize();
    // Luz: sigue al ratón; si no hay ratón, orbita sola
    const auto = [0.5 + 0.42 * Math.cos(timeSec * 0.35), 0.42 + 0.3 * Math.sin(timeSec * 0.4)];
    const tgt = state.target || auto;
    state.mouse[0] += (tgt[0] - state.mouse[0]) * 0.08;
    state.mouse[1] += (tgt[1] - state.mouse[1]) * 0.08;
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform2f(U.uMouse, state.mouse[0], state.mouse[1]);
    gl.uniform1f(U.uTime, timeSec);
    gl.uniform1f(U.uKick, state.kick);
    gl.uniform1f(U.uOn, state.on);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
  return {
    aspect: TW / TH,
    pad: { x: padPx / TW, y: padPx / TH },
    render,
    // "on" también enciende el halo (variable CSS del contenedor)
    set on(v) { state.on = v; canvas.parentNode?.style.setProperty("--logo-on", v.toFixed(3)); }, get on() { return state.on; },
    set kick(v) { state.kick = v; },
    pointTo(xNorm, yNorm) { state.target = xNorm == null ? null : [xNorm, yNorm]; },
  };
};
