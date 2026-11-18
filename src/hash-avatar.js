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
  const RACES = ['asian', 'white', 'black', 'brown', 'auto'];
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

  // ---------- render ----------
  function svg(input, opts) {
    opts = opts || {};
    const gender = GENDERS.indexOf(opts.gender) >= 0 ? opts.gender : 'neutral';
    const age = AGES.indexOf(opts.age) >= 0 ? opts.age : 'youth';
    const race = RACES.indexOf(opts.race) >= 0 ? opts.race : 'auto';
    const size = opts.size || 256;
    const fp = opts.fingerprint !== false;
    const force = opts._force || {};
    const H = hash(input, opts.salt), b = H.bytes;
    // bytes 0..15 are drawn as the fingerprint ring; 16..31 drive the main features (fixed slots).
    // Secondary features reuse bytes 0..15: uniqueness comes from the ring, so reuse costs nothing.
    const F = i => b[16 + i], X = i => b[i];
    const pick = (arr, v) => arr[v % arr.length];

    const baby = age === 'baby', old = age === 'old', middle = age === 'middle', teen = age === 'teen';
    const male = gender === 'male', female = gender === 'female';
    const band = baby ? 'baby' : old ? 'old' : middle ? 'middle' : 'young';

    // features
    const bgHue = F(0) / 256 * 360;
    const skin = pick(SKIN_BY[race], F(1));
    let hair = old ? pick(HAIR_OLD, F(2)) : pick(HAIR_BY[race], F(2));
    const misc = F(14), deco = F(15);
    if (middle && (misc >> 6) === 3) hair = mix(hair, '#B4B4AF', 0.45);
    const base = STYLES[gender][band], bonus = STYLE_BONUS[race];
    let styles = base.slice();
    for (let k = 0; k < bonus[1]; k++) for (const s of bonus[0]) if (base.indexOf(s) >= 0) styles.push(s);
    const style = force.style || pick(styles, F(3) | X(4) << 8);
    const eyeStyle = pick(baby ? ['dot', 'oval', 'oval'] : ['dot', 'oval', 'happy', 'sleepy', 'dot', 'oval'], F(4));
    const eyeColor = pick(EYE_BY[race], F(5));
    const browStyle = pick(['straight', 'arched', 'angled', 'thick', 'raised'], F(6));
    const noseStyle = baby ? 'button' : pick(['hook', 'button', 'nostrils'], F(7));
    const mouthStyle = pick(baby ? ['smile', 'o', 'pacifier', 'grin'] : ['smile', 'grin', 'o', 'smirk', 'flat', 'smile'], F(8));
    const glassList = baby ? ['none'] : old ? ['none', 'round', 'rect', 'half', 'round', 'rect'] : middle ? ['none', 'none', 'none', 'round', 'rect', 'half', 'rect', 'sun'] : ['none', 'none', 'none', 'none', 'round', 'rect', 'half', 'sun'];
    const glasses = force.glasses || pick(glassList, F(9)), glassColor = pick(GLASS, F(9) >> 4);
    const beardList = (!male || baby || teen) ? ['none']
      : old ? ['none', 'none', 'mustache', 'beard', 'longbeard', 'goatee', 'handlebar', 'longbeard']
      : middle ? ['none', 'none', 'stubble', 'mustache', 'beard', 'goatee', 'chinstrap', 'beard', 'handlebar', 'sideburns']
      : ['none', 'none', 'none', 'stubble', 'mustache', 'beard', 'goatee', 'chinstrap', 'soulpatch', 'sideburns', 'handlebar'];
    const beard = force.beard || pick(beardList, F(10));
    let acc = pick(baby ? ['none'] : male ? ['none', 'none', 'headphones', 'none'] : ['none', 'none', 'headphones', 'earrings'], F(11));
    const clothList = baby ? ['onesie', 'stripes', 'overalls'] : ['tee', 'hoodie', 'collar', 'cardigan', 'suit', 'turtleneck', 'stripes', 'overalls'];
    const cloth = force.cloth || pick(clothList, F(12));
    const clothHue = F(13) / 256 * 360;
    const freckles = !baby && (misc >> 4 & 1), blush = baby || (misc >> 5 & 1);
    const none = n => Array(n).fill('none');
    const hatList = baby ? ['none', 'none', 'knit', female ? 'bonnet' : 'knit']
      : old ? none(7).concat(['beanie', 'cap', male ? 'flatcap' : female ? 'sunhat' : 'beret'])
      : middle ? none(9).concat(['beanie', 'cap', 'beret', male ? 'flatcap' : 'headband'])
      : none(12).concat(['beanie', 'cap', 'bucket', 'beret', 'headband', male ? 'beanie' : 'flower']);
    let hat = force.hat || pick(hatList, X(0));
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
    const id = 'ha' + H.hex.slice(0, 12) + gender[0] + age[0] + RACES.indexOf(race) + (fp ? 'f' : 'n');
    const R0 = fp ? 106 : 128;

    const o = [];
    o.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="${size}" height="${size}" role="img"><title>avatar ${H.hex.slice(0, 8)}</title>`);
    o.push(`<defs><clipPath id="${id}"><circle cx="128" cy="128" r="${R0}"/></clipPath>`);
    const bw = G0.bw;
    const bodyPath = d`M${cx - bw} 256 C${cx - bw} ${sh + 6} ${cx - bw * 0.55} ${sh - 6} ${cx} ${sh - 7} C${cx + bw * 0.55} ${sh - 6} ${cx + bw} ${sh + 6} ${cx + bw} 256Z`;
    o.push(`<clipPath id="${id}b"><path d="${bodyPath}"/></clipPath></defs>`);

    // fingerprint ring: 128 bits of the hash, one slot each, clockwise from 12 o'clock
    if (fp) {
      o.push(`<circle cx="128" cy="128" r="128" fill="${hsl(bgHue, 35, 22)}"/>`);
      let on = '', off = '';
      for (let i = 0; i < 128; i++) {
        const a = (i + 0.5) / 128 * 2 * Math.PI - Math.PI / 2, c = Math.cos(a), s = Math.sin(a);
        if ((b[i >> 3] >> (7 - (i & 7))) & 1) on += d`M${128 + 110 * c} ${128 + 110 * s}L${128 + 123 * c} ${128 + 123 * s}`;
        else off += d`M${128 + 116.5 * c} ${128 + 116.5 * s}h0`;
      }
      const tc = hsl(bgHue, 70, 82);
      o.push(`<path d="${on}" stroke="${tc}" stroke-width="3"/>`);
      o.push(`<path d="${off}" stroke="${tc}" stroke-opacity="0.35" stroke-width="2.2" stroke-linecap="round"/>`);
    }

    o.push(`<g clip-path="url(#${id})">`);
    o.push(C(128, 128, R0, bg));
    const da = deco / 256 * 2 * Math.PI;
    o.push(C(128 + 72 * Math.cos(da), 128 + 72 * Math.sin(da), 26, bgL, ' opacity="0.7"'));
    o.push(C(128 - 78 * Math.cos(da), 128 - 78 * Math.sin(da), 36, bgD, ' opacity="0.45"'));

    const hairParts = HAIR_FN[style](g, hair, clothC, hairD);
    if (hairParts.back) o.push(hairParts.back);

    // neck + body
    o.push(`<rect x="${cx - 10}" y="${r1(cy + ry * 0.6)}" width="20" height="${r1(sh - cy - ry * 0.6 + 10)}" fill="${skinD}"/>`);
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
    if (hairParts.mid) o.push(hairParts.mid);

    // ears + head
    o.push(E(L + 1, cy + 4, 7, baby ? 9 : 10, skinD) + E(R - 1, cy + 4, 7, baby ? 9 : 10, skinD));
    o.push(E(cx, cy, rx, ry, skin));

    const eyeY = cy + ry * (baby ? 0.14 : 0.04), ex = rx * 0.4;
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

    // mouth
    if (mouthStyle === 'smile') o.push(S(d`M${cx - 10} ${mouthY - 2} Q${cx} ${mouthY + 8} ${cx + 10} ${mouthY - 2}`, lip, 3));
    else if (mouthStyle === 'grin') o.push(P(d`M${cx - 11} ${mouthY - 3} Q${cx} ${mouthY + 13} ${cx + 11} ${mouthY - 3} Z`, inner) + P(d`M${cx - 9.5} ${mouthY - 2.6} L${cx + 9.5} ${mouthY - 2.6} Q${cx} ${mouthY + 2.5} ${cx - 9.5} ${mouthY - 2.6} Z`, '#FFFFFF'));
    else if (mouthStyle === 'o') o.push(E(cx, mouthY + 1, 3.5, 4, inner));
    else if (mouthStyle === 'smirk') o.push(S(d`M${cx - 8} ${mouthY + 1} Q${cx + 2} ${mouthY + 4} ${cx + 10} ${mouthY - 3}`, lip, 3));
    else if (mouthStyle === 'flat') o.push(S(d`M${cx - 7} ${mouthY + 1} L${cx + 7} ${mouthY + 1}`, lip, 3));
    else {
      const pc = hsl(clothHue, 70, 66);
      o.push(S(d`M${cx} ${mouthY + 5} m-3.5 0 a3.5 3.5 0 1 0 7 0 a3.5 3.5 0 1 0 -7 0`, pc, 1.8) + E(cx, mouthY, 9, 5.5, pc) + C(cx, mouthY, 2.6, hsl(clothHue, 70, 82)));
    }

    // eyes
    for (const sgn of [-1, 1]) {
      const x = cx + sgn * ex, y = eyeY;
      if (eyeStyle === 'dot') {
        o.push(C(x, y, baby ? 5.5 : 4.3, INK) + C(x + 1.4, y - 1.6, 1.5, '#FFFFFF'));
      } else if (eyeStyle === 'happy') {
        o.push(S(d`M${x - 6} ${y + 1.5} Q${x} ${y - 5} ${x + 6} ${y + 1.5}`, INK, 3));
      } else {
        const sx = baby ? 8 : 7, sy = baby ? 7 : 5.6, ir = baby ? 5.4 : 4;
        o.push(E(x, y, sx, sy, '#FFFFFF', ` stroke="${INK}" stroke-opacity="0.5" stroke-width="1.2"`) + C(x, y + 0.3, ir, eyeColor) + C(x, y + 0.3, ir * 0.5, '#1E1A18') + C(x + 1.4, y - 1.3, 1.3, '#FFFFFF'));
        if (eyeStyle === 'sleepy') o.push(P(d`M${x - 7.6} ${y + 0.5} A7.6 6.2 0 0 1 ${x + 7.6} ${y + 0.5} Z`, skinD) + S(d`M${x - 7.6} ${y + 0.5} L${x + 7.6} ${y + 0.5}`, INK, 1.6));
      }
      if (female && !baby) o.push(S(d`M${x + sgn * 6} ${y - 3} L${x + sgn * 9.5} ${y - 6.5}`, INK, 2));
    }

    // brows
    const by = eyeY - (baby ? 12 : 11.5);
    let bp = '';
    for (const sgn of [-1, 1]) {
      const x = cx + sgn * ex;
      if (browStyle === 'straight') bp += d`M${x - 6} ${by}L${x + 6} ${by}`;
      else if (browStyle === 'angled') bp += d`M${x - sgn * 6} ${by - 1}L${x + sgn * 6} ${by + 1.5}`;
      else { const yy = by - (browStyle === 'raised' ? 2 : 0); bp += d`M${x - 6.5} ${yy + 1.5}Q${x} ${yy - 3.5} ${x + 6.5} ${yy + 1.5}`; }
    }
    o.push(S(bp, hairD, baby ? 1.6 : browStyle === 'thick' ? 4.5 : 3, baby ? ' stroke-opacity="0.45"' : ''));

    o.push(hairParts.front);

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
    if (baby && female && hat === 'none' && (X(2) & 1) && style !== 'sprout') {
      const bx = cx + rx * 0.45, byy = top + ry * 0.12, pk = hsl(340, 70, 72);
      o.push(P(d`M${bx} ${byy} L${bx - 9} ${byy - 6} L${bx - 9} ${byy + 6} Z M${bx} ${byy} L${bx + 9} ${byy - 6} L${bx + 9} ${byy + 6} Z`, pk) + C(bx, byy, 2.8, hsl(340, 60, 55)));
    }

    o.push('</g></svg>');
    return o.join('');
  }

  const api = { svg, hash, normalize, sha256, GENDERS, AGES, RACES, version: 'v1' };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.HashAvatar = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
