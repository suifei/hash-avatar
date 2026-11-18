// Builds assets/logo.svg (honeycomb of avatars), dist/banner.svg (README header, 12 x 4 gallery) and
// dist/social-preview.svg (1280x640 GitHub social card). Render the two dist files to assets/*.png with a headless browser.
const fs = require('fs'), path = require('path');
const HA = require('../src/hash-avatar.js');
const out = path.join(__dirname, '..', 'assets');
fs.mkdirSync(out, { recursive: true }); fs.mkdirSync(path.join(__dirname, '..', 'dist'), { recursive: true });

const CENTER = ['flynn', { gender: 'male', age: 'youth', race: 'asian' }];
const RING = [
  ['luna', { gender: 'female', age: 'youth', race: 'cat' }],
  ['ruyi', { gender: 'neutral', age: 'youth', race: 'qilin' }],
  ['amara', { gender: 'female', age: 'youth', race: 'black' }],
  ['rx-78', { gender: 'male', age: 'youth', race: 'robot' }],
  ['fenghuang', { gender: 'female', age: 'youth', race: 'phoenix' }],
  ['priya', { gender: 'female', age: 'middle', race: 'southasian' }],
];

// place one avatar: nested <svg> with its own position and size
const place = ([name, o], cx, cy, r, animate) =>
  HA.svg(name, { ...o, animate }).replace(/^<svg ([^>]*?)width="\d+" height="\d+"/, `<svg $1x="${cx - r}" y="${cy - r}" width="${2 * r}" height="${2 * r}"`);

function honeycomb(cx, cy, scale, animate) {
  const rc = 96 * scale, r = 70 * scale, dist = rc + r + 2 * scale;
  let s = '';
  RING.forEach((a, i) => {
    const t = -Math.PI / 2 + i * Math.PI / 3;
    s += place(a, Math.round(cx + dist * Math.cos(t)), Math.round(cy + dist * Math.sin(t)), Math.round(r), animate);
  });
  return s + place(CENTER, cx, cy, Math.round(rc), animate);
}

const logo = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">` +
  `<title>hash-avatar</title>${honeycomb(256, 256, 1, true)}</svg>\n`;
fs.writeFileSync(path.join(out, 'logo.svg'), logo);

const font = `font-family="Inter, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif"`;
console.log('wrote assets/logo.svg', (logo.length / 1024).toFixed(1) + ' KB');

// banner: the README gallery composition, 12 x 4
const PEOPLE = ['alice', 'bob', 'carol', 'dave', 'eve', 'frank', 'grace', 'heidi',
  'ivan', 'judy', 'mallory', 'niaj', 'olivia', 'peggy', 'rupert', 'sybil',
  'trent', 'victor', 'walter', 'xiao.ming', '李伟', '王芳', '張偉', 'yuki',
  'amara', 'kwame', 'priya', 'arjun', 'sofia', 'mateo', 'noah', 'zoe',
  'liam', 'emma', 'chen.jie', 'lin.mei', 'hiro', 'sakura', 'min-jun', 'ji-woo',
  'fatima', 'omar', 'chidi', 'ngozi', 'lucas', 'ines', 'olaf', 'freya'];
const HUM = HA.GROUPS.human, OTHER = HA.RACES.filter(x => x !== 'any' && HUM.indexOf(x) < 0);
const gallery = PEOPLE.map((p, i) => {
  const q = { gender: HA.GENDERS[i % 3], age: HA.AGES[(i * 2 + (i >> 2)) % 5], race: i % 2 ? HUM[(i + (i >> 3)) % HUM.length] : OTHER[(i * 7) % OTHER.length] };
  if (i % 6 === 5) q.art = HA.ARTS[1 + (i / 6 | 0) % (HA.ARTS.length - 1)];
  return [p, q];
});
const grid = (cols, cell, gap, x0, y0, list, animate) => list.map((a, i) =>
  place(a, x0 + (i % cols) * (cell + gap) + cell / 2, y0 + (i / cols | 0) * (cell + gap) + cell / 2, cell / 2, animate)).join('');

const banner = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1548 520" width="1548" height="520"><title>hash-avatar</title>` +
  grid(12, 120, 8, 6, 6, gallery, false) + '</svg>\n';
fs.writeFileSync(path.join(__dirname, '..', 'dist', 'banner.svg'), banner);

const social2 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 640" width="1280" height="640">` +
  `<rect width="1280" height="640" fill="#FFFFFF"/>` + grid(12, 98, 6, 18, 18, gallery, false) +
  `<text x="640" y="532" text-anchor="middle" ${font} font-size="76" font-weight="800" fill="#141A2A" letter-spacing="-2">hash-avatar</text>` +
  `<text x="640" y="590" text-anchor="middle" ${font} font-size="26" fill="#56607A">Deterministic SVG avatars from any name · ${HA.RACES.length} races · ${HA.ARTS.length} art styles · React &amp; Vue</text></svg>\n`;
fs.writeFileSync(path.join(__dirname, '..', 'dist', 'social-preview.svg'), social2);
console.log('wrote dist/banner.svg + dist/social-preview.svg', (banner.length / 1024).toFixed(1) + ' KB');
