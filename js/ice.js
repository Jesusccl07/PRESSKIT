/* Logo de hielo en WebGL.
   A partir del PNG del logo se crea un mapa: R = forma nítida, G = relieve (desenfoque corto),
   B = halo (desenfoque largo). El shader calcula biselado, grietas, escarcha, reflejos tipo
   cromo y un halo neón. La luz sigue al ratón y el bombo (kick) mete un golpe RGB. */
window.IceLogo = function (canvas, img) {
  const PAD = 0.08; // margen alrededor del logo (fracción del ancho del logo), para el halo
  let gl;
  try { gl = canvas.getContext("webgl", { premultipliedAlpha: true, alpha: true, antialias: false }); } catch (e) { return null; }
  if (!gl) return null;

  // ---------- Mapa del logo ----------
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

  // ---------- Shaders ----------
  const VS = `attribute vec2 p; varying vec2 vUv; void main(){ vUv = p * .5 + .5; gl_Position = vec4(p, 0., 1.); }`;
  const FS = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uTex;
  uniform vec2 uTexel, uMouse;
  uniform float uAspect, uTime, uKick, uOn;
  vec2 hash2(vec2 p){ p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3))); return fract(sin(p) * 43758.5453); }
  float hash(vec2 p){ return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453); }
  float noise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
    return mix(mix(hash(i), hash(i + vec2(1., 0.)), f.x), mix(hash(i + vec2(0., 1.)), hash(i + vec2(1., 1.)), f.x), f.y); }
  float fbm(vec2 p){ float v = 0., a = .5; for (int i = 0; i < 4; i++){ v += a * noise(p); p *= 2.03; a *= .5; } return v; }
  float cracks(vec2 p){
    vec2 i = floor(p), f = fract(p); float d1 = 8., d2 = 8.;
    for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++){
      vec2 g = vec2(float(x), float(y)); vec2 r = g + hash2(i + g) - f; float d = dot(r, r);
      if (d < d1){ d2 = d1; d1 = d; } else if (d < d2){ d2 = d; } }
    return 1. - smoothstep(0., .045, sqrt(d2) - sqrt(d1));
  }
  void main(){
    vec2 uv = vec2(vUv.x, 1. - vUv.y);
    float k = uKick;
    vec2 split = vec2(uTexel.x * (1.5 + 14. * k), 0.);
    vec4 t = texture2D(uTex, uv);
    float a = t.r;
    float aR = texture2D(uTex, uv + split).r, aB = texture2D(uTex, uv - split).r;
    float hx = texture2D(uTex, uv + vec2(uTexel.x * 2., 0.)).g - texture2D(uTex, uv - vec2(uTexel.x * 2., 0.)).g;
    float hy = texture2D(uTex, uv + vec2(0., uTexel.y * 2.)).g - texture2D(uTex, uv - vec2(0., uTexel.y * 2.)).g;
    vec3 n = normalize(vec3(-hx * 5., hy * 5., 1.));
    vec2 p = uv * vec2(uAspect, 1.);
    float cr = cracks(p * 5.5 + .3) * .8 + cracks(p * 14. + 2.) * .3;
    float frost = fbm(p * 20.);
    vec2 m = uMouse * vec2(uAspect, 1.);
    vec3 L = normalize(vec3(m - p, .5));
    float diff = max(dot(n, L), 0.);
    float spec = pow(max(dot(reflect(-L, n), vec3(0., 0., 1.)), 0.), 34.);
    float fres = pow(1. - n.z, 1.5);
    vec3 r = reflect(vec3(0., 0., -1.), n);
    float band = .5 + .5 * sin((r.x * 2. + r.y * 3. + p.x * .35) * 5. + uTime * .5);
    vec3 deep = vec3(.07, .22, .6), ice = vec3(.8, .91, 1.);
    vec3 col = mix(deep, ice, clamp(.45 + .42 * diff + .4 * band * fres + .16 * frost, 0., 1.));
    col = mix(col, vec3(1.), cr * (.3 + .5 * diff));
    col += vec3(.75, .88, 1.) * spec * 1.3;
    // destellos: puntitos que titilan donde da la luz, como en el hielo de verdad
    vec2 gp = p * 70.; float gh = hash(floor(gp));
    float tw = pow(max(0., sin(uTime * (1.5 + gh * 3.) + gh * 40.)), 12.);
    col += vec3(1.) * step(.94, gh) * tw * smoothstep(.45, 0., length(fract(gp) - .5)) * (.4 + diff) * 1.6;
    float sweep = smoothstep(.07, 0., abs(fract(uTime * .07) * (uAspect + 2.) - 1. - (p.x - p.y * .6)));
    col += sweep * .6;
    col *= .94 + .55 * k;
    vec3 aRGB = vec3(aR, a, aB);
    float glow = t.b * (1. - a);
    vec3 glowCol = vec3(.15, .45, 1.) * glow * (.85 + 1.3 * k);
    gl_FragColor = vec4(col * aRGB + glowCol, max(max(aR, a), aB) + glow * .45) * uOn;
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
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, TW, TH, 0, gl.RGBA, gl.UNSIGNED_BYTE, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  const U = {};
  ["uTex", "uTexel", "uMouse", "uAspect", "uTime", "uKick", "uOn"].forEach((n) => (U[n] = gl.getUniformLocation(prog, n)));
  gl.uniform1i(U.uTex, 0);
  gl.uniform2f(U.uTexel, 1 / TW, 1 / TH);
  gl.uniform1f(U.uAspect, TW / TH);
  gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

  const state = { mouse: [0.5, 0.3], target: null, kick: 0, on: 0 };
  // Calidad adaptativa: si un dispositivo va justo, baja la resolución y luego los fps
  let quality = 1, cost = 0, frameN = 0, skip = false;
  function resize() {
    const dpr = Math.min(devicePixelRatio || 1, matchMedia("(pointer: coarse)").matches ? 1.25 : 1.5) * quality;
    const w = Math.max(2, Math.round(canvas.clientWidth * dpr)), h = Math.max(2, Math.round(canvas.clientHeight * dpr));
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h); }
  }
  function render(timeSec) {
    if (state.on <= 0.001) return;                 // invisible: no se dibuja
    frameN++;
    if (skip && frameN % 2) return;                // modo ahorro: 30 fps
    const t0 = performance.now();
    draw(timeSec);
    const dt = performance.now() - t0;
    cost = frameN < 4 ? dt : cost * 0.8 + dt * 0.2;
    // Un fotograma muy lento baja la calidad al momento; si no, se revisa cada 10
    if (dt > 40 || (frameN % 10 === 0 && cost > 9)) {
      if (quality > 0.5) quality = Math.max(0.5, quality - 0.25);
      else skip = true;
    }
  }
  function draw(timeSec) {
    resize();
    // Luz: sigue al ratón; si no hay ratón, orbita sola
    const auto = [0.5 + 0.42 * Math.cos(timeSec * 0.35), 0.35 + 0.45 * Math.sin(timeSec * 0.5)];
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
    set on(v) { state.on = v; }, get on() { return state.on; },
    set kick(v) { state.kick = v; },
    pointTo(xNorm, yNorm) { state.target = xNorm == null ? null : [xNorm, yNorm]; },
  };
};
