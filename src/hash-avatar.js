/*! hash-avatar v1 — deterministic SVG avatar from SHA-256. No dependencies. */
(function (root) {
  'use strict';

  // ---------- SHA-256 (sync) ----------
  const K = new Int32Array(64), IV = new Int32Array(8);
  (function () {
    let n = 2, c = 0;
    const prime = x => { for (let i = 2; i * i <= x; i++) if (x % i === 0) return false; return true; };
    while (c < 64) {
      if (prime(n)) {
        if (c < 8) IV[c] = (Math.sqrt(n) % 1) * 4294967296 | 0;
        K[c] = (Math.cbrt(n) % 1) * 4294967296 | 0;
        c++;
      }
      n++;
    }
  })();

  function sha256(msg) {
    const len = msg.length, total = ((len + 9 + 63) >> 6) << 6;
    const buf = new Uint8Array(total); buf.set(msg); buf[len] = 0x80;
    const dv = new DataView(buf.buffer);
    dv.setUint32(total - 4, (len * 8) >>> 0);
    dv.setUint32(total - 8, Math.floor(len / 0x20000000));
    const h = Int32Array.from(IV), w = new Int32Array(64);
    for (let o = 0; o < total; o += 64) {
      for (let i = 0; i < 16; i++) w[i] = dv.getInt32(o + i * 4);
      for (let i = 16; i < 64; i++) {
        const a = w[i - 15], b = w[i - 2];
        const s0 = (a >>> 7 | a << 25) ^ (a >>> 18 | a << 14) ^ (a >>> 3);
        const s1 = (b >>> 17 | b << 15) ^ (b >>> 19 | b << 13) ^ (b >>> 10);
        w[i] = w[i - 16] + s0 + w[i - 7] + s1 | 0;
      }
      let A = h[0], B = h[1], C = h[2], D = h[3], E = h[4], F = h[5], G = h[6], H = h[7];
      for (let i = 0; i < 64; i++) {
        const S1 = (E >>> 6 | E << 26) ^ (E >>> 11 | E << 21) ^ (E >>> 25 | E << 7);
        const t1 = H + S1 + (E & F ^ ~E & G) + K[i] + w[i] | 0;
        const S0 = (A >>> 2 | A << 30) ^ (A >>> 13 | A << 19) ^ (A >>> 22 | A << 10);
        const t2 = S0 + (A & B ^ A & C ^ B & C) | 0;
        H = G; G = F; F = E; E = D + t1 | 0; D = C; C = B; B = A; A = t1 + t2 | 0;
      }
      h[0] += A; h[1] += B; h[2] += C; h[3] += D; h[4] += E; h[5] += F; h[6] += G; h[7] += H;
    }
    const out = new Uint8Array(32), odv = new DataView(out.buffer);
    for (let i = 0; i < 8; i++) odv.setInt32(i * 4, h[i]);
    return out;
  }

  // ---------- identity -> hash ----------
  const enc = new TextEncoder();
  function normalize(input) {
    let s = String(input == null ? '' : input).normalize('NFC').trim().replace(/\s+/g, ' ');
    if (/^[^\s@]+@[^\s@]+$/.test(s)) s = s.toLowerCase();
    return s;
  }
  function hash(input, salt) {
    const norm = normalize(input);
    const bytes = sha256(enc.encode('hash-avatar/v1\u0000' + (salt || '') + '\u0000' + norm));
    let hex = '';
    for (let i = 0; i < 32; i++) hex += (bytes[i] < 16 ? '0' : '') + bytes[i].toString(16);
    return { input: norm, bytes, hex };
  }

  // ---------- drawing helpers ----------
  const r1 = n => Math.round(n * 10) / 10;
  function d(s, ...v) { let o = s[0]; for (let i = 0; i < v.length; i++) o += (typeof v[i] === 'number' ? r1(v[i]) : v[i]) + s[i + 1]; return o; }
  const P = (path, fill, extra) => `<path d="${path}" fill="${fill}"${extra || ''}/>`;
  const S = (path, stroke, w, extra) => `<path d="${path}" fill="none" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${extra || ''}/>`;
  const C = (x, y, r, fill, extra) => `<circle cx="${r1(x)}" cy="${r1(y)}" r="${r1(r)}" fill="${fill}"${extra || ''}/>`;
  const E = (x, y, rx, ry, fill, extra) => `<ellipse cx="${r1(x)}" cy="${r1(y)}" rx="${r1(rx)}" ry="${r1(ry)}" fill="${fill}"${extra || ''}/>`;
  const hsl = (h, s, l) => `hsl(${Math.round(h)},${s}%,${l}%)`;
  function shade(hex, k) {
    const n = parseInt(hex.slice(1), 16);
    const c = [n >> 16, n >> 8 & 255, n & 255].map(v => Math.max(0, Math.min(255, Math.round(v * k))));
    return '#' + c.map(v => v.toString(16).padStart(2, '0')).join('');
  }
  function mix(a, b, t) {
    const x = parseInt(a.slice(1), 16), y = parseInt(b.slice(1), 16);
    const c = [16, 8, 0].map(s => Math.round(((x >> s) & 255) * (1 - t) + ((y >> s) & 255) * t));
    return '#' + c.map(v => v.toString(16).padStart(2, '0')).join('');
  }

  // ---------- palettes / geometry ----------
  const GENDERS = ['male', 'female', 'neutral'];
  const AGES = ['baby', 'teen', 'youth', 'middle', 'old'];
  const SKIN_BY = {
    asian: ['#F6DBC0', '#EDCBA6', '#E0B88E'],
    white: ['#FBE4D5', '#F5D2BA', '#E9BE9E'],
    brown: ['#C99066', '#B07A50', '#97643E'],
    black: ['#7C4F33', '#603C26', '#47291A'],
  };
  SKIN_BY.auto = [].concat(SKIN_BY.asian, SKIN_BY.white, SKIN_BY.brown, SKIN_BY.black);
  const HAIR_BY = {
    asian: ['#1E1D1C', '#2B2A28', '#3A2A22', '#26303F', '#4A2F23', '#6E4430'],
    white: ['#2B2A28', '#4A2F23', '#6E4430', '#9C5A33', '#C98A3F', '#DDBB78', '#B5452A', '#E8D5A8'],
    black: ['#1E1D1C', '#2B2A28', '#3A2A22', '#4A2F23'],
    brown: ['#1E1D1C', '#2B2A28', '#3A2A22', '#4A2F23', '#6E4430'],
  };
  HAIR_BY.auto = ['#2B2A28', '#4A2F23', '#6E4430', '#9C5A33', '#C98A3F', '#DDBB78', '#B5452A', '#26303F'];
  const EYE_BY = {
    asian: ['#3B2A20', '#2A1D16', '#5A3B22'],
    white: ['#2F5D8A', '#3E7A55', '#6E6A5E', '#5A3B22', '#7A5230', '#4F7FA8'],
    black: ['#2A1D16', '#3B2A20', '#5A3B22'],
    brown: ['#2A1D16', '#3B2A20', '#5A3B22', '#7A5230'],
  };
  EYE_BY.auto = ['#3B2A20', '#5A3B22', '#2F5D8A', '#3E7A55', '#6E6A5E', '#7A5230'];
  // humanoids reuse the human renderer with their own palettes and extra parts
  Object.assign(SKIN_BY, {
    elf: ['#F7E6D6', '#EEDCC6', '#E3EAD2', '#F3E0CC'],
    orc: ['#7FA35B', '#6B8F4E', '#8DAA6A', '#5E7F45'],
    vampire: ['#EFE8E5', '#E4DCDA', '#DAD6DE'],
    zombie: ['#A9B99A', '#9AAE8E', '#B4B8A0', '#8FA39A'],
    oni: ['#D9534F', '#C9453F', '#4F7FC9', '#6A8FD8'],
    demon: ['#9B4F8F', '#B5475A', '#7D4A9B', '#C25B4A'],
    angel: ['#FBE9DC', '#F6DCC8', '#EDD0B4', '#E0B88E'],
    cyborg: SKIN_BY.auto,
  });
  Object.assign(HAIR_BY, {
    elf: ['#E8D5A8', '#F2EEDF', '#DDBB78', '#C7D9C0', '#9C5A33', '#2B2A28'],
    orc: ['#1E1D1C', '#2B2A28', '#3A2A22', '#4A2F23'],
    vampire: ['#1E1D1C', '#26303F', '#2B2A28', '#E8E4DC', '#5A1A22'],
    zombie: ['#3A3A2E', '#4A4A3A', '#5A4A3A', '#6E6E5E'],
    oni: ['#1E1D1C', '#F2EEDF', '#2B2A28', '#3A2A22'],
    demon: ['#1E1D1C', '#2B1F3A', '#5A1A22', '#F2EEDF'],
    angel: ['#F3E2A8', '#E8D5A8', '#F2EEDF', '#DDBB78', '#C98A3F'],
    cyborg: HAIR_BY.auto,
  });
  Object.assign(EYE_BY, {
    elf: ['#3E7A55', '#4F7FA8', '#7A9A3A', '#8A6AB8'],
    orc: ['#B8913A', '#8A3A28', '#3B2A20'],
    vampire: ['#B3121B', '#8A0F14', '#C2410C'],
    zombie: ['#C9C9A8', '#9A9A7A', '#E0D8A0'],
    oni: ['#E8C547', '#F2A33A', '#1E1A18'],
    demon: ['#E8C547', '#D93A3A', '#9B30FF'],
    angel: ['#4F7FA8', '#7AB8E0', '#B8913A'],
    cyborg: EYE_BY.auto,
  });
  // creatures: main colour list (F(1)) and eye colours (F(5))
  const FUR = {
    cat: ['#F2A65A', '#8E8E8A', '#3A3836', '#F4EDE4', '#C98A3F', '#6E6A5E', '#E8D5A8'],
    dog: ['#C98A3F', '#8C5A33', '#F2E2C4', '#3A3836', '#E8C79A', '#A0705A'],
    fox: ['#E8742A', '#D9612A', '#F09040', '#B5452A', '#ECE7E0', '#8E8E8A'],
    kitsune: ['#F7F0E4', '#F2D58A', '#FFF8EC', '#E8C88A'],
    panda: ['#F7F5F0'],
    rabbit: ['#F4EDE4', '#C9B8A6', '#8E8E8A', '#E8D5C0', '#6E5A4A'],
    bear: ['#8C5A33', '#6E4430', '#4A3A30', '#F2EEE6', '#C98A3F'],
    owl: ['#8C6A4A', '#A0826A', '#6E5A4A', '#C8B8A0', '#5A5A60'],
    penguin: ['#2B2E38', '#1E2230', '#3A4050'],
    frog: ['#6DBE5A', '#4FA04A', '#8FCB5A', '#3FA8A0', '#E8C547', '#D9534F'],
    monkey: ['#8C5A33', '#6E4430', '#A0705A', '#C98A3F'],
    dragon: ['#3FA86A', '#C9453F', '#2F7FBF', '#D9A43A', '#2BA8A0', '#7A4FBF'],
    robot: ['#9AA8B8', '#C8D0D8', '#6E7F95', '#D9A43A', '#5A9FD4', '#E06A4A'],
    ai: ['#7FD4FF', '#9B7BFF', '#5AF0C8', '#FF7BD4', '#FFC85A'],
    alien: ['#9ACB8A', '#A8B4C0', '#8ADAD0', '#C8A8E0'],
    ghost: ['#F4F6FA', '#E8F0FF', '#F0E8FF'],
    skeleton: ['#F2EEE2', '#E8E2D0'],
    slime: ['#6DD47E', '#5AB4F0', '#F07AB4', '#A07AF0', '#F0C85A'],
  };
  const CEYE = {
    cat: ['#9BCB3A', '#E8C547', '#4F9FD8', '#D98A2A'], fox: ['#E8A03A', '#B8913A', '#3B2A20'],
    kitsune: ['#D93A3A', '#E8C547', '#7A4FBF'], dragon: ['#E8C547', '#D93A3A', '#5AF0C8'],
    robot: ['#5AF0FF', '#FF5A5A', '#7BFF8A', '#FFC85A'], owl: ['#F2A33A', '#E8C547', '#D9612A'],
    frog: ['#E8C547', '#D9612A', '#2A1D16'], skeleton: ['#5AF0FF', '#FF5A5A', '#B8FF5A'],
    alien: ['#14141A'], ghost: ['#1E1A28'], ai: ['#FFFFFF'],
    _: ['#3B2A20', '#2A1D16', '#3E7A55', '#5A3B22'],
  };
  const MANE = ['#D93A3A', '#E8B83A', '#2F5FBF', '#F2EEDF', '#1E1D1C'];
  const HAIR_OLD = ['#8E8E8A', '#B4B4AF', '#D8D8D2', '#EEEEE8', '#6F6E6A'];
  const GLASS = ['#2B2A28', '#7A4B2E', '#B8913A'];
  const INK = '#2B2A28';
  const GEO = {
    baby:   { cy: 118, rx: 50, ry: 47, bw: 56 },
    teen:   { cy: 106, rx: 41, ry: 49, bw: 66 },
    youth:  { cy: 104, rx: 42, ry: 51, bw: 74 },
    middle: { cy: 104, rx: 44, ry: 51, bw: 78 },
    old:    { cy: 106, rx: 44, ry: 50, bw: 76 },
  };
  const STYLES = {
    male: {
      baby: ['tuft', 'fuzz', 'tuft2', 'babycurls'],
      young: ['crop', 'swept', 'spiky', 'buzz', 'curly', 'afro', 'quiff', 'sidepart', 'manbun', 'mohawk', 'shaggy', 'locs', 'cornrows', 'shoulder'],
      middle: ['crop', 'swept', 'buzz', 'curly', 'receding', 'sidepart', 'quiff', 'shaggy', 'locs', 'shoulder', 'afro'],
      old: ['bald', 'receding', 'crop', 'buzz', 'perm', 'sidepart', 'combover'],
    },
    female: {
      baby: ['tuft', 'fuzz', 'tuft2', 'babycurls', 'sprout'],
      young: ['bob', 'long', 'ponytail', 'bun', 'wavy', 'afro', 'pixie', 'twinbraids', 'pigtails', 'puffs', 'bangslong', 'curtain', 'locs'],
      middle: ['bob', 'long', 'bun', 'wavy', 'ponytail', 'perm', 'pixie', 'curtain', 'locs', 'shoulder', 'afro'],
      old: ['bun', 'perm', 'bob', 'swept', 'pixie', 'shoulder'],
    },
    neutral: {
      baby: ['tuft', 'fuzz', 'tuft2', 'babycurls'],
      young: ['bob', 'crop', 'swept', 'curly', 'buzz', 'ponytail', 'pixie', 'shaggy', 'sidepart', 'locs', 'shoulder', 'curtain', 'afro'],
      middle: ['bob', 'crop', 'swept', 'curly', 'buzz', 'pixie', 'shaggy', 'shoulder', 'locs'],
      old: ['perm', 'crop', 'bob', 'buzz', 'pixie'],
    },
  };
  // Race only shifts weights toward common textures; every style stays reachable for every race.
  const STYLE_BONUS = {
    black: [['afro', 'curly', 'locs', 'cornrows', 'buzz', 'puffs', 'twinbraids', 'perm', 'babycurls'], 2],
    asian: [['crop', 'sidepart', 'bob', 'long', 'bangslong', 'swept', 'buzz', 'ponytail', 'pixie', 'shaggy', 'fuzz'], 1],
    white: [['swept', 'wavy', 'sidepart', 'long', 'curtain', 'shaggy', 'bob', 'tuft'], 1],
    brown: [['wavy', 'curly', 'long', 'sidepart', 'swept', 'ponytail', 'perm', 'tuft2'], 1],
    auto: [[], 0],
  };
  const TALL = { spiky: 1, mohawk: 1, quiff: 1, bun: 1, manbun: 1, puffs: 1, afro: 1, sprout: 1 };
  const COVERING = { beanie: 1, cap: 1, bucket: 1, beret: 1, flatcap: 1, sunhat: 1, knit: 1, bonnet: 1 };

  // ---------- hair ----------
  // Arc over the top of the head: from left temple to right temple (center = (cx, y0)).
  const capArc = (g, e, eb) => d`M${g.cx - g.rx - e} ${g.y0} A${g.rx + e} ${g.ry + eb} 0 0 1 ${g.cx + g.rx + e} ${g.y0}`;
  // Cap closed by a single curve whose lowest point sits at top + h*ry.
  const capQ = (g, e, eb, h) => capArc(g, e, eb) + d` Q${g.cx} ${2 * (g.top + h * g.ry) - g.y0} ${g.cx - g.rx - e} ${g.y0} Z`;
  const cropPath = g => capArc(g, 2, 6) + d` L${g.cx + g.rx + 1} ${g.y0 + 6} Q${g.cx + g.rx * 0.55} ${g.top + g.ry * 0.2} ${g.cx + g.rx * 0.05} ${g.top + g.ry * 0.3} Q${g.cx - g.rx * 0.5} ${g.top + g.ry * 0.38} ${g.cx - g.rx - 1} ${g.y0 + 6} Z`;
  const centerPart = (g, hc) => P(capArc(g, 2, 5) + d` L${g.cx + g.rx + 1} ${g.y0 + 4} Q${g.cx + g.rx * 0.5} ${g.top + g.ry * 0.4} ${g.cx} ${g.top + g.ry * 0.28} Q${g.cx - g.rx * 0.5} ${g.top + g.ry * 0.4} ${g.cx - g.rx - 1} ${g.y0 + 4} Z`, hc);
  function fringeCurls(g, hc, r, h) {
    let s = '';
    for (let i = 0; i < 5; i++) s += C(g.cx - g.rx * 0.62 + i * g.rx * 0.31, g.top + g.ry * h + (i % 2) * 2, r, hc);
    return s;
  }
  function rimCurls(g, hc, r, e) {
    let s = '';
    for (let i = 0; i < 9; i++) {
      const t = Math.PI - Math.PI * (0.04 + 0.92 * i / 8);
      s += C(g.cx + (g.rx + e) * Math.cos(t), g.y0 - (g.ry + e) * Math.sin(t), r + (i % 2) * 1.5, hc);
    }
    return s;
  }
  function longFront(g, hc) {
    const { cx, cy, rx, ry, top } = g;
    return P(capArc(g, 4, 9) + d` L${cx + rx + 4} ${cy + ry * 0.35} Q${cx + rx - 3} ${top + ry * 0.4} ${cx - rx * 0.1} ${top + ry * 0.24} Q${cx - rx + 3} ${top + ry * 0.35} ${cx - rx - 4} ${cy + ry * 0.35} Z`, hc);
  }
  function curtainFront(g, hc) {
    const { cx, cy, rx, ry, top } = g, L = cx - rx, R = cx + rx;
    return P(capArc(g, 4, 9) + d` L${R + 4} ${cy + ry * 0.35} Q${R - 2} ${top + ry * 0.45} ${cx + 2} ${top + ry * 0.26} L${cx - 2} ${top + ry * 0.26} Q${L + 2} ${top + ry * 0.45} ${L - 4} ${cy + ry * 0.35} Z`, hc);
  }
  function sideStrands(g, hc) {
    const { cx, cy, rx, sh } = g, L = cx - rx, R = cx + rx;
    return P(d`M${L - 6} ${cy} Q${L - 11} ${sh} ${L - 6} ${sh + 18} Q${L + 2} ${sh + 21} ${L + 9} ${sh + 10} Q${L + 2} ${sh - 10} ${L + 4} ${cy} Z`, hc) +
           P(d`M${R + 6} ${cy} Q${R + 11} ${sh} ${R + 6} ${sh + 18} Q${R - 2} ${sh + 21} ${R - 9} ${sh + 10} Q${R - 2} ${sh - 10} ${R - 4} ${cy} Z`, hc);
  }
  function longBack(g, hc, wavy) {
    const { cx, cy, rx, ry, y0 } = g, bot = cy + ry * 1.3, Lx = cx - rx - 7, Rx = cx + rx + 7;
    let s = d`M${Lx} ${y0} A${rx + 7} ${ry + 10} 0 0 1 ${Rx} ${y0}`;
    if (!wavy) return P(s + d` L${Rx + 2} ${bot} Q${cx} ${bot + 10} ${Lx - 2} ${bot} Z`, hc);
    const n = 4, seg = (bot - y0) / n;
    for (let i = 0; i < n; i++) s += d` Q${Rx + (i % 2 ? -5 : 9)} ${y0 + seg * (i + 0.5)} ${Rx} ${y0 + seg * (i + 1)}`;
    s += d` Q${cx} ${bot + 10} ${Lx} ${bot}`;
    for (let i = n - 1; i >= 0; i--) s += d` Q${Lx - (i % 2 ? -5 : 9)} ${y0 + seg * (i + 0.5)} ${Lx} ${y0 + seg * i}`;
    return P(s + 'Z', hc);
  }
  function bobBack(g, hc, depth) {
    const { cx, cy, rx, ry, y0 } = g, e = 5, chin = cy + ry * depth, L = cx - rx - e, R = cx + rx + e;
    return P(d`M${L} ${y0} A${rx + e} ${ry + 8} 0 0 1 ${R} ${y0} L${R} ${chin} Q${R} ${chin + 8} ${R - 10} ${chin + 6} L${L + 10} ${chin + 6} Q${L} ${chin + 8} ${L} ${chin} Z`, hc);
  }
  function tufts(g, hc) {
    const { cx, cy, rx, ry, y0 } = g, L = cx - rx, R = cx + rx;
    return P(d`M${L - 2} ${y0 + 1} Q${L - 6} ${cy + ry * 0.12} ${L + 3} ${cy + ry * 0.1} Q${L + 2} ${cy - ry * 0.05} ${L + 7} ${y0 - 3} Z`, hc) +
           P(d`M${R + 2} ${y0 + 1} Q${R + 6} ${cy + ry * 0.12} ${R - 3} ${cy + ry * 0.1} Q${R - 2} ${cy - ry * 0.05} ${R - 7} ${y0 - 3} Z`, hc);
  }
  const lockTexture = (path, hd) => `<path d="${path}" fill="none" stroke="${hd}" stroke-width="7" stroke-dasharray="1.4 5" stroke-opacity="0.45"/>`;

  const HAIR_FN = {
    crop: (g, hc) => ({ front: P(cropPath(g), hc) }),
    swept: (g, hc) => ({ front: P(capArc(g, 2, 6) + d` L${g.cx + g.rx + 1} ${g.y0 + 4} Q${g.cx + g.rx * 0.4} ${g.top + g.ry * 0.55} ${g.cx - g.rx * 0.15} ${g.top + g.ry * 0.36} Q${g.cx - g.rx * 0.6} ${g.top + g.ry * 0.24} ${g.cx - g.rx - 1} ${g.y0 + 2} Z`, hc) }),
    sidepart: (g, hc, acc, hd) => {
      const { cx, rx, ry, y0, top } = g;
      return { front: P(capArc(g, 2, 6) + d` L${cx + rx + 1} ${y0 + 5} Q${cx + rx - 4} ${top + ry * 0.26} ${cx - rx * 0.3} ${top + ry * 0.22} Q${cx - rx + 4} ${top + ry * 0.3} ${cx - rx - 1} ${y0 + 5} Z`, hc) + S(d`M${cx - rx * 0.36} ${top + ry * 0.2} Q${cx - rx * 0.32} ${top + 2} ${cx - rx * 0.18} ${top - 4}`, hd, 1.5) };
    },
    quiff: (g, hc) => {
      const { cx, rx, ry, y0, top } = g, L = cx - rx, R = cx + rx;
      return { front: P(capArc(g, 2, 6) + d` L${R + 1} ${y0 + 5} Q${R - 6} ${top + ry * 0.25} ${cx} ${top + ry * 0.28} Q${L + 6} ${top + ry * 0.25} ${L - 1} ${y0 + 5} Z`, hc) +
        P(d`M${L + 2} ${top + ry * 0.3} Q${L - 2} ${top - 12} ${cx} ${top - 18} Q${R + 4} ${top - 16} ${R + 2} ${top + ry * 0.25} Q${cx + rx * 0.3} ${top + ry * 0.05} ${L + 2} ${top + ry * 0.3} Z`, hc) +
        S(d`M${cx - rx * 0.45} ${top - 5} Q${cx} ${top - 14} ${cx + rx * 0.5} ${top - 8}`, '#FFFFFF', 1.5, ' stroke-opacity="0.3"') };
    },
    spiky: (g, hc) => {
      const { cx, rx, ry, y0, top } = g, N = 12;
      let s = '';
      for (let i = 0; i <= N; i++) {
        const t = Math.PI - i * Math.PI / N, e = (i % 2 && i > 1 && i < N - 1) ? 13 : 3;
        s += (i ? ' L' : 'M') + d`${cx + (rx + e) * Math.cos(t)} ${y0 - (ry + e) * Math.sin(t)}`;
      }
      s += d` L${cx + rx + 1} ${y0 + 6} Q${cx + rx * 0.55} ${top + ry * 0.2} ${cx + rx * 0.05} ${top + ry * 0.3} Q${cx - rx * 0.5} ${top + ry * 0.38} ${cx - rx - 1} ${y0 + 6} Z`;
      return { front: P(s, hc) };
    },
    mohawk: (g, hc) => {
      const { cx, ry, top } = g;
      return { front: P(capQ(g, 1, 2, 0.3), hc, ' opacity="0.45"') + P(d`M${cx - 9} ${top + ry * 0.28} L${cx - 10} ${top - 2} L${cx - 7} ${top - 14} L${cx - 3} ${top - 5} L${cx + 1} ${top - 19} L${cx + 4} ${top - 6} L${cx + 8} ${top - 14} L${cx + 10} ${top - 1} L${cx + 9} ${top + ry * 0.28} Z`, hc) };
    },
    buzz: (g, hc) => ({ front: P(capQ(g, 1, 2, 0.26), hc, ' opacity="0.9"') }),
    curly: (g, hc) => ({ front: P(capQ(g, 2, 5, 0.3), hc) + rimCurls(g, hc, 8, 1) + fringeCurls(g, hc, 7.5, 0.28) }),
    afro: (g, hc) => {
      const { cx, cy, rx, ry } = g, ecy = cy - ry * 0.22, ea = rx * 1.48, eb = ry * 1.06;
      let back = E(cx, ecy, ea, eb, hc);
      for (let i = 0; i < 16; i++) {
        const t = Math.PI * 2 * i / 16;
        if (Math.sin(t) > 0.35) continue;
        back += C(cx + ea * Math.cos(t), ecy + eb * Math.sin(t), 9, hc);
      }
      return { back, front: P(capQ(g, 2, 5, 0.3), hc) + fringeCurls(g, hc, 7.5, 0.28) };
    },
    perm: (g, hc) => {
      const { cx, cy, rx, ry } = g, ecy = cy - ry * 0.35, ea = rx * 1.18, eb = ry * 0.8;
      let back = E(cx, ecy, ea, eb, hc);
      for (let i = 0; i < 16; i++) {
        const t = Math.PI * 2 * i / 16;
        if (Math.sin(t) > 0.2) continue;
        back += C(cx + ea * Math.cos(t), ecy + eb * Math.sin(t), 7.5, hc);
      }
      return { back, front: P(capQ(g, 2, 5, 0.3), hc) + fringeCurls(g, hc, 6.5, 0.26) };
    },
    locs: (g, hc, acc, hd) => {
      const { cx, cy, rx, ry, y0, top, sh } = g, L = cx - rx, R = cx + rx;
      let strands = '';
      for (let i = 0; i < 10; i++) {
        const x = L - 5 + i * (2 * rx + 10) / 9;
        strands += d`M${x} ${y0}L${x + (i < 5 ? -2 : 2)} ${cy + ry * (1.15 + (i * 7 % 3) * 0.08)}`;
      }
      const back = P(capArc(g, 6, 9) + d` L${R + 6} ${cy} L${L - 6} ${cy} Z`, hc) + S(strands, hc, 7.5) + lockTexture(strands, hd);
      const mids = d`M${L - 3} ${cy}L${L - 6} ${sh + 16}M${L + 4} ${cy + ry * 0.3}L${L + 2} ${sh + 12}M${R + 3} ${cy}L${R + 6} ${sh + 16}M${R - 4} ${cy + ry * 0.3}L${R - 2} ${sh + 12}`;
      const fr = d`M${L + 3} ${top + ry * 0.4}L${L - 1} ${cy + ry * 0.5}M${R - 3} ${top + ry * 0.4}L${R + 1} ${cy + ry * 0.5}`;
      return {
        back,
        mid: S(mids, hc, 7) + lockTexture(mids, hd),
        front: P(capArc(g, 3, 7) + d` L${R + 2} ${y0 + 8} Q${cx + rx * 0.5} ${top + ry * 0.28} ${cx} ${top + ry * 0.3} Q${cx - rx * 0.5} ${top + ry * 0.28} ${L - 2} ${y0 + 8} Z`, hc) + S(fr, hc, 7) + lockTexture(fr, hd),
      };
    },
    cornrows: (g, hc, acc, hd) => {
      const { cx, rx, ry, top } = g;
      let rows = '';
      for (let i = -3; i <= 3; i++) rows += d`M${cx + i * rx * 0.2} ${top + ry * 0.22}Q${cx + i * rx * 0.24} ${top + ry * 0.05} ${cx + i * rx * 0.27} ${top - 2}`;
      return { front: P(capQ(g, 1, 3, 0.24), hc) + S(rows, hd, 1.6, ' stroke-dasharray="2.2 2"') };
    },
    shaggy: (g, hc) => {
      const { cx, cy, rx, ry, y0, top } = g, L = cx - rx, R = cx + rx;
      const back = P(d`M${L - 6} ${y0} A${rx + 6} ${ry + 9} 0 0 1 ${R + 6} ${y0} L${R + 7} ${cy + ry * 0.2} L${R + 1} ${cy + ry * 0.12} L${R + 4} ${cy + ry * 0.34} L${L - 4} ${cy + ry * 0.34} L${L - 1} ${cy + ry * 0.12} L${L - 7} ${cy + ry * 0.2} Z`, hc);
      let f = capArc(g, 4, 8) + d` L${R + 4} ${cy + ry * 0.05}`;
      for (let i = 0; i <= 6; i++) f += d` L${R - 2 - i * (2 * rx - 4) / 6} ${top + ry * (i % 2 ? 0.48 : 0.32)}`;
      return { back, front: P(f + d` L${L - 4} ${cy + ry * 0.05} Z`, hc) };
    },
    shoulder: (g, hc) => ({ back: bobBack(g, hc, 0.85), front: curtainFront(g, hc) }),
    bob: (g, hc) => {
      const { cx, cy, rx, ry, top } = g;
      const front = P(capArc(g, 4, 8) + d` L${cx + rx + 4} ${cy + ry * 0.3} Q${cx + rx + 2} ${top + ry * 0.5} ${cx + rx * 0.55} ${top + ry * 0.38} Q${cx} ${top + ry * 0.46} ${cx - rx * 0.55} ${top + ry * 0.38} Q${cx - rx - 2} ${top + ry * 0.5} ${cx - rx - 4} ${cy + ry * 0.3} Z`, hc);
      return { back: bobBack(g, hc, 0.55), front };
    },
    pixie: (g, hc) => {
      const { cx, rx, ry, y0, top } = g;
      return { front: P(capArc(g, 2, 5) + d` L${cx + rx + 1} ${y0 + 2} Q${cx + rx - 2} ${top + ry * 0.3} ${cx + rx * 0.2} ${top + ry * 0.26} L${cx - rx * 0.35} ${top + ry * 0.52} Q${cx - rx * 0.62} ${top + ry * 0.4} ${cx - rx - 1} ${y0 + 8} Z`, hc) };
    },
    long: (g, hc) => ({ back: longBack(g, hc, false), mid: sideStrands(g, hc), front: longFront(g, hc) }),
    wavy: (g, hc) => ({ back: longBack(g, hc, true), front: longFront(g, hc) }),
    curtain: (g, hc) => ({ back: longBack(g, hc, false), mid: sideStrands(g, hc), front: curtainFront(g, hc) }),
    bangslong: (g, hc) => {
      const { cx, cy, rx, ry, top } = g, L = cx - rx, R = cx + rx;
      return { back: longBack(g, hc, false), mid: sideStrands(g, hc), front: P(capArc(g, 4, 9) + d` L${R + 4} ${cy + ry * 0.4} Q${R} ${cy} ${R - 1} ${top + ry * 0.5} L${L + 1} ${top + ry * 0.5} Q${L} ${cy} ${L - 4} ${cy + ry * 0.4} Z`, hc) };
    },
    ponytail: (g, hc, acc) => {
      const { cx, cy, rx, ry, top } = g;
      const back = P(d`M${cx + rx * 0.5} ${top + ry * 0.15} Q${cx + rx + 26} ${cy - ry * 0.35} ${cx + rx + 16} ${cy + ry * 0.55} Q${cx + rx + 8} ${cy + ry * 0.1} ${cx + rx - 4} ${cy - ry * 0.3} Z`, hc) + C(cx + rx + 3, top + ry * 0.32, 4, acc);
      return { back, front: HAIR_FN.swept(g, hc).front };
    },
    bun: (g, hc) => ({ back: C(g.cx, g.top - g.ry * 0.08, g.rx * 0.42, hc), front: centerPart(g, hc) }),
    manbun: (g, hc, acc, hd) => ({ back: C(g.cx, g.top - 8, 10, hc), front: P(capQ(g, 2, 4, 0.2), hc) + S(d`M${g.cx - g.rx * 0.4} ${g.top + g.ry * 0.18} Q${g.cx} ${g.top - 4} ${g.cx + g.rx * 0.4} ${g.top + g.ry * 0.18}`, hd, 1.2, ' stroke-opacity="0.6"') }),
    twinbraids: (g, hc, acc, hd) => {
      const { cx, cy, rx, ry } = g;
      let mid = '';
      for (const sgn of [-1, 1]) {
        let y = cy + ry * 0.35, x = cx + sgn * (rx + 1);
        for (let k = 0; k < 7; k++) { mid += E(x, y, 5.5, 6.5, hc, ` stroke="${hd}" stroke-width="1"`); y += 9; x += sgn * 0.8; }
        mid += C(x, y - 3, 3.5, acc);
      }
      return { back: P(capArc(g, 4, 7) + d` L${cx + rx + 4} ${cy} L${cx - rx - 4} ${cy} Z`, hc), mid, front: centerPart(g, hc) };
    },
    pigtails: (g, hc, acc) => {
      const { cx, cy, rx, ry } = g, yy = cy - ry * 0.2;
      let back = '';
      for (const sgn of [-1, 1]) {
        const x = cx + sgn * (rx + 9);
        back += E(x, yy, 9, 17, hc, ` transform="rotate(${sgn * -20} ${r1(x)} ${r1(yy)})"`);
        back += C(cx + sgn * (rx + 2), cy - ry * 0.34, 3.5, acc);
      }
      return { back, front: centerPart(g, hc) };
    },
    puffs: (g, hc, acc, hd) => {
      const { cx, rx, ry, top } = g;
      let back = '';
      for (const sgn of [-1, 1]) {
        const x = cx + sgn * rx * 0.78, y = top + 4;
        back += C(x, y, 16, hc);
        for (let i = 0; i < 7; i++) { const t = Math.PI * (1 + i / 6); back += C(x + 16 * Math.cos(t), y + 16 * Math.sin(t), 6, hc); }
      }
      return { back, front: P(capQ(g, 2, 4, 0.24), hc) + S(d`M${cx} ${top + ry * 0.2} L${cx} ${top - 3}`, hd, 1.4) };
    },
    receding: (g, hc) => {
      const { cx, rx, ry, y0, top } = g;
      return { front: P(capArc(g, 1, 3) + d` Q${cx + rx - 6} ${top + ry * 0.3} ${cx + rx * 0.3} ${top + ry * 0.12} Q${cx} ${top + ry * 0.3} ${cx - rx * 0.3} ${top + ry * 0.12} Q${cx - rx + 6} ${top + ry * 0.3} ${cx - rx - 1} ${y0} Z`, hc, ' opacity="0.9"') + tufts(g, hc) };
    },
    combover: (g, hc) => {
      const { cx, rx, ry, top } = g;
      return { front: tufts(g, hc) + P(capQ(g, 1, 2, 0.22), hc, ' opacity="0.5"') + S(d`M${cx - rx + 4} ${top + ry * 0.3} Q${cx} ${top - 6} ${cx + rx - 2} ${top + ry * 0.12}M${cx - rx + 6} ${top + ry * 0.4} Q${cx} ${top} ${cx + rx - 4} ${top + ry * 0.22}`, hc, 1.6) };
    },
    bald: (g, hc) => {
      const { cx, rx, ry, top } = g, x = cx - rx * 0.35, y = top + ry * 0.22;
      return { front: tufts(g, hc) + E(x, y, 8, 4, '#FFFFFF', ` opacity="0.3" transform="rotate(-25 ${r1(x)} ${r1(y)})"`) };
    },
    fuzz: (g, hc) => ({ front: P(capQ(g, 0, 1, 0.22), hc, ' opacity="0.45"') }),
    tuft: (g, hc) => ({ front: P(capQ(g, 0, 1, 0.18), hc, ' opacity="0.3"') + S(d`M${g.cx} ${g.top + 4} Q${g.cx - 4} ${g.top - 10} ${g.cx + 5} ${g.top - 12} Q${g.cx + 12} ${g.top - 9} ${g.cx + 7} ${g.top - 3}`, hc, 3) }),
    tuft2: (g, hc) => ({ front: P(capQ(g, 0, 1, 0.18), hc, ' opacity="0.3"') + S(d`M${g.cx - 6} ${g.top + 4} Q${g.cx - 12} ${g.top - 8} ${g.cx - 4} ${g.top - 10} Q${g.cx + 1} ${g.top - 7} ${g.cx - 3} ${g.top - 3}`, hc, 2.6) + S(d`M${g.cx + 4} ${g.top + 3} Q${g.cx + 2} ${g.top - 11} ${g.cx + 11} ${g.top - 10} Q${g.cx + 16} ${g.top - 5} ${g.cx + 10} ${g.top - 2}`, hc, 2.6) }),
    babycurls: (g, hc) => {
      let s = P(capQ(g, 0, 1, 0.2), hc, ' opacity="0.4"');
      for (let i = 0; i < 5; i++) s += C(g.cx - 14 + i * 7, g.top + 1 - (i % 2) * 3, 4.2, hc);
      return { front: s };
    },
    sprout: (g, hc, acc) => ({ front: P(capQ(g, 0, 1, 0.2), hc, ' opacity="0.4"') + P(d`M${g.cx - 4} ${g.top + 2} Q${g.cx - 9} ${g.top - 14} ${g.cx} ${g.top - 17} Q${g.cx + 9} ${g.top - 14} ${g.cx + 4} ${g.top + 2} Z`, hc) + C(g.cx, g.top + 1, 2.8, acc) }),
  };

  // ---------- headwear ----------
  function headwear(kind, g, hue) {
    const { cx, cy, rx, ry, top, y0 } = g, L = cx - rx, R = cx + rx;
    const h1 = hsl(hue, 55, 52), h2 = hsl(hue, 50, 38), h3 = hsl(hue, 60, 82);
    switch (kind) {
      case 'beanie': case 'knit': {
        let ribs = '';
        for (let i = 1; i < 12; i++) ribs += d`M${L - 5 + i * (2 * rx + 10) / 12} ${top + ry * 0.31}l0 ${ry * 0.15}`;
        return P(d`M${L - 4} ${top + ry * 0.42} C${L - 4} ${top - 24} ${R + 4} ${top - 24} ${R + 4} ${top + ry * 0.42} Z`, h1) +
          `<rect x="${r1(L - 5)}" y="${r1(top + ry * 0.29)}" width="${r1(2 * rx + 10)}" height="${r1(ry * 0.19)}" rx="4" fill="${h2}"/>` +
          S(ribs, h1, 1.2, ' stroke-opacity="0.5"') + C(cx, top - 14, kind === 'knit' ? 8 : 6.5, h3);
      }
      case 'cap':
        return P(d`M${L - 3} ${top + ry * 0.38} C${L - 3} ${top - 22} ${R + 3} ${top - 22} ${R + 3} ${top + ry * 0.38} Z`, h1) +
          S(d`M${cx} ${top - 11} L${cx} ${top + ry * 0.3}`, h2, 1.2) + C(cx, top - 11, 2.6, h2) +
          P(d`M${L - 2} ${top + ry * 0.36} Q${cx} ${top + ry * 0.26} ${R + 2} ${top + ry * 0.36} Q${cx} ${top + ry * 0.66} ${L - 2} ${top + ry * 0.36} Z`, h2);
      case 'bucket':
        return P(d`M${L + 1} ${top + ry * 0.32} C${L + 1} ${top - 20} ${R - 1} ${top - 20} ${R - 1} ${top + ry * 0.32} Z`, h1) +
          P(d`M${L - 14} ${top + ry * 0.52} L${L - 1} ${top + ry * 0.28} L${R + 1} ${top + ry * 0.28} L${R + 14} ${top + ry * 0.52} Q${cx} ${top + ry * 0.64} ${L - 14} ${top + ry * 0.52} Z`, h2);
      case 'beret':
        return E(cx + 5, top - 1, rx + 9, 12, h2, ` transform="rotate(-8 ${r1(cx + 5)} ${r1(top - 1)})"`) + C(cx + 8, top - 13, 3, h2);
      case 'flatcap': {
        const t1 = hsl(hue, 18, 42), t2 = hsl(hue, 18, 30);
        return P(d`M${L - 3} ${top + ry * 0.42} Q${L - 3} ${top - 11} ${cx} ${top - 13} Q${R + 7} ${top - 11} ${R + 6} ${top + ry * 0.38} Z`, t1) +
          P(d`M${L - 1} ${top + ry * 0.38} Q${cx} ${top + ry * 0.28} ${R + 3} ${top + ry * 0.36} Q${cx + 4} ${top + ry * 0.56} ${L - 1} ${top + ry * 0.38} Z`, t2);
      }
      case 'sunhat': {
        const by = top + ry * 0.32;
        return E(cx, by, rx + 30, 10, h3) +
          P(d`M${L + 2} ${by + 2} C${L + 2} ${top - 22} ${R - 2} ${top - 22} ${R - 2} ${by + 2} Z`, h3) +
          `<rect x="${r1(L + 2)}" y="${r1(by - 8)}" width="${r1(2 * rx - 4)}" height="6" fill="${h1}"/>` +
          P(d`M${cx - rx - 30} ${by} A${rx + 30} 10 0 0 0 ${cx + rx + 30} ${by} Z`, h3);
      }
      case 'bonnet': {
        const b1 = hsl(hue, 60, 84), b2 = hsl(hue, 45, 66);
        return P(d`M${L - 7} ${cy + ry * 0.3} C${L - 9} ${top - 36} ${R + 9} ${top - 36} ${R + 7} ${cy + ry * 0.3} L${R - 1} ${cy + ry * 0.25} C${R} ${top + ry * 0.1} ${L} ${top + ry * 0.1} ${L + 1} ${cy + ry * 0.25} Z`, b1) +
          S(d`M${L + 1} ${cy + ry * 0.25} C${L} ${top + ry * 0.1} ${R} ${top + ry * 0.1} ${R - 1} ${cy + ry * 0.25}`, b2, 2.5) +
          S(d`M${L - 4} ${cy + ry * 0.35} L${cx - 5} ${cy + ry * 1.05}M${R + 4} ${cy + ry * 0.35} L${cx + 5} ${cy + ry * 1.05}`, b2, 2.5) + C(cx, cy + ry * 1.06, 3.5, b2);
      }
      case 'headband':
        return S(d`M${L} ${y0 + 2} A${rx} ${ry + 3} 0 0 1 ${R} ${y0 + 2}`, h1, 5);
      case 'flower': {
        const fx = cx - rx * 0.62, fy = top + ry * 0.28;
        let s = '';
        for (let i = 0; i < 5; i++) { const t = i / 5 * 2 * Math.PI - Math.PI / 2; s += C(fx + 5 * Math.cos(t), fy + 5 * Math.sin(t), 3.6, h3); }
        return s + C(fx, fy, 2.6, '#F2C14E');
      }
    }
    return '';
  }

  // ---------- animation helpers ----------
  // A small PRNG seeded from the hash: motion parameters differ per identity, but stay deterministic.
  function rng(b) {
    let a = (b[24] << 24 | b[25] << 16 | b[26] << 8 | b[27]) ^ (b[8] << 24 | b[9] << 16 | b[10] << 8 | b[11]);
    return () => {
      a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  const n2 = v => String(Math.round(v * 100) / 100);
  const pct = v => n2(v) + '%';

  // ---------- art styles (SVG filters) ----------
  const ARTS = ['flat', 'pixel', 'ink', 'comic', 'sketch', 'neon', 'pop', 'mood', 'watercolor', 'glitch'];
  const EDGE = '<feConvolveMatrix in="SourceGraphic" order="3" kernelMatrix="-1 -1 -1 -1 8 -1 -1 -1 -1" preserveAlpha="true" result="e"/>';
  const ft = (r, g, b, type) => `<feFuncR type="${type}" tableValues="${r}"/><feFuncG type="${type}" tableValues="${g}"/><feFuncB type="${type}" tableValues="${b}"/>`;
  const lin = (s, i) => `<feFuncR type="linear" slope="${s}" intercept="${i}"/><feFuncG type="linear" slope="${s}" intercept="${i}"/><feFuncB type="linear" slope="${s}" intercept="${i}"/>`;
  const GRAIN = seed => `<feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="1" seed="${seed}" result="n"/>` +
    '<feColorMatrix in="n" type="matrix" values="0 0 0 0 0.2 0 0 0 0 0.18 0 0 0 0 0.15 0 0 0 -0.5 0.32" result="n2"/>';
  const MOODS = [
    '<feColorMatrix type="matrix" values="1.12 0.08 0 0 0.03 0 1 0.02 0 0.02 0 0 0.78 0 0 0 0 0 1 0"/>',
    '<feColorMatrix type="saturate" values="0.35"/><feColorMatrix type="matrix" values="0.85 0 0 0 0 0 0.92 0 0 0.02 0 0 1.05 0 0.08 0 0 0 1 0"/>',
    '<feColorMatrix type="matrix" values="0.8 0.2 0.1 0 0.12 0.1 0.7 0.2 0 0.1 0.2 0.1 0.8 0 0.16 0 0 0 1 0"/>',
    `<feColorMatrix type="saturate" values="0"/><feComponentTransfer>${ft('0 0.05 0.6 1', '0 0.05 0.6 1', '0 0.05 0.6 1', 'table')}</feComponentTransfer>`,
    '<feColorMatrix type="matrix" values="0.39 0.77 0.19 0 0.02 0.35 0.69 0.17 0 0.01 0.27 0.53 0.13 0 0 0 0 0 1 0"/>',
  ];
  function artFilter(art, id, b, anim, rnd, size) {
    const seed = b[20] % 97, f = (s) => `<filter id="${id}F" filterUnits="userSpaceOnUse" x="0" y="0" width="256" height="256" color-interpolation-filters="sRGB">${s}</filter>`;
    switch (art) {
      case 'pixel': {
        // erode first so thin dark details (eyes, brows, outlines) survive the point sampling
        // the sample square must stay at least ~1.5 screen px wide, or small renders come out empty
        const p = 5, fw = Math.min(p * 0.8, Math.max(2, 384 / size)), er = 1.2;
        return f(`<feMorphology in="SourceGraphic" operator="erode" radius="${n2(er)}" result="src"/><feFlood x="${n2((p - fw) / 2)}" y="${n2((p - fw) / 2)}" width="${n2(fw)}" height="${n2(fw)}"/><feComposite width="${p}" height="${p}"/><feTile result="a"/><feComposite in="src" in2="a" operator="in"/><feMorphology operator="dilate" radius="${n2(p / 2)}"/>`);
      }
      case 'ink':
        return f('<feColorMatrix in="SourceGraphic" type="saturate" values="0" result="g"/>' +
          `<feComponentTransfer in="g" result="c">${ft('0.06 0.12 0.45 0.96 0.98', '0.06 0.12 0.44 0.94 0.96', '0.08 0.13 0.42 0.88 0.9', 'table')}</feComponentTransfer>` +
          `<feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" seed="${seed}" result="t"/>` +
          '<feDisplacementMap in="c" in2="t" scale="7" xChannelSelector="R" yChannelSelector="G" result="w"/><feGaussianBlur in="w" stdDeviation="0.5" result="bl"/>' +
          GRAIN(seed) + '<feComposite in="n2" in2="bl" operator="in" result="n3"/><feMerge><feMergeNode in="bl"/><feMergeNode in="n3"/></feMerge>');
      case 'comic':
        return f(`<feComponentTransfer in="SourceGraphic" result="p">${ft('0.1 0.4 0.7 1', '0.1 0.4 0.7 1', '0.1 0.4 0.7 1', 'discrete')}</feComponentTransfer>` +
          '<feColorMatrix in="p" type="saturate" values="1.5" result="s"/>' + EDGE +
          '<feColorMatrix in="e" type="matrix" values="0 0 0 0 0.08 0 0 0 0 0.07 0 0 0 0 0.1 3 3 3 0 0" result="l"/><feMorphology in="l" operator="dilate" radius="0.8" result="l2"/>' +
          '<feMerge><feMergeNode in="s"/><feMergeNode in="l2"/></feMerge>');
      case 'sketch':
        return f('<feColorMatrix in="SourceGraphic" type="saturate" values="0" result="g"/>' +
          '<feConvolveMatrix in="g" order="3" kernelMatrix="-1 -1 -1 -1 8 -1 -1 -1 -1" preserveAlpha="true" result="e"/>' +
          '<feColorMatrix in="e" type="matrix" values="0 0 0 0 0.22 0 0 0 0 0.22 0 0 0 0 0.25 5 5 5 0 0" result="l"/>' +
          `<feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="2" seed="${seed}" result="t"/>` +
          '<feDisplacementMap in="l" in2="t" scale="3.5" xChannelSelector="R" yChannelSelector="G" result="w"/>' +
          `<feComponentTransfer in="g" result="sh">${lin(0.4, 0.6)}</feComponentTransfer>` +
          '<feMerge><feMergeNode in="sh"/><feMergeNode in="w"/></feMerge>');
      case 'neon':
        return f(EDGE + '<feColorMatrix in="e" type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 4 4 4 0 0" result="m"/>' +
          `<feColorMatrix in="SourceGraphic" type="saturate" values="3" result="s"/><feComponentTransfer in="s" result="s2">${lin(0.6, 0.45)}</feComponentTransfer>` +
          '<feComposite in="s2" in2="m" operator="in" result="ln"/><feMorphology in="ln" operator="dilate" radius="0.6" result="ln2"/><feGaussianBlur in="ln2" stdDeviation="2.5" result="gl"/>' +
          '<feFlood flood-color="#0B0B16" result="dk"/><feComposite in="dk" in2="SourceAlpha" operator="in" result="bg"/>' +
          '<feMerge><feMergeNode in="bg"/><feMergeNode in="gl"/><feMergeNode in="gl"/><feMergeNode in="ln2"/></feMerge>');
      case 'pop':
        return f(`<feColorMatrix in="SourceGraphic" type="saturate" values="2.4"/><feColorMatrix type="hueRotate" values="${b[22] * 360 >> 8}"/>` +
          `<feComponentTransfer result="p">${ft('0 0.55 1', '0 0.55 1', '0 0.55 1', 'discrete')}</feComponentTransfer>` + EDGE +
          '<feColorMatrix in="e" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 3 3 3 0 0" result="l"/><feMorphology in="l" operator="dilate" radius="1" result="l2"/>' +
          '<feMerge><feMergeNode in="p"/><feMergeNode in="l2"/></feMerge>');
      case 'mood':
        return f(MOODS[b[23] % MOODS.length]);
      case 'watercolor':
        return f(`<feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" seed="${seed}" result="t"/>` +
          '<feDisplacementMap in="SourceGraphic" in2="t" scale="6" xChannelSelector="R" yChannelSelector="G" result="d"/><feGaussianBlur in="d" stdDeviation="0.8" result="bl"/>' +
          '<feGaussianBlur in="bl" stdDeviation="3" result="bl2"/><feComposite in="bl" in2="bl2" operator="arithmetic" k2="1.7" k3="-0.7" result="ed"/>' +
          `<feComponentTransfer in="ed" result="l">${lin(0.82, 0.16)}</feComponentTransfer>` +
          GRAIN(seed) + '<feComposite in="n2" in2="l" operator="in" result="n3"/><feMerge><feMergeNode in="l"/><feMergeNode in="n3"/></feMerge>');
      case 'glitch': {
        const dx = 2 + (b[21] & 3), dur = n2(1.6 + rnd() * 2.4);
        const a = attr => anim ? `<animate attributeName="dx" values="${attr}" dur="${dur}s" repeatCount="indefinite" calcMode="discrete"/>` : '';
        return f('<feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" result="r"/>' +
          `<feOffset in="r" dx="${dx}" result="ro">${a(`${dx};${-dx};${dx * 2};0;${dx}`)}</feOffset>` +
          '<feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0" result="c"/>' +
          `<feOffset in="c" dx="${-dx}" result="co">${a(`${-dx};${dx};0;${-dx * 2};${-dx}`)}</feOffset>` +
          '<feBlend in="ro" in2="co" mode="screen"/>');
      }
    }
    return '';
  }

  // ---------- render ----------
  const HUMANS = ['asian', 'white', 'black', 'brown', 'auto'];
  const HUMANOIDS = ['elf', 'orc', 'vampire', 'zombie', 'oni', 'demon', 'angel', 'cyborg'];
  const CREATURES = ['cat', 'dog', 'fox', 'kitsune', 'panda', 'rabbit', 'bear', 'owl', 'penguin', 'frog', 'monkey', 'dragon', 'robot', 'ai', 'alien', 'ghost', 'skeleton', 'slime'];
  const RACES = HUMANS.concat(HUMANOIDS, CREATURES, ['any']);
  const ANY = RACES.filter(r => r !== 'auto' && r !== 'any');
  const GLASSES_OK = { cat: 1, dog: 1, fox: 1, kitsune: 1, rabbit: 1, bear: 1, monkey: 1, penguin: 1, skeleton: 1 };
  const NO_HAT = { oni: 1, demon: 1, angel: 1 };

  function avatar(input, opts) {
    const gender = GENDERS.indexOf(opts.gender) >= 0 ? opts.gender : 'neutral';
    const age = AGES.indexOf(opts.age) >= 0 ? opts.age : 'youth';
    let race = RACES.indexOf(opts.race) >= 0 ? opts.race : 'auto';
    const size = opts.size || 256;
    const fp = opts.fingerprint !== false, anim = opts.animate !== false;
    let art = ARTS.indexOf(opts.art) >= 0 ? opts.art : 'flat';
    // below ~96 px a 5-unit pixel cell is under 2 screen px: browsers drop such filter tiles,
    // and 1-px cells look the same as the plain raster anyway
    if (art === 'pixel' && size < 96) art = 'flat';
    const force = opts._force || {};
    const H = hash(input, opts.salt), b = H.bytes;
    // bytes 0..15 are drawn as the fingerprint ring; 16..31 drive the main features (fixed slots).
    // Secondary features reuse bytes 0..15: uniqueness comes from the ring, so reuse costs nothing.
    const F = i => b[16 + i], X = i => b[i];
    const pick = (arr, v) => arr[v % arr.length];
    if (race === 'any') race = pick(ANY, X(5) | X(6) << 8);
    const creature = CREATURES.indexOf(race) >= 0, humanoid = HUMANOIDS.indexOf(race) >= 0;

    const baby = age === 'baby', old = age === 'old', middle = age === 'middle', teen = age === 'teen';
    const male = gender === 'male', female = gender === 'female';
    const band = baby ? 'baby' : old ? 'old' : middle ? 'middle' : 'young';

    // features
    const bgHue = F(0) / 256 * 360;
    const fur = creature ? pick(FUR[race], F(1)) : null;
    const skin = creature ? fur : pick(SKIN_BY[race], F(1));
    let hair = old ? pick(HAIR_OLD, F(2)) : pick(HAIR_BY[creature ? 'auto' : race], F(2));
    const misc = F(14), deco = F(15);
    if (middle && (misc >> 6) === 3) hair = mix(hair, '#B4B4AF', 0.45);
    const base = STYLES[gender][band], bonus = STYLE_BONUS[race] || STYLE_BONUS.auto;
    let styles = base.slice();
    for (let k = 0; k < bonus[1]; k++) for (const s of bonus[0]) if (base.indexOf(s) >= 0) styles.push(s);
    const style = force.style || pick(styles, F(3) | X(4) << 8);
    const eyeStyle = pick(baby ? ['dot', 'oval', 'oval'] : ['dot', 'oval', 'happy', 'sleepy', 'dot', 'oval'], F(4));
    const eyeColor = creature ? pick(CEYE[race] || CEYE._, F(5)) : pick(EYE_BY[race], F(5));
    const browStyle = pick(['straight', 'arched', 'angled', 'thick', 'raised'], F(6));
    const noseStyle = baby ? 'button' : pick(['hook', 'button', 'nostrils'], F(7));
    const mouthStyle = pick(baby ? ['smile', 'o', 'pacifier', 'grin'] : ['smile', 'grin', 'o', 'smirk', 'flat', 'smile'], F(8));
    const glassList = baby ? ['none'] : old ? ['none', 'round', 'rect', 'half', 'round', 'rect'] : middle ? ['none', 'none', 'none', 'round', 'rect', 'half', 'rect', 'sun'] : ['none', 'none', 'none', 'none', 'round', 'rect', 'half', 'sun'];
    let glasses = force.glasses || pick(glassList, F(9)), glassColor = pick(GLASS, F(9) >> 4);
    if ((creature && !GLASSES_OK[race]) || race === 'cyborg') glasses = 'none';
    const beardList = (!male || baby || teen || creature) ? ['none']
      : old ? ['none', 'none', 'mustache', 'beard', 'longbeard', 'goatee', 'handlebar', 'longbeard']
      : middle ? ['none', 'none', 'stubble', 'mustache', 'beard', 'goatee', 'chinstrap', 'beard', 'handlebar', 'sideburns']
      : ['none', 'none', 'none', 'stubble', 'mustache', 'beard', 'goatee', 'chinstrap', 'soulpatch', 'sideburns', 'handlebar'];
    const beard = force.beard || pick(beardList, F(10));
    let acc = creature ? 'none' : pick(baby ? ['none'] : male ? ['none', 'none', 'headphones', 'none'] : ['none', 'none', 'headphones', 'earrings'], F(11));
    const clothList = baby ? ['onesie', 'stripes', 'overalls'] : ['tee', 'hoodie', 'collar', 'cardigan', 'suit', 'turtleneck', 'stripes', 'overalls'];
    const cloth = force.cloth || pick(clothList, F(12));
    const clothHue = F(13) / 256 * 360;
    const freckles = !baby && !creature && (misc >> 4 & 1), blush = baby || (misc >> 5 & 1);
    const none = n => Array(n).fill('none');
    const hatList = baby ? ['none', 'none', 'knit', female ? 'bonnet' : 'knit']
      : old ? none(7).concat(['beanie', 'cap', male ? 'flatcap' : female ? 'sunhat' : 'beret'])
      : middle ? none(9).concat(['beanie', 'cap', 'beret', male ? 'flatcap' : 'headband'])
      : none(12).concat(['beanie', 'cap', 'bucket', 'beret', 'headband', male ? 'beanie' : 'flower']);
    let hat = force.hat || pick(hatList, X(0));
    if (creature || NO_HAT[race]) hat = 'none';
    if (COVERING[hat] && TALL[style]) hat = 'none';
    if (COVERING[hat] && acc === 'headphones') acc = 'none';
    const hatHue = X(1) / 256 * 360;

    // geometry
    const G0 = GEO[age], cx = 128, cy = G0.cy;
    const rx = G0.rx + (misc & 3) - 1, ry = G0.ry + (misc >> 2 & 3) - 1;
    const top = cy - ry, L = cx - rx, R = cx + rx, sh = cy + ry + (baby ? 16 : 20);
    const g = { cx, cy, rx, ry, top, y0: cy - ry * 0.12, sh };

    // colors
    const skinD = shade(skin, 0.88), skinDD = shade(skin, 0.68), hairD = shade(hair, old ? 0.8 : 0.72);
    const lip = mix(shade(skin, 0.55), '#9A3A28', 0.55), inner = mix(shade(skin, 0.4), '#5A1A12', 0.6);
    const clothC = hsl(clothHue, 55, baby ? 72 : 52), clothD = hsl(clothHue, 50, baby ? 58 : 38), clothL = hsl(clothHue, 60, 82);
    const bg = hsl(bgHue, 55, 74), bgL = hsl(bgHue, 60, 85), bgD = hsl(bgHue, 45, 62);
    const id = 'ha' + H.hex.slice(0, 12) + gender[0] + age[0] + RACES.indexOf(race).toString(36) + (fp ? 'f' : 'n') + ARTS.indexOf(art) + (anim ? 'a' : 's');
    const R0 = fp ? 106 : 128;
    const rnd = rng(b);
    const cls = n => anim ? ` class="${id}${n}"` : '';
    // fingerprint wave: speed, direction and number of crests per identity
    const rp = 3 + rnd() * 6, waves = 1 + (rnd() * 3 | 0), dir = rnd() < 0.5 ? 1 : -1;
    const arcDelay = j => n2((((dir > 0 ? j : 16 - j) * waves / 16) % 1) * rp);

    // ----- face parts shared by every species -----
    const eyeKind = race === 'robot' || race === 'cyborg' || race === 'ai' ? 'glow' : race === 'cat' || race === 'dragon' || race === 'kitsune' || race === 'fox' ? 'slit' : race === 'panda' ? 'panda' : '';
    function eye(x, y, k, col, lid, kind) {
      kind = kind || '';
      let s = '';
      if (kind === 'glow') {
        const glow = C(x, y, 10 * k, col, ' opacity="0.25"');
        if (eyeStyle === 'happy') return glow + S(d`M${x - 6 * k} ${y + 2 * k} L${x} ${y - 4 * k} L${x + 6 * k} ${y + 2 * k}`, col, 3 * k);
        if (eyeStyle === 'dot') return glow + C(x, y, 5 * k, col) + C(x, y, 2 * k, '#FFFFFF');
        const h = eyeStyle === 'sleepy' ? 3 : 7;
        return glow + `<rect x="${r1(x - 7 * k)}" y="${r1(y - h / 2 * k)}" width="${r1(14 * k)}" height="${r1(h * k)}" rx="${r1(2 * k)}" fill="${col}"/>`;
      }
      const ink = kind === 'panda' ? '#FFFFFF' : INK;
      if (eyeStyle === 'dot') {
        s = kind === 'panda' ? C(x, y, 5 * k, '#FFFFFF') + C(x, y, 3 * k, INK) : C(x, y, (baby ? 5.5 : 4.3) * k, ink) + C(x + 1.4 * k, y - 1.6 * k, 1.5 * k, '#FFFFFF');
      } else if (eyeStyle === 'happy') {
        s = S(d`M${x - 6 * k} ${y + 1.5 * k} Q${x} ${y - 5 * k} ${x + 6 * k} ${y + 1.5 * k}`, ink, 3 * k);
      } else {
        const sx = (baby ? 8 : 7) * k, sy = (baby ? 7 : 5.6) * k, ir = (baby ? 5.4 : 4) * k;
        s = E(x, y, sx, sy, '#FFFFFF', ` stroke="${INK}" stroke-opacity="0.5" stroke-width="${r1(1.2 * k)}"`) + C(x, y + 0.3 * k, ir, col) +
          (kind === 'slit' ? E(x, y + 0.3 * k, ir * 0.3, ir * 0.95, '#1E1A18') : C(x, y + 0.3 * k, ir * 0.5, '#1E1A18')) + C(x + 1.4 * k, y - 1.3 * k, 1.3 * k, '#FFFFFF');
        if (eyeStyle === 'sleepy') s += P(d`M${x - sx - 0.6} ${y + 0.5} A${sx + 0.6} ${sy + 0.6} 0 0 1 ${x + sx + 0.6} ${y + 0.5} Z`, lid) + S(d`M${x - sx - 0.6} ${y + 0.5} L${x + sx + 0.6} ${y + 0.5}`, INK, 1.6 * k);
      }
      if (female && !baby && kind !== 'panda') { const sg = x < cx ? -1 : 1; s += S(d`M${x + sg * 6 * k} ${y - 3 * k} L${x + sg * 9.5 * k} ${y - 6.5 * k}`, INK, 2 * k); }
      return s;
    }
    const eyes = (y, dx, k, col, lid, kind) => `<g${cls('E')}>` + eye(cx - dx, y, k, col, lid, kind) + eye(cx + dx, y, k, col, lid, kind) + '</g>';
    function mouth(x, y, k, lipC, innerC) {
      if (mouthStyle === 'smile') return S(d`M${x - 10 * k} ${y - 2 * k} Q${x} ${y + 8 * k} ${x + 10 * k} ${y - 2 * k}`, lipC, 3 * k);
      if (mouthStyle === 'grin') return P(d`M${x - 11 * k} ${y - 3 * k} Q${x} ${y + 13 * k} ${x + 11 * k} ${y - 3 * k} Z`, innerC) + P(d`M${x - 9.5 * k} ${y - 2.6 * k} L${x + 9.5 * k} ${y - 2.6 * k} Q${x} ${y + 2.5 * k} ${x - 9.5 * k} ${y - 2.6 * k} Z`, '#FFFFFF');
      if (mouthStyle === 'o') return E(x, y + k, 3.5 * k, 4 * k, innerC);
      if (mouthStyle === 'smirk') return S(d`M${x - 8 * k} ${y + k} Q${x + 2 * k} ${y + 4 * k} ${x + 10 * k} ${y - 3 * k}`, lipC, 3 * k);
      if (mouthStyle === 'flat') return S(d`M${x - 7 * k} ${y + k} L${x + 7 * k} ${y + k}`, lipC, 3 * k);
      const pc = hsl(clothHue, 70, 66);
      return S(d`M${x} ${y + 5 * k} m-${3.5 * k} 0 a${3.5 * k} ${3.5 * k} 0 1 0 ${7 * k} 0 a${3.5 * k} ${3.5 * k} 0 1 0 -${7 * k} 0`, pc, 1.8 * k) + E(x, y, 9 * k, 5.5 * k, pc) + C(x, y, 2.6 * k, hsl(clothHue, 70, 82));
    }
    const whiskers = (y, c) => S(d`M${cx - 14} ${y} l-26 -4M${cx - 14} ${y + 4} l-27 3M${cx + 14} ${y} l26 -4M${cx + 14} ${y + 4} l27 3`, c, 1.2, ' opacity="0.7"');

    const o = [];
    o.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="${size}" height="${size}" role="img"${anim ? ` class="${id}"` : ''}><title>avatar ${H.hex.slice(0, 8)}</title>`);
    o.push(`<defs><clipPath id="${id}"><circle cx="128" cy="128" r="${R0}"/></clipPath>`);
    const bw = G0.bw;
    const bodyPath = d`M${cx - bw} 256 C${cx - bw} ${sh + 6} ${cx - bw * 0.55} ${sh - 6} ${cx} ${sh - 7} C${cx + bw * 0.55} ${sh - 6} ${cx + bw} ${sh + 6} ${cx + bw} 256Z`;
    o.push(`<clipPath id="${id}b"><path d="${bodyPath}"/></clipPath>`);
    if (race === 'ai') o.push(`<radialGradient id="${id}g" cx="0.4" cy="0.35" r="0.7"><stop offset="0" stop-color="#FFFFFF"/><stop offset="0.45" stop-color="${fur}"/><stop offset="1" stop-color="${shade(fur, 0.45)}"/></radialGradient>`);
    o.push(artFilter(art, id, b, anim, rnd, size));
    if (anim) o.push(`<radialGradient id="${id}L"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0.75"/><stop offset="0.5" stop-color="#FFFFFF" stop-opacity="0.2"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></radialGradient><clipPath id="${id}c"><circle cx="128" cy="128" r="128"/></clipPath>`);
    const cssAt = o.length;
    o.push('</defs>');
    const fil = ` filter="url(#${id}F)"`;
    if (anim) {
      // hover zones sit under the pointer-transparent card, so CSS knows which ninth of the avatar the mouse is over
      let z = '';
      for (let k = 0; k < 9; k++) z += `<rect class="${id}z${k}" x="${r1((k % 3) * 256 / 3)}" y="${r1((k / 3 | 0) * 256 / 3)}" width="85.4" height="85.4" fill="#000" fill-opacity="0"/>`;
      o.push(z);
    }
    o.push(`<g${cls('W')}${art !== 'flat' && art !== 'pixel' ? fil : ''}>`);

    // fingerprint ring: 128 bits of the hash, one slot each, clockwise from 12 o'clock.
    // With animation on, the ticks are split into 16 arcs so a light wave can travel over the bits.
    const tc = hsl(bgHue, 70, 82);
    if (fp) {
      o.push(`<circle cx="128" cy="128" r="128" fill="${hsl(bgHue, 35, 22)}"/>`);
      const on = Array(anim ? 16 : 1).fill(''); let off = '';
      for (let i = 0; i < 128; i++) {
        const a = (i + 0.5) / 128 * 2 * Math.PI - Math.PI / 2, c = Math.cos(a), s = Math.sin(a);
        if ((b[i >> 3] >> (7 - (i & 7))) & 1) on[anim ? i >> 3 : 0] += d`M${128 + 110 * c} ${128 + 110 * s}L${128 + 123 * c} ${128 + 123 * s}`;
        else off += d`M${128 + 116.5 * c} ${128 + 116.5 * s}h0`;
      }
      on.forEach((p, j) => { if (p) o.push(`<path d="${p}" stroke="${tc}" stroke-width="3"${anim ? ` class="${id}R" style="animation-delay:-${arcDelay(j)}s"` : ''}/>`); });
      o.push(`<path d="${off}" stroke="${tc}" stroke-opacity="0.35" stroke-width="2.2" stroke-linecap="round"/>`);
    }

    o.push(`<g clip-path="url(#${id})">${art === 'pixel' ? `<g${fil}>` : ''}`);
    o.push(C(128, 128, R0, bg));
    const da = deco / 256 * 2 * Math.PI;
    o.push(`<g${cls('B')}>` + C(128 + 72 * Math.cos(da), 128 + 72 * Math.sin(da), 26, bgL, ' opacity="0.7"') + C(128 - 78 * Math.cos(da), 128 - 78 * Math.sin(da), 36, bgD, ' opacity="0.45"') + '</g>');

    // sparkles (animated only)
    const css = [];
    if (anim) {
      const ns = 2 + (rnd() * 4 | 0);
      let sp = '';
      for (let i = 0; i < ns; i++) {
        const a = rnd() * 2 * Math.PI, rr = 62 + rnd() * 34, x = 128 + rr * Math.cos(a), y = 128 + rr * Math.sin(a), k = 3 + rnd() * 3;
        sp += `<path d="${d`M${x} ${y - k * 1.6}Q${x} ${y} ${x + k * 1.6} ${y}Q${x} ${y} ${x} ${y + k * 1.6}Q${x} ${y} ${x - k * 1.6} ${y}Q${x} ${y} ${x} ${y - k * 1.6}Z`}" fill="#FFFFFF" class="${id}S" style="animation-duration:${n2(1.6 + rnd() * 2.4)}s;animation-delay:-${n2(rnd() * 3)}s"/>`;
      }
      o.push(sp);
    }

    // ----- species layers -----
    const head = [];   // inside the animated head group
    let back = '', noBody = false, headMotion = null, extra = null;
    const xg = s => `<g${cls('X')}>${s}</g>`;
    let eyeY = cy + ry * (baby ? 0.14 : 0.04), ex = rx * 0.4;

    if (race === 'angel') {
      let w = '';
      for (const sgn of [-1, 1]) {
        w += P(d`M${cx + sgn * 18} ${sh} C${cx + sgn * 70} ${sh - 40} ${cx + sgn * 96} ${cy - 50} ${cx + sgn * 104} ${cy - 66} C${cx + sgn * 100} ${cy - 20} ${cx + sgn * 92} ${sh - 10} ${cx + sgn * 30} ${sh + 16} Z`, '#FFFFFF', ' stroke="#D8DCE8" stroke-width="1.5"');
        w += S(d`M${cx + sgn * 50} ${sh - 14} Q${cx + sgn * 72} ${cy - 10} ${cx + sgn * 92} ${cy - 40}M${cx + sgn * 40} ${sh} Q${cx + sgn * 70} ${cy + 20} ${cx + sgn * 88} ${cy - 6}`, '#D8DCE8', 1.4);
      }
      back = xg(w); extra = ['flap', '50% 100%'];
    }
    if (race === 'kitsune') {
      let t = '';
      for (let i = 0; i < 9; i++) {
        const a = (-72 + i * 18), tx = cx + 70 * Math.sin(a * Math.PI / 180), ty = sh + 30 - 70 * Math.cos(a * Math.PI / 180);
        t += `<g transform="rotate(${a} ${r1(tx)} ${r1(ty)})">` + E(tx, ty, 13, 42, fur, ` stroke="${shade(fur, 0.85)}" stroke-width="1.2"`) + E(tx, ty - 32, 8, 12, '#FFFFFF') + E(tx, ty - 36, 4, 6, '#E86A5A', ' opacity="0.6"') + '</g>';
      }
      back = xg(t); extra = ['wag', '50% 100%'];
    }

    if (creature) {
      const m = fur, mD = shade(m, 0.84), mDD = shade(m, 0.6), mL = mix(m, '#FFFFFF', 0.6), pink = '#F2A0A8', ec = eyeColor;
      const mouthY = cy + ry * 0.5;
      const k = baby ? 1.15 : 1;
      switch (race) {
        case 'cat': {
          let ears = '';
          for (const sgn of [-1, 1]) ears += xg(P(d`M${cx + sgn * rx * 0.98} ${cy - ry * 0.2} L${cx + sgn * rx * 0.88} ${top - ry * 0.32} L${cx + sgn * rx * 0.18} ${top + ry * 0.1} Z`, m) + P(d`M${cx + sgn * rx * 0.86} ${cy - ry * 0.3} L${cx + sgn * rx * 0.8} ${top - ry * 0.12} L${cx + sgn * rx * 0.38} ${top + ry * 0.16} Z`, pink));
          head.push(ears, E(cx, cy + 2, rx * 1.08, ry * 0.92, m));
          if (F(3) & 1) head.push(S(d`M${cx} ${top + ry * 0.14} l0 12M${cx - 10} ${top + ry * 0.2} l2 10M${cx + 10} ${top + ry * 0.2} l-2 10`, mD, 3.2));
          else if (F(3) & 2) head.push(E(cx + rx * 0.45, cy - ry * 0.2, rx * 0.45, ry * 0.38, pick(FUR.cat, F(2)), ' opacity="0.9"'));
          head.push(E(cx - 7, cy + ry * 0.36, 9, 7, mL) + E(cx + 7, cy + ry * 0.36, 9, 7, mL));
          head.push(eyes(eyeY, ex, k * 1.1, ec, mD, 'slit'));
          head.push(P(d`M${cx - 4} ${cy + ry * 0.22} L${cx + 4} ${cy + ry * 0.22} L${cx} ${cy + ry * 0.29} Z`, pink));
          head.push(mouthStyle === 'grin' || mouthStyle === 'o' ? E(cx, cy + ry * 0.42, 4, 4.5, inner) : S(d`M${cx} ${cy + ry * 0.29} q-3 6 -8 3M${cx} ${cy + ry * 0.29} q3 6 8 3`, mDD, 1.8));
          head.push(whiskers(cy + ry * 0.32, mDD));
          extra = extra || ['twitch', '50% 100%'];
          break;
        }
        case 'dog': {
          head.push(E(cx, cy, rx * 1.02, ry * 0.95, m));
          if (F(3) & 1) head.push(E(cx + ex, eyeY - 2, 14, 13, pick(FUR.dog, F(2) + 1)));
          head.push(E(cx, cy + ry * 0.38, rx * 0.5, ry * 0.32, mL));
          head.push(eyes(eyeY, ex, k * 1.05, ec, mD));
          let ears = '';
          for (const sgn of [-1, 1]) ears += xg(P(d`M${cx + sgn * rx * 0.55} ${top + ry * 0.1} Q${cx + sgn * (rx + 18)} ${top + ry * 0.02} ${cx + sgn * (rx + 12)} ${cy + ry * 0.55} Q${cx + sgn * (rx + 2)} ${cy + ry * 0.62} ${cx + sgn * rx * 0.82} ${cy} Z`, mDD));
          head.push(ears);
          head.push(E(cx, cy + ry * 0.24, 7, 5, INK) + C(cx - 2, cy + ry * 0.22, 1.6, '#FFFFFF', ' opacity="0.6"'));
          if (mouthStyle === 'grin' || mouthStyle === 'smile') head.push(P(d`M${cx - 5} ${cy + ry * 0.44} L${cx + 5} ${cy + ry * 0.44} L${cx + 5} ${cy + ry * 0.56} Q${cx} ${cy + ry * 0.66} ${cx - 5} ${cy + ry * 0.56} Z`, '#E8607A'));
          head.push(S(d`M${cx} ${cy + ry * 0.3} L${cx} ${cy + ry * 0.42}M${cx - 9} ${cy + ry * 0.44} Q${cx - 4} ${cy + ry * 0.5} ${cx} ${cy + ry * 0.42} Q${cx + 4} ${cy + ry * 0.5} ${cx + 9} ${cy + ry * 0.44}`, INK, 2));
          extra = extra || ['wag', '50% 0%'];
          break;
        }
        case 'fox': case 'kitsune': {
          const inEar = race === 'kitsune' ? '#E86A5A' : mL;
          let ears = '';
          for (const sgn of [-1, 1]) ears += xg(P(d`M${cx + sgn * rx * 0.95} ${cy - ry * 0.25} L${cx + sgn * rx * 0.85} ${top - ry * 0.5} L${cx + sgn * rx * 0.12} ${top + ry * 0.1} Z`, m) + P(d`M${cx + sgn * rx * 0.82} ${cy - ry * 0.35} L${cx + sgn * rx * 0.78} ${top - ry * 0.3} L${cx + sgn * rx * 0.36} ${top + ry * 0.15} Z`, inEar) + P(d`M${cx + sgn * rx * 0.88} ${top - ry * 0.3} L${cx + sgn * rx * 0.85} ${top - ry * 0.5} L${cx + sgn * rx * 0.66} ${top - ry * 0.22} Z`, '#2B2A28'));
          head.push(ears);
          head.push(P(d`M${L - 6} ${cy - ry * 0.2} Q${L - 4} ${top} ${cx} ${top} Q${R + 4} ${top} ${R + 6} ${cy - ry * 0.2} Q${R + 2} ${cy + ry * 0.45} ${cx} ${cy + ry * 0.95} Q${L - 2} ${cy + ry * 0.45} ${L - 6} ${cy - ry * 0.2} Z`, m));
          head.push(P(d`M${L - 4} ${cy + ry * 0.02} Q${cx - rx * 0.3} ${cy} ${cx} ${cy + ry * 0.32} Q${cx + rx * 0.3} ${cy} ${R + 4} ${cy + ry * 0.02} Q${R} ${cy + ry * 0.45} ${cx} ${cy + ry * 0.95} Q${L} ${cy + ry * 0.45} ${L - 4} ${cy + ry * 0.02} Z`, race === 'kitsune' ? '#FFFFFF' : '#FFF6EC'));
          if (race === 'kitsune') head.push(P(d`M${cx} ${top + ry * 0.08} Q${cx + 7} ${top + ry * 0.3} ${cx} ${top + ry * 0.42} Q${cx - 7} ${top + ry * 0.3} ${cx} ${top + ry * 0.08} Z`, '#D93A3A') + S(d`M${cx - ex - 8} ${eyeY + 9} l8 -3M${cx + ex + 8} ${eyeY + 9} l-8 -3`, '#D93A3A', 2.4));
          head.push(eyes(eyeY - 2, ex, k, ec, mD, 'slit'));
          head.push(E(cx, cy + ry * 0.66, 5, 4, INK));
          head.push(S(d`M${cx} ${cy + ry * 0.7} L${cx} ${cy + ry * 0.78}M${cx - 5} ${cy + ry * 0.8} Q${cx} ${cy + ry * 0.86} ${cx + 5} ${cy + ry * 0.8}`, INK, 1.6));
          extra = extra || ['twitch', '50% 100%'];
          break;
        }
        case 'panda': {
          head.push(C(cx - rx * 0.78, top + ry * 0.15, 13, INK) + C(cx + rx * 0.78, top + ry * 0.15, 13, INK));
          head.push(E(cx, cy, rx * 1.05, ry * 0.95, m));
          for (const sgn of [-1, 1]) head.push(E(cx + sgn * ex, eyeY + 2, 11, 14, '#2B2A28', ` transform="rotate(${sgn * 25} ${r1(cx + sgn * ex)} ${r1(eyeY + 2)})"`));
          head.push(eyes(eyeY + 1, ex, k, ec, '#2B2A28', 'panda'));
          head.push(E(cx, cy + ry * 0.3, 6, 4, INK) + mouth(cx, mouthY, 0.7, INK, inner));
          break;
        }
        case 'rabbit': {
          let ears = '';
          for (const sgn of [-1, 1]) {
            const ax = cx + sgn * rx * 0.38, ay = top - ry * 0.4, rot = sgn * 10 + (sgn > 0 && (F(3) & 1) ? 55 : 0);
            ears += xg(`<g transform="rotate(${rot} ${r1(ax)} ${r1(top + 6)})">` + E(ax, ay, 11, ry * 0.62, m) + E(ax, ay + 2, 5.5, ry * 0.48, pink) + '</g>');
          }
          head.push(ears, E(cx, cy, rx * 1.02, ry * 0.92, m));
          head.push(E(cx - 8, cy + ry * 0.36, 9, 7, mL) + E(cx + 8, cy + ry * 0.36, 9, 7, mL));
          head.push(eyes(eyeY, ex, k * 1.05, ec, mD));
          head.push(P(d`M${cx - 4} ${cy + ry * 0.22} L${cx + 4} ${cy + ry * 0.22} L${cx} ${cy + ry * 0.29} Z`, pink));
          head.push(`<rect x="${cx - 4}" y="${r1(cy + ry * 0.38)}" width="8" height="7" rx="1.5" fill="#FFFFFF" stroke="${mD}" stroke-width="0.8"/>` + S(d`M${cx} ${cy + ry * 0.29} L${cx} ${cy + ry * 0.38}M${cx - 7} ${cy + ry * 0.36} Q${cx} ${cy + ry * 0.42} ${cx + 7} ${cy + ry * 0.36}`, mDD, 1.6));
          head.push(whiskers(cy + ry * 0.32, mDD));
          extra = extra || ['twitch', '50% 100%'];
          break;
        }
        case 'bear': {
          head.push(C(cx - rx * 0.75, top + ry * 0.12, 14, m) + C(cx - rx * 0.75, top + ry * 0.12, 8, mD) + C(cx + rx * 0.75, top + ry * 0.12, 14, m) + C(cx + rx * 0.75, top + ry * 0.12, 8, mD));
          head.push(E(cx, cy, rx * 1.06, ry * 0.96, m), E(cx, cy + ry * 0.36, rx * 0.48, ry * 0.32, mL));
          head.push(eyes(eyeY, ex, k, ec, mD));
          head.push(E(cx, cy + ry * 0.24, 7, 5, INK) + mouth(cx, mouthY, 0.7, mDD, inner));
          break;
        }
        case 'owl': {
          let tufts = '';
          for (const sgn of [-1, 1]) tufts += xg(P(d`M${cx + sgn * rx * 0.45} ${top + 6} L${cx + sgn * rx * 0.98} ${top - ry * 0.35} L${cx + sgn * rx * 1.0} ${top + ry * 0.35} Z`, mD));
          head.push(tufts, E(cx, cy, rx * 1.1, ry, m));
          head.push(C(cx - ex * 1.1, eyeY, 17, mL) + C(cx + ex * 1.1, eyeY, 17, mL));
          head.push(S(d`M${cx - 6} ${top + ry * 0.3} l6 5 l6 -5M${cx - 10} ${top + ry * 0.18} l4 3M${cx + 10} ${top + ry * 0.18} l-4 3`, mDD, 1.6));
          head.push(`<g${cls('E')}>` + [-1, 1].map(sgn => { const x = cx + sgn * ex * 1.1; return eyeStyle === 'happy' ? S(d`M${x - 8} ${eyeY + 2} Q${x} ${eyeY - 7} ${x + 8} ${eyeY + 2}`, INK, 3.4) : C(x, eyeY, 11, '#FFFFFF') + C(x, eyeY, 8, ec) + C(x, eyeY, 4.5, INK) + C(x + 2, eyeY - 2.5, 1.8, '#FFFFFF'); }).join('') + '</g>');
          head.push(P(d`M${cx - 6} ${eyeY + 10} L${cx + 6} ${eyeY + 10} L${cx} ${eyeY + 22} Z`, '#E8A03A'));
          head.push(S(d`M${cx - 14} ${cy + ry * 0.62} l4 4 l4 -4M${cx + 6} ${cy + ry * 0.62} l4 4 l4 -4M${cx - 4} ${cy + ry * 0.78} l4 4 l4 -4`, mDD, 1.4, ' opacity="0.6"'));
          extra = extra || ['twitch', '50% 100%'];
          break;
        }
        case 'penguin': {
          head.push(E(cx, cy, rx * 1.04, ry * 0.95, m));
          head.push(P(d`M${cx} ${top + ry * 0.42} C${cx - rx * 0.2} ${top + ry * 0.05} ${L - 4} ${top + ry * 0.25} ${L + 2} ${cy + ry * 0.35} Q${cx} ${cy + ry * 0.98} ${R - 2} ${cy + ry * 0.35} C${R + 4} ${top + ry * 0.25} ${cx + rx * 0.2} ${top + ry * 0.05} ${cx} ${top + ry * 0.42} Z`, '#FFFFFF'));
          head.push(eyes(eyeY + 2, ex * 0.95, k, '#2A1D16', '#E8E8F0'));
          head.push(P(d`M${cx - 10} ${cy + ry * 0.28} Q${cx} ${cy + ry * 0.18} ${cx + 10} ${cy + ry * 0.28} L${cx} ${cy + ry * 0.48} Z`, '#F2A33A'));
          break;
        }
        case 'frog': {
          eyeY = top + ry * 0.22;
          head.push(E(cx, cy + 6, rx * 1.18, ry * 0.78, m), C(cx - rx * 0.52, eyeY, 15, m), C(cx + rx * 0.52, eyeY, 15, m));
          head.push(E(cx, cy + ry * 0.5, rx * 0.72, ry * 0.28, mL));
          if (F(3) & 1) head.push(C(cx - rx * 0.6, cy + 4, 4, mD) + C(cx + rx * 0.7, cy - 2, 3, mD) + C(cx + rx * 0.3, top + ry * 0.55, 3.5, mD));
          head.push(eyes(eyeY, rx * 0.52, k * 1.1, ec, mD));
          head.push(C(cx - 4, cy + ry * 0.12, 1.5, mDD) + C(cx + 4, cy + ry * 0.12, 1.5, mDD));
          head.push(S(d`M${cx - rx * 0.62} ${cy + ry * 0.22} Q${cx} ${cy + ry * (mouthStyle === 'flat' ? 0.3 : 0.5)} ${cx + rx * 0.62} ${cy + ry * 0.22}`, mDD, 2.6));
          break;
        }
        case 'monkey': {
          const face = '#F2C9A0';
          head.push(C(L - 3, cy, 12, m) + C(L - 3, cy, 7, face) + C(R + 3, cy, 12, m) + C(R + 3, cy, 7, face));
          head.push(E(cx, cy, rx * 1.02, ry * 0.95, m));
          head.push(E(cx - ex * 0.8, eyeY, 15, 14, face) + E(cx + ex * 0.8, eyeY, 15, 14, face) + E(cx, cy + ry * 0.4, rx * 0.62, ry * 0.38, face));
          head.push(S(d`M${cx - 6} ${top + 2} q2 -8 6 -9M${cx} ${top + 1} q3 -8 8 -8`, mD, 3));
          head.push(eyes(eyeY, ex * 0.8, k, ec, shade(face, 0.85)));
          head.push(C(cx - 3, cy + ry * 0.28, 1.6, mDD) + C(cx + 3, cy + ry * 0.28, 1.6, mDD) + mouth(cx, mouthY, 0.75, shade(face, 0.55), inner));
          if (X(7) & 1) head.push(S(d`M${L + 2} ${top + ry * 0.34} Q${cx} ${top + ry * 0.2} ${R - 2} ${top + ry * 0.34}`, '#E8B83A', 4.5) + C(cx, top + ry * 0.27, 3.5, '#E8B83A'));
          break;
        }
        case 'dragon': {
          const mane = pick(MANE, F(2)), horn = '#EADCB4';
          let mn = '';
          for (let i = 0; i <= 10; i++) {
            const a = Math.PI * (1.08 + i * 0.084), a2 = a + 0.042, a3 = a + 0.084;
            const p = (t, r) => [cx + r * rx * Math.cos(t), cy + r * ry * Math.sin(t)];
            const [x1, y1] = p(a, 1.05), [x2, y2] = p(a2, 1.5), [x3, y3] = p(a3, 1.05);
            mn += d`M${x1} ${y1} L${x2} ${y2} L${x3} ${y3} Z`;
          }
          head.push(P(mn, mane));
          head.push(S(d`M${cx - rx * 0.35} ${top + 8} Q${cx - rx * 0.55} ${top - 14} ${cx - rx * 0.9} ${top - 30}M${cx - rx * 0.6} ${top - 12} L${cx - rx * 0.4} ${top - 28}M${cx - rx * 0.78} ${top - 22} l-12 -2M${cx + rx * 0.35} ${top + 8} Q${cx + rx * 0.55} ${top - 14} ${cx + rx * 0.9} ${top - 30}M${cx + rx * 0.6} ${top - 12} L${cx + rx * 0.4} ${top - 28}M${cx + rx * 0.78} ${top - 22} l12 -2`, horn, 5));
          head.push(E(cx, cy, rx, ry * 0.95, m), E(cx, cy + ry * 0.45, rx * 0.66, ry * 0.4, mix(m, '#FFFFFF', 0.25)));
          head.push(S(d`M${cx - 10} ${top + ry * 0.2} q5 -5 10 0 q5 -5 10 0M${cx - 5} ${top + ry * 0.32} q5 -5 10 0`, mD, 1.6));
          head.push(S(d`M${cx - ex - 8} ${eyeY - 10} L${cx - ex + 6} ${eyeY - 7}M${cx + ex + 8} ${eyeY - 10} L${cx + ex - 6} ${eyeY - 7}`, mDD, 3));
          head.push(eyes(eyeY, ex, k, ec, mD, 'slit'));
          head.push(E(cx - 7, cy + ry * 0.36, 3, 2, mDD) + E(cx + 7, cy + ry * 0.36, 3, 2, mDD));
          head.push(S(d`M${cx - 14} ${cy + ry * 0.62} Q${cx} ${cy + ry * (mouthStyle === 'flat' ? 0.64 : 0.72)} ${cx + 14} ${cy + ry * 0.62}`, mDD, 2));
          head.push(xg(S(d`M${cx - 14} ${cy + ry * 0.4} C${cx - 40} ${cy + ry * 0.3} ${cx - 45} ${cy + ry * 0.9} ${cx - 72} ${cy + ry * 0.85}M${cx + 14} ${cy + ry * 0.4} C${cx + 40} ${cy + ry * 0.3} ${cx + 45} ${cy + ry * 0.9} ${cx + 72} ${cy + ry * 0.85}`, '#E8B83A', 2.4)));
          extra = extra || ['twitch', '50% 0%'];
          break;
        }
        case 'robot': {
          eyeY = top + ry * 0.72;
          head.push(xg(S(d`M${cx} ${top + 2} L${cx} ${top - 16}`, mDD, 3) + C(cx, top - 19, 5, ec)));
          head.push(`<rect x="${r1(L - 9)}" y="${r1(cy - 12)}" width="12" height="24" rx="3" fill="${mD}"/><rect x="${r1(R - 3)}" y="${r1(cy - 12)}" width="12" height="24" rx="3" fill="${mD}"/>`);
          head.push(`<rect x="${r1(L - 4)}" y="${r1(top + 2)}" width="${r1(2 * rx + 8)}" height="${r1(2 * ry - 6)}" rx="16" fill="${m}"/>`);
          head.push(`<rect x="${r1(L + 4)}" y="${r1(top + ry * 0.38)}" width="${r1(2 * rx - 8)}" height="${r1(ry * 0.98)}" rx="10" fill="#1E2430"/>`);
          head.push(C(L + 4, top + 10, 2, mDD) + C(R - 4, top + 10, 2, mDD) + C(L + 4, top + 2 * ry - 12, 2, mDD) + C(R - 4, top + 2 * ry - 12, 2, mDD));
          head.push(eyes(eyeY, ex, k, ec, '#1E2430', 'glow'));
          const my = top + ry * 1.12;
          if (mouthStyle === 'grin' || mouthStyle === 'flat') { let gr = ''; for (let i = 0; i < 5; i++) gr += `<rect x="${r1(cx - 14 + i * 6)}" y="${r1(my - 3)}" width="4" height="6" rx="1" fill="${ec}"/>`; head.push(gr); }
          else if (mouthStyle === 'o' || mouthStyle === 'pacifier') head.push(C(cx, my, 4, 'none', ` stroke="${ec}" stroke-width="2.4"`));
          else head.push(S(d`M${cx - 12} ${my - 2} Q${cx} ${my + 6} ${cx + 12} ${my - 2}`, ec, 2.6));
          extra = extra || ['blink', '50% 50%'];
          break;
        }
        case 'ai': {
          noBody = true;
          back = P(d`M${cx - 64} 256 L${cx - 16} ${sh} L${cx + 16} ${sh} L${cx + 64} 256 Z`, m, ' opacity="0.22"') + E(cx, sh + 4, 22, 5, m, ' opacity="0.5"');
          head.push(C(cx, cy, rx * 1.25, m, ' opacity="0.18"'), C(cx, cy, rx * 0.98, `url(#${id}g)`));
          head.push(xg(E(cx, cy, rx * 1.45, ry * 0.28, 'none', ` stroke="${m}" stroke-width="2" opacity="0.8" transform="rotate(-18 ${cx} ${cy})"`)));
          head.push(eyes(eyeY, ex * 0.9, k, '#FFFFFF', m, 'glow'));
          head.push(S(d`M${cx - 14} ${cy + ry * 0.42} q3.5 -6 7 0 t7 0 t7 0 t7 0`, '#FFFFFF', 2.2));
          extra = extra || ['spin', '50% 50%'];
          break;
        }
        case 'alien': {
          if (X(7) & 1) head.push(xg(S(d`M${cx - 12} ${top + 4} Q${cx - 22} ${top - 14} ${cx - 26} ${top - 22}M${cx + 12} ${top + 4} Q${cx + 22} ${top - 14} ${cx + 26} ${top - 22}`, mD, 2.4) + C(cx - 26, top - 23, 4, mix(m, '#FFFFFF', 0.4)) + C(cx + 26, top - 23, 4, mix(m, '#FFFFFF', 0.4))));
          head.push(P(d`M${cx} ${top - 2} Q${R + 16} ${top - 2} ${R + 10} ${cy - ry * 0.05} Q${R} ${cy + ry * 0.6} ${cx} ${cy + ry * 0.95} Q${L} ${cy + ry * 0.6} ${L - 10} ${cy - ry * 0.05} Q${L - 16} ${top - 2} ${cx} ${top - 2} Z`, m));
          head.push(`<g${cls('E')}>` + [-1, 1].map(sgn => {
            const x = cx + sgn * ex * 1.05, y = eyeY + 2;
            if (eyeStyle === 'happy') return S(d`M${x - 11} ${y + 3} Q${x} ${y - 7} ${x + 11} ${y + 3}`, '#14141A', 4);
            const e = P(d`M${x - sgn * 13} ${y - 5} Q${x + sgn * 2} ${y - 13} ${x + sgn * 13} ${y + 2} Q${x + sgn * 4} ${y + 11} ${x - sgn * 13} ${y - 5} Z`, '#14141A') + C(x - sgn * 3, y - 4, 2.5, '#FFFFFF', ' opacity="0.8"');
            return eyeStyle === 'sleepy' ? e + P(d`M${x - 14} ${y - 14} L${x + 14} ${y - 14} L${x + 14} ${y - 1} L${x - 14} ${y - 1} Z`, m) : e;
          }).join('') + '</g>');
          head.push(C(cx - 2, cy + ry * 0.36, 1.2, mDD) + C(cx + 2, cy + ry * 0.36, 1.2, mDD) + S(d`M${cx - 5} ${cy + ry * 0.6} Q${cx} ${cy + ry * 0.66} ${cx + 5} ${cy + ry * 0.6}`, mDD, 2));
          extra = extra || ['blink', '50% 50%'];
          break;
        }
        case 'ghost': {
          noBody = true; headMotion = 'float';
          let wave = d`M${L - 8} ${cy} A${rx + 8} ${ry + 6} 0 0 1 ${R + 8} ${cy} L${R + 14} 232`;
          for (let i = 0; i < 5; i++) { const x0 = R + 14 - i * (2 * rx + 28) / 5, x1 = x0 - (2 * rx + 28) / 5; wave += d` Q${(x0 + x1) / 2} ${i % 2 ? 222 : 246} ${x1} 232`; }
          head.push(P(wave + 'Z', m, ' stroke="#D8DCE8" stroke-width="1.5"'));
          head.push(P(d`M${L - 4} ${cy + ry * 0.55} q-14 6 -12 18 q8 -4 14 -8 Z M${R + 4} ${cy + ry * 0.55} q14 6 12 18 q-8 -4 -14 -8 Z`, m, ' stroke="#D8DCE8" stroke-width="1.5"'));
          head.push(`<g${cls('E')}>` + [-1, 1].map(sgn => { const x = cx + sgn * ex, y = eyeY; return eyeStyle === 'happy' ? S(d`M${x - 7} ${y + 2} Q${x} ${y - 6} ${x + 7} ${y + 2}`, ec, 3.4) : E(x, y, eyeStyle === 'dot' ? 5 : 7, eyeStyle === 'sleepy' ? 3 : 9, ec) + C(x + 2, y - 3, 1.8, '#FFFFFF'); }).join('') + '</g>');
          head.push(mouthStyle === 'smile' || mouthStyle === 'grin' ? S(d`M${cx - 8} ${mouthY - 2} Q${cx} ${mouthY + 6} ${cx + 8} ${mouthY - 2}`, ec, 2.8) : E(cx, mouthY, 5, 6.5, ec));
          break;
        }
        case 'skeleton': {
          head.push(E(cx, cy - 4, rx, ry * 0.86, m), `<rect x="${r1(cx - rx * 0.55)}" y="${r1(cy + ry * 0.32)}" width="${r1(rx * 1.1)}" height="${r1(ry * 0.44)}" rx="10" fill="${m}"/>`);
          head.push(P(d`M${L + 4} ${cy + ry * 0.1} Q${L + 10} ${cy + ry * 0.4} ${cx - rx * 0.5} ${cy + ry * 0.38} M${R - 4} ${cy + ry * 0.1} Q${R - 10} ${cy + ry * 0.4} ${cx + rx * 0.5} ${cy + ry * 0.38}`, 'none', ` stroke="${mD}" stroke-width="2"`));
          head.push(E(cx - ex, eyeY + 2, 11, 12, '#1E1A18') + E(cx + ex, eyeY + 2, 11, 12, '#1E1A18'));
          head.push(`<g${cls('E')}>` + [-1, 1].map(sgn => { const x = cx + sgn * ex, y = eyeY + 2; return eyeStyle === 'happy' ? S(d`M${x - 5} ${y + 2} Q${x} ${y - 4} ${x + 5} ${y + 2}`, ec, 2.4) : C(x, y, eyeStyle === 'sleepy' ? 2 : 3, ec) + C(x, y, 6, ec, ' opacity="0.25"'); }).join('') + '</g>');
          head.push(P(d`M${cx} ${cy + ry * 0.12} L${cx - 5} ${cy + ry * 0.3} L${cx + 5} ${cy + ry * 0.3} Z`, '#1E1A18'));
          let teeth = d`M${cx - rx * 0.42} ${cy + ry * 0.55} L${cx + rx * 0.42} ${cy + ry * 0.55}`;
          for (let i = -2; i <= 2; i++) teeth += d`M${cx + i * 7} ${cy + ry * 0.45} L${cx + i * 7} ${cy + ry * 0.66}`;
          head.push(S(teeth, mDD, 1.6));
          break;
        }
        case 'slime': {
          noBody = true; headMotion = 'squash';
          head.push(E(cx, 246, rx * 1.75, 12, mD));
          head.push(P(d`M${cx - rx * 1.55} 248 Q${cx - rx * 1.7} ${top + ry * 0.35} ${cx} ${top - 4} Q${cx + rx * 1.7} ${top + ry * 0.35} ${cx + rx * 1.55} 248 Z`, m, ' opacity="0.94"'));
          head.push(E(cx - rx * 0.7, top + ry * 0.45, 9, 15, '#FFFFFF', ` opacity="0.5" transform="rotate(25 ${r1(cx - rx * 0.7)} ${r1(top + ry * 0.45)})"`) + C(cx + rx * 0.8, cy + ry * 0.9, 5, mL, ' opacity="0.6"') + C(cx - rx * 0.4, cy + ry * 1.2, 3.5, mL, ' opacity="0.6"'));
          head.push(eyes(cy, ex, k * 1.15, '#1E1A18', mD));
          head.push(mouth(cx, cy + ry * 0.42, 0.9, mDD, inner));
          break;
        }
      }
      if (blush && race !== 'robot' && race !== 'ai' && race !== 'skeleton') head.push(E(cx - rx * 0.62, eyeY + ry * 0.3, 7, 4, '#F07A8A', ' opacity="0.4"') + E(cx + rx * 0.62, eyeY + ry * 0.3, 7, 4, '#F07A8A', ' opacity="0.4"'));
    }

    if (back) o.push(back);

    let hairParts = { back: '', mid: '', front: '' };
    if (!creature) {
      hairParts = HAIR_FN[style](g, hair, clothC, hairD);
      if (hairParts.back) o.push(`<g${cls('H')}>${hairParts.back}</g>`);
    }

    // neck + body
    if (!noBody) {
      o.push(`<rect x="${cx - 10}" y="${r1(cy + ry * 0.6)}" width="20" height="${r1(sh - cy - ry * 0.6 + 10)}" fill="${skinD}"/>`);
      if (race === 'skeleton') o.push(S(d`M${cx - 6} ${cy + ry * 0.95} L${cx + 6} ${cy + ry * 0.95}M${cx - 6} ${cy + ry * 1.1} L${cx + 6} ${cy + ry * 1.1}`, shade(skin, 0.6), 1.6));
      const bodyFill = cloth === 'suit' ? hsl(clothHue, 25, 30) : cloth === 'overalls' ? hsl(clothHue, 45, 82) : clothC;
      o.push(P(bodyPath, bodyFill));
      const crew = () => P(d`M${cx - 13} ${sh - 7} Q${cx} ${sh + 7} ${cx + 13} ${sh - 7} Z`, skinD) + S(d`M${cx - 13} ${sh - 6} Q${cx} ${sh + 8} ${cx + 13} ${sh - 6}`, cloth === 'overalls' ? hsl(clothHue, 35, 65) : clothD, 3);
      if (cloth === 'tee' || cloth === 'onesie') {
        o.push(crew());
        if (cloth === 'onesie') o.push(C(cx - 6, sh + 13, 2, '#FFFFFF') + C(cx + 6, sh + 13, 2, '#FFFFFF'));
      } else if (cloth === 'stripes') {
        let st = '';
        for (let k = 0; k < 9; k++) st += d`M${cx - bw} ${sh + 5 + k * 10}H${cx + bw}`;
        o.push(`<g clip-path="url(#${id}b)">${S(st, clothL, 4.5)}</g>` + crew());
      } else if (cloth === 'overalls') {
        const dn = hsl(215, 40, 45), dnD = hsl(215, 40, 34);
        o.push(`<g clip-path="url(#${id}b)"><rect x="${cx - bw}" y="${sh + 48}" width="${2 * bw}" height="60" fill="${dn}"/></g>`);
        o.push(`<rect x="${cx - 19}" y="${sh + 14}" width="38" height="40" rx="3" fill="${dn}"/>`);
        o.push(`<rect x="${cx - 9}" y="${sh + 24}" width="18" height="12" rx="2" fill="none" stroke="${dnD}" stroke-width="1.2"/>`);
        o.push(S(d`M${cx - 30} ${sh - 4} L${cx - 15} ${sh + 18}M${cx + 30} ${sh - 4} L${cx + 15} ${sh + 18}`, dn, 6));
        o.push(C(cx - 15, sh + 18, 2.2, '#E8C547') + C(cx + 15, sh + 18, 2.2, '#E8C547'));
        o.push(crew());
      } else if (cloth === 'hoodie') {
        o.push(P(d`M${cx - 14} ${sh - 7} L${cx} ${sh + 14} L${cx + 14} ${sh - 7} Z`, skinD));
        o.push(S(d`M${cx - 15} ${sh - 7} L${cx} ${sh + 15} L${cx + 15} ${sh - 7}`, clothD, 4));
        o.push(S(d`M${cx - 7} ${sh + 6} L${cx - 8} ${sh + 30}M${cx + 7} ${sh + 6} L${cx + 8} ${sh + 30}`, clothL, 2.5));
      } else if (cloth === 'collar') {
        o.push(P(d`M${cx - 10} ${sh - 7} L${cx} ${sh + 8} L${cx + 10} ${sh - 7} Z`, skinD));
        o.push(P(d`M${cx - 14} ${sh - 8} L${cx - 1} ${sh + 8} L${cx - 18} ${sh + 5} Z`, '#F4F4F0') + P(d`M${cx + 14} ${sh - 8} L${cx + 1} ${sh + 8} L${cx + 18} ${sh + 5} Z`, '#F4F4F0'));
        o.push(C(cx, sh + 16, 1.7, clothD) + C(cx, sh + 28, 1.7, clothD));
      } else if (cloth === 'suit') {
        const tie = hsl(clothHue + 180, 55, 45), lap = hsl(clothHue, 25, 22);
        o.push(P(d`M${cx - 15} ${sh - 7} L${cx} ${sh + 44} L${cx + 15} ${sh - 7} Z`, '#F4F4F0'));
        o.push(P(d`M${cx - 9} ${sh - 7} L${cx} ${sh + 2} L${cx + 9} ${sh - 7} Z`, skinD));
        o.push(P(d`M${cx - 3.5} ${sh} L${cx + 3.5} ${sh} L${cx + 2.5} ${sh + 6} L${cx - 2.5} ${sh + 6} Z M${cx - 2.5} ${sh + 6} L${cx + 2.5} ${sh + 6} L${cx + 5} ${sh + 32} L${cx} ${sh + 38} L${cx - 5} ${sh + 32} Z`, tie));
        o.push(S(d`M${cx - 17} ${sh - 6} L${cx - 5} ${sh + 30}M${cx + 17} ${sh - 6} L${cx + 5} ${sh + 30}`, lap, 2.5));
      } else if (cloth === 'turtleneck') {
        o.push(`<rect x="${cx - 13}" y="${sh - 17}" width="26" height="14" rx="6" fill="${clothD}"/>`);
        o.push(S(d`M${cx - 11} ${sh - 12} L${cx + 11} ${sh - 12}M${cx - 11} ${sh - 8} L${cx + 11} ${sh - 8}`, clothC, 1.4));
      } else {
        o.push(P(d`M${cx - 16} ${sh - 7} L${cx} ${sh + 40} L${cx + 16} ${sh - 7} Z`, clothL));
        o.push(P(d`M${cx - 10} ${sh - 7} Q${cx} ${sh + 4} ${cx + 10} ${sh - 7} Z`, skinD));
        o.push(S(d`M${cx - 16} ${sh - 7} L${cx} ${sh + 40} L${cx + 16} ${sh - 7}`, clothD, 3));
        o.push(C(cx + 6, sh + 22, 2, clothD) + C(cx + 3, sh + 32, 2, clothD));
      }
      if (race === 'vampire') o.push(P(d`M${cx - bw * 0.8} ${sh + 14} L${L - 16} ${cy - 2} L${cx - 16} ${sh - 4} Z M${cx + bw * 0.8} ${sh + 14} L${R + 16} ${cy - 2} L${cx + 16} ${sh - 4} Z`, '#2A0A12') + P(d`M${cx - bw * 0.7} ${sh + 10} L${L - 10} ${cy + 4} L${cx - 18} ${sh - 2} Z M${cx + bw * 0.7} ${sh + 10} L${R + 10} ${cy + 4} L${cx + 18} ${sh - 2} Z`, '#8A0F1A'));
    }

    o.push(`<g${cls('H')}>`);
    if (creature) {
      o.push(head.join(''));
    } else {
      if (hairParts.mid) o.push(hairParts.mid);

      // ears + head
      if (race === 'elf' || race === 'orc' || race === 'demon') {
        const len = race === 'elf' ? 24 : race === 'demon' ? 16 : 12, up = race === 'orc' ? 0.4 : 0.9;
        for (const sgn of [-1, 1]) o.push(P(d`M${cx + sgn * (rx - 3)} ${cy - 6} Q${cx + sgn * (rx + len * 0.5)} ${cy - 8} ${cx + sgn * (rx + len)} ${cy - len * up} Q${cx + sgn * (rx + len * 0.45)} ${cy + 8} ${cx + sgn * (rx - 2)} ${cy + 15} Z`, skinD) + S(d`M${cx + sgn * (rx + 2)} ${cy - 2} Q${cx + sgn * (rx + len * 0.5)} ${cy - 3} ${cx + sgn * (rx + len * 0.8)} ${cy - len * up * 0.8}`, skinDD, 1.2, ' opacity="0.5"'));
      } else {
        o.push(E(L + 1, cy + 4, 7, baby ? 9 : 10, skinD) + E(R - 1, cy + 4, 7, baby ? 9 : 10, skinD));
      }
      o.push(E(cx, cy, rx, ry, skin));

      const noseY = eyeY + ry * 0.27, mouthY = cy + ry * 0.5;

      // age lines
      const wl = ` stroke="${skinDD}" stroke-opacity="0.55"`;
      if (middle) o.push(S(d`M${cx - rx * 0.35} ${top + ry * 0.48} Q${cx} ${top + ry * 0.44} ${cx + rx * 0.35} ${top + ry * 0.48}`, skinDD, 1.4, ' stroke-opacity="0.45"'));
      if (old) {
        let w = d`M${cx - rx * 0.4} ${top + ry * 0.44} Q${cx} ${top + ry * 0.4} ${cx + rx * 0.4} ${top + ry * 0.44}M${cx - rx * 0.32} ${top + ry * 0.54} Q${cx} ${top + ry * 0.5} ${cx + rx * 0.32} ${top + ry * 0.54}`;
        for (const sgn of [-1, 1]) {
          const xo = cx + sgn * (ex + 10);
          w += d`M${xo} ${eyeY - 2} L${xo + sgn * 4} ${eyeY - 4}M${xo} ${eyeY + 1} L${xo + sgn * 4.5} ${eyeY + 2}`;
          w += d`M${cx + sgn * ex - 5} ${eyeY + 7} Q${cx + sgn * ex} ${eyeY + 9.5} ${cx + sgn * ex + 5} ${eyeY + 7}`;
          w += d`M${cx + sgn * 11} ${noseY + 4} Q${cx + sgn * 15} ${mouthY - 2} ${cx + sgn * 13} ${mouthY + 4}`;
        }
        o.push(`<path d="${w}" fill="none" stroke-width="1.4" stroke-linecap="round"${wl}/>`);
      }
      if (race === 'zombie') o.push(E(cx - ex, eyeY + 4, 9, 7, skinDD, ' opacity="0.35"') + E(cx + ex, eyeY + 4, 9, 7, skinDD, ' opacity="0.35"') + S(d`M${cx - rx * 0.6} ${top + ry * 0.5} L${cx + rx * 0.1} ${top + ry * 0.3}M${cx - rx * 0.5} ${top + ry * 0.38} l4 8M${cx - rx * 0.3} ${top + ry * 0.33} l4 8M${cx - rx * 0.1} ${top + ry * 0.28} l4 8`, '#4A3A3A', 1.6));
      if (blush) { const bc = mix(skin, '#E0505E', 0.4); o.push(E(cx - rx * 0.58, eyeY + ry * 0.3, 7, 4, bc, ' opacity="0.5"') + E(cx + rx * 0.58, eyeY + ry * 0.3, 7, 4, bc, ' opacity="0.5"')); }
      if (freckles) {
        for (const sgn of [-1, 1]) for (const [dx, dy] of [[-4, -1], [0, 1.5], [4, -0.5], [1, -3]])
          o.push(C(cx + sgn * rx * 0.45 + dx, eyeY + ry * 0.24 + dy, 1.1, skinDD, ' opacity="0.6"'));
      }

      // facial hair
      const mustache = P(d`M${cx - 14} ${mouthY - 2} Q${cx - 8} ${mouthY - 10} ${cx} ${mouthY - 7} Q${cx + 8} ${mouthY - 10} ${cx + 14} ${mouthY - 2} Q${cx + 6} ${mouthY - 5} ${cx} ${mouthY - 4} Q${cx - 6} ${mouthY - 5} ${cx - 14} ${mouthY - 2} Z`, hair);
      const beardInner = d` Q${cx + rx * 0.6} ${cy + ry * 0.25} ${cx + rx * 0.35} ${cy + ry * 0.55} Q${cx} ${cy + ry * 0.68} ${cx - rx * 0.35} ${cy + ry * 0.55} Q${cx - rx * 0.6} ${cy + ry * 0.25} ${L} ${cy - ry * 0.05} Z`;
      if (beard === 'stubble') o.push(P(d`M${L + 2} ${cy + ry * 0.15} Q${L + 4} ${cy + ry * 0.95} ${cx} ${cy + ry * 1.02} Q${R - 4} ${cy + ry * 0.95} ${R - 2} ${cy + ry * 0.15} Q${cx + rx * 0.5} ${cy + ry * 0.5} ${cx} ${cy + ry * 0.42} Q${cx - rx * 0.5} ${cy + ry * 0.5} ${L + 2} ${cy + ry * 0.15} Z`, hair, ' opacity="0.22"'));
      else if (beard === 'beard') o.push(P(d`M${L} ${cy - ry * 0.05} Q${L + 1} ${cy + ry * 0.95} ${cx} ${cy + ry * 1.16} Q${R - 1} ${cy + ry * 0.95} ${R} ${cy - ry * 0.05}` + beardInner, hair) + mustache);
      else if (beard === 'longbeard') o.push(P(d`M${L} ${cy - ry * 0.05} Q${L + 1} ${cy + ry * 1.15} ${cx} ${cy + ry * 1.62} Q${R - 1} ${cy + ry * 1.15} ${R} ${cy - ry * 0.05}` + beardInner, hair) + S(d`M${cx - 6} ${cy + ry * 0.95} Q${cx - 4} ${cy + ry * 1.25} ${cx - 2} ${cy + ry * 1.4}M${cx + 6} ${cy + ry * 0.95} Q${cx + 4} ${cy + ry * 1.25} ${cx + 2} ${cy + ry * 1.4}`, hairD, 1.2, ' stroke-opacity="0.6"') + mustache);
      else if (beard === 'mustache') o.push(mustache);
      else if (beard === 'goatee') o.push(mustache + P(d`M${cx - 7} ${mouthY + 7} Q${cx} ${cy + ry * 1.1} ${cx + 7} ${mouthY + 7} Q${cx} ${mouthY + 10} ${cx - 7} ${mouthY + 7} Z`, hair));
      else if (beard === 'chinstrap') o.push(S(d`M${L + 1} ${cy - ry * 0.05} Q${L + 2} ${cy + ry * 0.95} ${cx} ${cy + ry * 1.06} Q${R - 2} ${cy + ry * 0.95} ${R - 1} ${cy - ry * 0.05}`, hair, 4));
      else if (beard === 'soulpatch') o.push(E(cx, mouthY + 8, 2.6, 3.4, hair));
      else if (beard === 'sideburns') o.push(P(d`M${L + 0.5} ${g.y0 + 2} L${L + 6} ${g.y0 + 2} L${L + 6} ${cy + ry * 0.3} Q${L + 3} ${cy + ry * 0.36} ${L + 1} ${cy + ry * 0.3} Z M${R - 0.5} ${g.y0 + 2} L${R - 6} ${g.y0 + 2} L${R - 6} ${cy + ry * 0.3} Q${R - 3} ${cy + ry * 0.36} ${R - 1} ${cy + ry * 0.3} Z`, hair));
      else if (beard === 'handlebar') o.push(S(d`M${cx} ${mouthY - 6} Q${cx - 9} ${mouthY - 10} ${cx - 15} ${mouthY - 5} Q${cx - 19} ${mouthY - 1} ${cx - 17} ${mouthY - 8}M${cx} ${mouthY - 6} Q${cx + 9} ${mouthY - 10} ${cx + 15} ${mouthY - 5} Q${cx + 19} ${mouthY - 1} ${cx + 17} ${mouthY - 8}`, hair, 3.6));

      // nose
      if (noseStyle === 'hook') o.push(S(d`M${cx - 1} ${noseY - 8} Q${cx - 5} ${noseY + 2} ${cx + 1} ${noseY + 3}`, skinDD, 2.4));
      else if (noseStyle === 'button') o.push(E(cx, noseY, baby ? 3.5 : 4, baby ? 2.6 : 3, skinD));
      else o.push(C(cx - 3, noseY + 1, 1.4, skinDD) + C(cx + 3, noseY + 1, 1.4, skinDD));

      o.push(mouth(cx, mouthY, 1, lip, inner));
      if (race === 'vampire') o.push(P(d`M${cx - 6} ${mouthY - 1} L${cx - 2.5} ${mouthY - 1} L${cx - 4.3} ${mouthY + 5} Z M${cx + 6} ${mouthY - 1} L${cx + 2.5} ${mouthY - 1} L${cx + 4.3} ${mouthY + 5} Z`, '#FFFFFF'));
      if (race === 'orc' || race === 'oni') { const t = race === 'orc' ? 9 : 6; o.push(P(d`M${cx - 12} ${mouthY + 4} L${cx - 8} ${mouthY + 4} L${cx - 11} ${mouthY + 4 - t} Z M${cx + 12} ${mouthY + 4} L${cx + 8} ${mouthY + 4} L${cx + 11} ${mouthY + 4 - t} Z`, '#F4EEDC')); }

      // eyes + brows
      o.push(eyes(eyeY, ex, 1, eyeColor, skinD));
      const by = eyeY - (baby ? 12 : 11.5);
      let bp = '';
      for (const sgn of [-1, 1]) {
        const x = cx + sgn * ex;
        if (browStyle === 'straight') bp += d`M${x - 6} ${by}L${x + 6} ${by}`;
        else if (browStyle === 'angled') bp += d`M${x - sgn * 6} ${by - 1}L${x + sgn * 6} ${by + 1.5}`;
        else { const yy = by - (browStyle === 'raised' ? 2 : 0); bp += d`M${x - 6.5} ${yy + 1.5}Q${x} ${yy - 3.5} ${x + 6.5} ${yy + 1.5}`; }
      }
      o.push(S(bp, hairD, baby ? 1.6 : browStyle === 'thick' || race === 'orc' ? 4.5 : 3, baby ? ' stroke-opacity="0.45"' : ''));

      if (race === 'cyborg') {
        const x = cx + ex, mc = '#8E98A6', glow = pick(['#FF4A4A', '#4AE0FF', '#FFB84A'], X(7));
        o.push(P(d`M${cx + 3} ${top + ry * 0.4} L${R - 1} ${top + ry * 0.34} Q${R + 1} ${cy + ry * 0.2} ${R - 6} ${cy + ry * 0.42} L${cx + 6} ${cy + ry * 0.32} Z`, mc) +
          S(d`M${cx + 3} ${top + ry * 0.4} L${cx + 6} ${cy + ry * 0.32}`, '#5A6470', 1.6) + C(cx + 8, top + ry * 0.5, 1.6, '#5A6470') + C(R - 6, cy + ry * 0.3, 1.6, '#5A6470') +
          C(x, eyeY, 7, '#1E2430') + `<g${cls('X')}>` + C(x, eyeY, 9, glow, ' opacity="0.3"') + C(x, eyeY, 4, glow) + '</g>');
        extra = ['blink', '50% 50%'];
      }
      o.push(hairParts.front);
      if (race === 'oni') o.push(P(d`M${cx - rx * 0.42} ${top + 8} L${cx - rx * 0.32} ${top - 20} L${cx - rx * 0.18} ${top + 6} Z M${cx + rx * 0.42} ${top + 8} L${cx + rx * 0.32} ${top - 20} L${cx + rx * 0.18} ${top + 6} Z`, '#F2E8D0', ` stroke="${shade('#F2E8D0', 0.7)}" stroke-width="1.2"`));
      if (race === 'demon') for (const sgn of [-1, 1]) o.push(P(d`M${cx + sgn * rx * 0.4} ${top + 10} C${cx + sgn * rx * 0.8} ${top - 14} ${cx + sgn * rx * 1.3} ${top - 6} ${cx + sgn * rx * 1.18} ${top + ry * 0.3} Q${cx + sgn * rx * 1.0} ${top + 2} ${cx + sgn * rx * 0.68} ${top + 16} Z`, '#3A2A3A'));
    }

    // glasses
    if (glasses !== 'none') {
      const sun = glasses === 'sun';
      const lens = sun ? ` fill="#1E2228" fill-opacity="0.88" stroke="${INK}" stroke-width="2.2"` : ` fill="#FFFFFF" fill-opacity="0.18" stroke="${glassColor}" stroke-width="2.2"`;
      const fc = sun ? INK : glassColor;
      let gl = '';
      for (const sgn of [-1, 1]) {
        const x = cx + sgn * ex;
        if (glasses === 'round') gl += `<circle cx="${r1(x)}" cy="${r1(eyeY)}" r="9.5"${lens}/>`;
        else if (glasses === 'rect') gl += `<rect x="${r1(x - 10.5)}" y="${r1(eyeY - 7.5)}" width="21" height="15" rx="4"${lens}/>`;
        else if (sun) gl += `<path d="${d`M${x - 11} ${eyeY - 6} L${x + 11} ${eyeY - 6} Q${x + 11} ${eyeY + 8} ${x} ${eyeY + 8} Q${x - 11} ${eyeY + 8} ${x - 11} ${eyeY - 6} Z`}"${lens}/>` + S(d`M${x - 7} ${eyeY - 3} L${x - 3} ${eyeY - 3}`, '#FFFFFF', 1.4, ' stroke-opacity="0.5"');
        else gl += `<path d="${d`M${x - 10.5} ${eyeY - 5} Q${x - 10.5} ${eyeY + 7} ${x} ${eyeY + 7} Q${x + 10.5} ${eyeY + 7} ${x + 10.5} ${eyeY - 5} Z`}" fill="#FFFFFF" fill-opacity="0.18" stroke="${glassColor}" stroke-width="1.2"/>` + S(d`M${x - 10.5} ${eyeY - 5} L${x + 10.5} ${eyeY - 5}`, glassColor, 3.2);
      }
      const inset = glasses === 'round' ? 9.5 : glasses === 'sun' ? 11 : 10.5, gy = glasses === 'half' || sun ? eyeY - 5 : eyeY;
      gl += S(d`M${cx - ex + inset} ${gy} Q${cx} ${gy - 3} ${cx + ex - inset} ${gy}M${cx - ex - inset} ${gy - 1} L${L + 1} ${gy - 3}M${cx + ex + inset} ${gy - 1} L${R - 1} ${gy - 3}`, fc, 2.2);
      o.push(gl);
    }

    if (hat !== 'none') o.push(headwear(hat, g, hatHue));

    // accessories
    if (acc === 'headphones') {
      const hp = '#3A3A38', ac = hsl(clothHue, 60, 60);
      o.push(S(d`M${L - 7} ${cy} A${rx + 7} ${ry + 13} 0 0 1 ${R + 7} ${cy}`, hp, 6));
      o.push(`<rect x="${r1(L - 11)}" y="${r1(cy - 12)}" width="12" height="26" rx="5" fill="${hp}"/><rect x="${r1(R - 1)}" y="${r1(cy - 12)}" width="12" height="26" rx="5" fill="${hp}"/>`);
      o.push(`<rect x="${r1(L - 8)}" y="${r1(cy - 6)}" width="5" height="14" rx="2.5" fill="${ac}"/><rect x="${r1(R + 3)}" y="${r1(cy - 6)}" width="5" height="14" rx="2.5" fill="${ac}"/>`);
    } else if (acc === 'earrings') {
      o.push(C(L + 1, cy + 15, 2.6, '#D4A537') + C(R - 1, cy + 15, 2.6, '#D4A537'));
    }
    if (!creature && baby && female && hat === 'none' && (X(2) & 1) && style !== 'sprout') {
      const bx = cx + rx * 0.45, byy = top + ry * 0.12, pk = hsl(340, 70, 72);
      o.push(P(d`M${bx} ${byy} L${bx - 9} ${byy - 6} L${bx - 9} ${byy + 6} Z M${bx} ${byy} L${bx + 9} ${byy - 6} L${bx + 9} ${byy + 6} Z`, pk) + C(bx, byy, 2.8, hsl(340, 60, 55)));
    }
    if (race === 'angel') { o.push(xg(E(cx, top - 12, rx * 0.72, 7, 'none', ' stroke="#F2C94C" stroke-width="4"') + E(cx, top - 12, rx * 0.72, 7, 'none', ' stroke="#FFF3B0" stroke-width="1.4"'))); extra = ['float', '50% 50%']; }
    o.push('</g>'); // head group
    o.push(art === 'pixel' ? '</g></g>' : '</g>'); // (pixel filter group +) clip group

    // ink style: a red seal whose glyph is drawn from 16 hash bits
    if (art === 'ink') {
      let cells = '';
      for (let i = 0; i < 16; i++) if ((b[(i >> 3) + 28] >> (i & 7)) & 1) cells += `<rect x="${219 + (i & 3) * 6}" y="${219 + (i >> 2) * 6}" width="5" height="5"/>`;
      o.push(`<rect x="215" y="215" width="32" height="32" rx="3" fill="#B8292F"/><g fill="#F7EBDD">${cells}</g>`);
    }
    if (anim) o.push(`<g clip-path="url(#${id}c)"><circle cx="128" cy="128" r="120" fill="url(#${id}L)" class="${id}G"/></g>`);
    o.push('</g></svg>');

    // ----- animation css (every number comes from the hash-seeded PRNG) -----
    if (anim) {
      const kf = (n, body) => css.push(`@keyframes ${id}${n}{${body}}`);
      const rule = (n, body) => css.push(`.${id}${n}{${body}}`);
      const motions = ['bob', 'sway', 'tilt', 'bounce', 'nod', 'float'];
      const hm = headMotion || motions[rnd() * motions.length | 0];
      const amp = 1.5 + rnd() * 2.2, hd = 2.6 + rnd() * 3;
      const hk = {
        bob: `0%,100%{transform:translateY(0)}50%{transform:translateY(-${n2(amp)}px)}`,
        sway: `0%,100%{transform:rotate(-${n2(amp)}deg)}50%{transform:rotate(${n2(amp)}deg)}`,
        tilt: `0%,100%{transform:rotate(0)}30%{transform:rotate(${n2(amp * 1.3)}deg)}70%{transform:rotate(-${n2(amp * 0.7)}deg)}`,
        bounce: `0%,100%{transform:translateY(0)}40%{transform:translateY(-${n2(amp * 1.6)}px)}55%{transform:translateY(1px)}70%{transform:translateY(0)}`,
        nod: `0%,55%,100%{transform:translateY(0)}65%{transform:translateY(${n2(amp)}px)}75%{transform:translateY(-${n2(amp * 0.4)}px)}`,
        float: `0%,100%{transform:translateY(0) rotate(-1deg)}50%{transform:translateY(-${n2(amp * 2)}px) rotate(1deg)}`,
        squash: `0%,100%{transform:scale(1,1)}50%{transform:scale(1.05,0.94)}`,
      }[hm];
      kf('h', hk);
      rule('H', `animation:${id}h ${n2(hd)}s ease-in-out -${n2(rnd() * hd)}s infinite;transform-origin:128px ${hm === 'squash' ? 248 : r1(sh)}px`);
      // blink: period, timing and an optional double blink are all per identity
      const bp = 3 + rnd() * 4, at = 20 + rnd() * 60, dbl = rnd() < 0.3;
      kf('e', `0%,${pct(at)},${pct(at + 4)},100%{transform:scaleY(1)}${pct(at + 2)}{transform:scaleY(0.1)}` + (dbl ? `${pct(at + 7)}{transform:scaleY(1)}${pct(at + 9)}{transform:scaleY(0.1)}${pct(at + 11)}{transform:scaleY(1)}` : ''));
      rule('E', `animation:${id}e ${n2(bp)}s infinite;transform-origin:128px ${r1(eyeY)}px`);
      // fingerprint wave: speed, direction and number of crests per identity
      if (fp) {
        kf('r', '0%,100%{opacity:1}50%{opacity:0.3}');
        rule('R', `animation:${id}r ${n2(rp)}s ease-in-out infinite`);
      }
      kf('b', `to{transform:rotate(${rnd() < 0.5 ? '' : '-'}360deg)}`);
      rule('B', `animation:${id}b ${n2(20 + rnd() * 30)}s linear infinite;transform-origin:128px 128px`);
      kf('s', '0%,100%{transform:scale(0);opacity:0}50%{transform:scale(1);opacity:0.9}');
      rule('S', `animation:${id}s 2s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 50%`);
      if (extra) {
        const [kind, origin] = extra, xa = 4 + rnd() * 8, xd = 1.5 + rnd() * 3;
        const xk = {
          twitch: `0%,${pct(80)},100%{transform:rotate(0)}${pct(85)}{transform:rotate(-${n2(xa)}deg)}${pct(90)}{transform:rotate(${n2(xa * 0.6)}deg)}`,
          wag: `0%,100%{transform:rotate(-${n2(xa * 0.5)}deg)}50%{transform:rotate(${n2(xa * 0.5)}deg)}`,
          blink: '0%,100%{opacity:1}50%{opacity:0.35}',
          float: `0%,100%{transform:translateY(0)}50%{transform:translateY(-${n2(xa * 0.4)}px)}`,
          spin: 'to{transform:rotate(360deg)}',
          flap: '0%,100%{transform:scaleX(1)}50%{transform:scaleX(0.9)}',
        }[kind];
        kf('x', xk);
        rule('X', `animation:${id}x ${n2(kind === 'spin' ? xd * 3 : xd)}s ${kind === 'spin' ? 'linear' : 'ease-in-out'} infinite;transform-box:fill-box;transform-origin:${origin}`);
      }
      // interaction (inline SVG only; <img> ignores hover)
      // card effect: the face tilts away from the pointer and a glare follows it; scaled down so it never leaves the canvas
      rule('W', 'pointer-events:none;transition:transform .35s ease-out;transform-origin:128px 128px');
      rule('G', 'opacity:0;transition:opacity .35s,transform .35s ease-out;transform-origin:128px 128px');
      for (let k = 0; k < 9; k++) {
        const col = k % 3 - 1, row = (k / 3 | 0) - 1;
        css.push(`.${id}z${k}:hover~.${id}W{transform:perspective(520px) rotateX(${-row * 14}deg) rotateY(${col * 14}deg) scale(0.92)}` +
          `.${id}z${k}:hover~.${id}W .${id}G{opacity:0.55;transform:translate(${col * 64}px,${row * 64}px)}`);
      }
      css.push(`.${id}:hover .${id}R{animation-duration:0.8s}`);
      css.push(`@media (prefers-reduced-motion:reduce){.${id} *{animation:none!important;transition:none!important}}`);
      o[cssAt] = `<style>${css.join('')}</style>` + o[cssAt];
    }
    return o.join('');
  }

  // ---------- QR code (byte mode, error correction level H, versions 1..40) ----------
  const QR_ECC = [-1, 17, 28, 22, 16, 22, 28, 26, 26, 24, 28, 24, 28, 22, 24, 24, 30, 28, 28, 26, 28, 30, 24, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30];
  const QR_BLOCKS = [-1, 1, 1, 2, 4, 4, 4, 5, 6, 8, 8, 11, 11, 16, 16, 18, 16, 19, 21, 25, 25, 25, 34, 30, 32, 35, 37, 40, 42, 45, 48, 51, 54, 57, 60, 63, 66, 70, 74, 77, 81];
  function qrRaw(v) {
    let r = (16 * v + 128) * v + 64;
    if (v >= 2) { const n = (v / 7 | 0) + 2; r -= (25 * n - 10) * n - 55; if (v >= 7) r -= 36; }
    return r;
  }
  const gfMul = (x, y) => { let z = 0; for (let i = 7; i >= 0; i--) { z = (z << 1) ^ ((z >>> 7) * 0x11D); z ^= ((y >>> i) & 1) * x; } return z; };
  function rsDivisor(deg) {
    const r = Array(deg).fill(0); r[deg - 1] = 1; let root = 1;
    for (let i = 0; i < deg; i++) {
      for (let j = 0; j < deg; j++) { r[j] = gfMul(r[j], root); if (j + 1 < deg) r[j] ^= r[j + 1]; }
      root = gfMul(root, 2);
    }
    return r;
  }
  function rsRemainder(data, div) {
    const r = div.map(() => 0);
    for (const x of data) { const f = x ^ r.shift(); r.push(0); div.forEach((c, i) => { r[i] ^= gfMul(c, f); }); }
    return r;
  }
  function qrMatrix(text, minVersion) {
    const data = enc.encode(String(text));
    let v = Math.max(1, Math.min(40, minVersion | 0));
    for (; v <= 40; v++) if (4 + (v < 10 ? 8 : 16) + data.length * 8 <= ((qrRaw(v) >> 3) - QR_ECC[v] * QR_BLOCKS[v]) * 8) break;
    if (v > 40) throw new RangeError('qr: data too long');
    const cap = (qrRaw(v) >> 3) - QR_ECC[v] * QR_BLOCKS[v];
    const bits = [];
    const put = (val, n) => { for (let i = n - 1; i >= 0; i--) bits.push((val >>> i) & 1); };
    put(4, 4); put(data.length, v < 10 ? 8 : 16); for (const x of data) put(x, 8);
    put(0, Math.min(4, cap * 8 - bits.length)); put(0, (8 - bits.length % 8) % 8);
    for (let p = 0xEC; bits.length < cap * 8; p ^= 0xEC ^ 0x11) put(p, 8);
    const cw = []; for (let i = 0; i < bits.length; i += 8) { let x = 0; for (let j = 0; j < 8; j++) x = x << 1 | bits[i + j]; cw.push(x); }
    // split into blocks, add Reed-Solomon codewords, interleave
    const nb = QR_BLOCKS[v], ecl = QR_ECC[v], raw = qrRaw(v) >> 3, nShort = nb - raw % nb, shortLen = raw / nb | 0;
    const div = rsDivisor(ecl), blocks = [];
    for (let i = 0, k = 0; i < nb; i++) {
      const dat = cw.slice(k, k + shortLen - ecl + (i < nShort ? 0 : 1)); k += dat.length;
      const ec = rsRemainder(dat, div); if (i < nShort) dat.push(0);
      blocks.push(dat.concat(ec));
    }
    const all = [];
    for (let i = 0; i < blocks[0].length; i++) blocks.forEach((bl, j) => { if (i !== shortLen - ecl || j >= nShort) all.push(bl[i]); });

    const n = v * 4 + 17, M = [], fn = [];
    for (let i = 0; i < n; i++) { M.push(Array(n).fill(0)); fn.push(Array(n).fill(0)); }
    const set = (x, y, dk) => { M[y][x] = dk ? 1 : 0; fn[y][x] = 1; };
    for (let i = 0; i < n; i++) { set(6, i, i % 2 === 0); set(i, 6, i % 2 === 0); }
    for (const [fx, fy] of [[3, 3], [n - 4, 3], [3, n - 4]])
      for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) {
        const x = fx + dx, y = fy + dy, dist = Math.max(Math.abs(dx), Math.abs(dy));
        if (x >= 0 && x < n && y >= 0 && y < n) set(x, y, dist !== 2 && dist !== 4);
      }
    if (v > 1) {
      const na = (v / 7 | 0) + 2, step = ((v * 8 + na * 3 + 5) / (na * 4 - 4) | 0) * 2, pos = [6];
      for (let p = n - 7; pos.length < na; p -= step) pos.splice(1, 0, p);
      for (let i = 0; i < na; i++) for (let j = 0; j < na; j++) {
        if ((i === 0 && j === 0) || (i === 0 && j === na - 1) || (i === na - 1 && j === 0)) continue;
        for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) set(pos[i] + dx, pos[j] + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
      }
    }
    const format = mask => {
      const dt = 2 << 3 | mask; let r = dt;
      for (let i = 0; i < 10; i++) r = (r << 1) ^ ((r >>> 9) * 0x537);
      const f = (dt << 10 | r) ^ 0x5412, bit = i => (f >>> i) & 1;
      for (let i = 0; i <= 5; i++) set(8, i, bit(i));
      set(8, 7, bit(6)); set(8, 8, bit(7)); set(7, 8, bit(8));
      for (let i = 9; i < 15; i++) set(14 - i, 8, bit(i));
      for (let i = 0; i < 8; i++) set(n - 1 - i, 8, bit(i));
      for (let i = 8; i < 15; i++) set(8, n - 15 + i, bit(i));
      set(8, n - 8, 1);
    };
    format(0);
    if (v >= 7) {
      let r = v; for (let i = 0; i < 12; i++) r = (r << 1) ^ ((r >>> 11) * 0x1F25);
      const vb = v << 12 | r;
      for (let i = 0; i < 18; i++) { const bt = (vb >>> i) & 1, a = n - 11 + i % 3, c = i / 3 | 0; set(a, c, bt); set(c, a, bt); }
    }
    let bi = 0;
    for (let right = n - 1; right >= 1; right -= 2) {
      if (right === 6) right = 5;
      for (let vert = 0; vert < n; vert++) for (let j = 0; j < 2; j++) {
        const x = right - j, y = ((right + 1) & 2) === 0 ? n - 1 - vert : vert;
        if (!fn[y][x] && bi < all.length * 8) { M[y][x] = (all[bi >>> 3] >>> (7 - (bi & 7))) & 1; bi++; }
      }
    }
    const MASKS = [(x, y) => (x + y) % 2, (x, y) => y % 2, (x, y) => x % 3, (x, y) => (x + y) % 3, (x, y) => ((x / 3 | 0) + (y / 2 | 0)) % 2,
      (x, y) => x * y % 2 + x * y % 3, (x, y) => (x * y % 2 + x * y % 3) % 2, (x, y) => ((x + y) % 2 + x * y % 3) % 2];
    const apply = k => { for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (!fn[y][x] && MASKS[k](x, y) === 0) M[y][x] ^= 1; };
    const penalty = () => {
      let p = 0, dark = 0;
      const lines = [];
      for (let y = 0; y < n; y++) { lines.push(M[y].join('')); lines.push(M.map(r => r[y]).join('')); }
      for (const s of lines) {
        for (const run of s.match(/0+|1+/g)) if (run.length >= 5) p += run.length - 2;
        p += 40 * ((s.match(/(?=10111010000|00001011101)/g) || []).length);
      }
      for (let y = 0; y < n - 1; y++) for (let x = 0; x < n - 1; x++) { const c = M[y][x]; if (c === M[y][x + 1] && c === M[y + 1][x] && c === M[y + 1][x + 1]) p += 3; }
      for (const r of M) for (const c of r) dark += c;
      return p + 10 * (Math.ceil(Math.abs(dark * 20 - n * n * 10) / (n * n)) - 1);
    };
    let best = 0, bestP = Infinity;
    for (let k = 0; k < 8; k++) { apply(k); format(k); const p = penalty(); if (p < bestP) { bestP = p; best = k; } apply(k); }
    apply(best); format(best);
    return M;
  }

  // Avatar in the middle of a QR code. Level H tolerates the covered centre.
  function qrSvg(text, avatarSvg, opts, b) {
    const M = qrMatrix(text, 3), n = M.length, q = 4, W = n + 2 * q, size = opts.size || 256;
    const hue = b[16] / 256 * 360, dark = hsl(hue, 45, 18), eyeC = hsl(hue, 55, 30);
    const D = Math.max(7, Math.round(n * 0.3)), c0 = (W - D) / 2;
    const inFinder = (x, y) => (x < 8 && y < 8) || (x >= n - 8 && y < 8) || (x < 8 && y >= n - 8);
    const hole = (x, y) => { const dx = x + 0.5 - n / 2, dy = y + 0.5 - n / 2; return dx * dx + dy * dy < (D / 2 + 1) * (D / 2 + 1); };
    let p = '';
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (M[y][x] && !inFinder(x, y) && !hole(x, y)) p += `M${x + q} ${y + q}h1v1h-1z`;
    let eyes = '';
    for (const [fx, fy] of [[0, 0], [n - 7, 0], [0, n - 7]]) eyes += `<rect x="${fx + q + 0.5}" y="${fy + q + 0.5}" width="6" height="6" rx="1.6" fill="none" stroke="${eyeC}"/><rect x="${fx + q + 2}" y="${fy + q + 2}" width="3" height="3" rx="0.8" fill="${eyeC}"/>`;
    const inner = avatarSvg.replace(/^<svg [^>]*?viewBox="0 0 256 256" width="\d+" height="\d+"/, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" x="${c0}" y="${c0}" width="${D}" height="${D}"`);
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${W}" width="${size}" height="${size}" role="img" shape-rendering="crispEdges"><title>qr ${b.slice(0, 4).reduce((s, x) => s + (x < 16 ? '0' : '') + x.toString(16), '')}</title>` +
      `<rect width="${W}" height="${W}" rx="2" fill="#FFFFFF"/><path d="${p}" fill="${dark}"/>${eyes}<g shape-rendering="auto">${inner}</g></svg>`;
  }

  function svg(input, opts) {
    opts = opts || {};
    if (opts.qr == null || opts.qr === '') return avatar(input, opts);
    // Inside a QR code the avatar is only ~70 px wide, so pixel art uses 1-px cells: that is the plain raster.
    const a = avatar(input, Object.assign({}, opts, { size: 256, art: opts.art === 'pixel' ? 'flat' : opts.art }));
    return qrSvg(opts.qr, a, opts, hash(input, opts.salt).bytes);
  }

  const api = { svg, hash, normalize, sha256, qrMatrix, GENDERS, AGES, RACES, ARTS, version: 'v1' };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.HashAvatar = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
