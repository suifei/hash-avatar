// Builds dist/world.svg: a north-pole azimuthal equidistant world map (the "flat" map of the UN emblem)
// filled with avatars, each region with its own mix of humans, animals and myths.
// The land mask was sampled from Natural Earth 1:50m land (public domain) on the same honeycomb grid.
// Render to PNG for the README with any headless browser, e.g.
//   msedge --headless=new --window-size=1400,1400 --screenshot=assets/world.png dist/world.svg
const fs = require('fs'), path = require('path');
const HA = require('../src/hash-avatar.js');
const M = {"R":700,"d":30,"rows":55,"cols":48,"mask":"AAAAAAAAAAAAAgAAAAACQAAAAAAAwAEAAGAAwAcAABgAgA8AAAwAAD4AAAcABDwAAAMAAvAAgAEAAPAAwAEAAMABYAAAwMEBYAAAgIMHMAAAgIMHMAAAAAcOGAAAQAcOGAAAgB4MDAAAABwMDAAAADgcBAAAADAcBAAAACE4BgAAGAIYBAAAIgQwBgDm/wA4BoB//A8wAsAf/gcwBkA//AEwAqAX+gAwBiB//AEwAgB+/AMwBjho/QMwBjyAfwA4BHiAfwAw5j+AewAYzH+AdwAwzH/A/QAYAH7A/wAYFH7gfwIMOPjg/wQMCODg/wIOAAAA/AAPEAAA/IAHAAAA+IADYAAAfMABwAAAMMABgAAAAOAAAAEAAPAAAAIAADwAAAwAABwAADgAgA8AAOAA4AcAAMB//wAAAAD+PwAAAADAAQAAAAAAAAAA"};

const { R, d, rows, cols } = M, bits = Buffer.from(M.mask, 'base64'), C = R; // map centre = (R, R)
const inv = (x, y) => [Math.atan2(x, y) * 180 / Math.PI, 90 - Math.hypot(x, y) / R * 180];
const REGIONS = [
  // [test(lon, lat), races]
  [(lo, la) => la < -60, ['penguin', 'penguin', 'snowman', 'yeti', 'penguin', 'ghost']],
  [(lo, la) => la > 62 && (lo < -10 || lo > 170), ['indigenous', 'wolf', 'deer', 'yeti', 'snowman', 'white']],
  [(lo, la) => la > 50 && lo > 40, ['white', 'asian', 'bear', 'wolf', 'deer', 'yeti', 'white', 'fox']],
  [(lo, la) => la > 35 && lo > -25 && lo <= 40, ['white', 'elf', 'white', 'fairy', 'unicorn', 'werewolf', 'goblin', 'troll', 'white', 'cat', 'dog', 'sheep', 'horse', 'fox', 'vampire', 'golem', 'mideast', 'black']],
  [(lo, la) => la > 12 && la <= 40 && lo > -20 && lo <= 62, ['mideast', 'jinn', 'mideast', 'mummy', 'horse', 'goat', 'mideast', 'snake', 'cat', 'mideast']],
  [(lo, la) => la <= 12 && la > -36 && lo > -20 && lo <= 52, ['black', 'lion', 'black', 'giraffe', 'zebra', 'black', 'elephant', 'leopard', 'black', 'monkey', 'black', 'parrot']],
  [(lo, la) => la > 35 && la <= 50 && lo > 40 && lo <= 92, ['mideast', 'asian', 'horse', 'goat', 'sheep', 'mideast', 'asian']],
  [(lo, la) => la > 5 && la <= 35 && lo > 62 && lo <= 92, ['southasian', 'tiger', 'southasian', 'elephant', 'snake', 'southasian', 'monkey', 'parrot', 'southasian']],
  [(lo, la) => la > 20 && lo > 92 && lo <= 150, ['asian', 'panda', 'asian', 'qilin', 'phoenix', 'dragon', 'asian', 'kitsune', 'oni', 'tengu', 'tanuki', 'nian', 'redpanda', 'asian', 'robot', 'rooster', 'ai', 'asian', 'rabbit', 'ox']],
  [(lo, la) => la > -11 && la <= 20 && lo > 92 && lo <= 155, ['seasian', 'monkey', 'seasian', 'tiger', 'elephant', 'seasian', 'parrot', 'frog', 'seasian']],
  [(lo, la) => la <= -10 && la > -48 && lo > 110 && lo <= 156, ['white', 'koala', 'indigenous', 'koala', 'pacific', 'white', 'snake', 'parrot', 'sheep', 'asian']],
  [(lo, la) => la <= 0 && (lo > 156 || lo < -150), ['pacific', 'pacific', 'sheep', 'octopus', 'pacific', 'white']],
  [(lo, la) => la > 15 && lo > -170 && lo <= -50, ['white', 'black', 'latino', 'indigenous', 'raccoon', 'bear', 'deer', 'wolf', 'white', 'asian', 'robot', 'ai', 'alien', 'pumpkin', 'southasian', 'black', 'latino', 'cyborg', 'android', 'white']],
  [(lo, la) => la <= 15 && lo > -120 && lo <= -30, ['latino', 'indigenous', 'latino', 'capybara', 'parrot', 'frog', 'latino', 'monkey', 'cactus', 'latino', 'snake', 'black', 'white']],
  [() => true, ['auto', 'pacific', 'octopus']],
];
const avatar = (name, o, x, y, r) => HA.svg(name, { ...o, animate: false, fingerprint: false })
  .replace(/^<svg ([^>]*?)width="\d+" height="\d+"/, `<svg $1x="${(x - r).toFixed(1)}" y="${(y - r).toFixed(1)}" width="${2 * r}" height="${2 * r}"`);

let cells = '', k = 0, n = 0, h = 2166136261;
const rnd = () => { h = Math.imul(h ^ (h >>> 15), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); return ((h ^= h >>> 16) >>> 0) / 4294967296; };
for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++, k++) {
  if (!(bits[k >> 3] >> (k & 7) & 1)) continue;
  const x = -R + i * d + (j % 2) * d / 2, y = -R + j * d * 0.866, [lo, la] = inv(x, y);
  const races = REGIONS.find(([t]) => t(lo, la))[1];
  const o = { race: races[Math.floor(rnd() * races.length)], gender: HA.GENDERS[Math.floor(rnd() * 3)], age: HA.AGES[[1, 2, 2, 2, 3, 3, 4, 0][Math.floor(rnd() * 8)]] };
  cells += avatar('world-' + n++, o, C + x, C + y, d / 2 - 0.6);
}
// ocean disk with the graticule of the UN emblem: latitude circles every 30 degrees, meridians every 30 degrees
let grat = '';
for (let la = 60; la > -90; la -= 30) grat += `<circle cx="${C}" cy="${C}" r="${((90 - la) / 180 * R).toFixed(1)}" fill="none" stroke="#FFFFFF" stroke-opacity="0.16" stroke-width="1.5"/>`;
for (let lo = 0; lo < 360; lo += 30) { const a = lo * Math.PI / 180; grat += `<line x1="${C}" y1="${C}" x2="${(C + R * Math.sin(a)).toFixed(1)}" y2="${(C + R * Math.cos(a)).toFixed(1)}" stroke="#FFFFFF" stroke-opacity="0.16" stroke-width="1.5"/>`; }
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-8 -8 ${2 * R + 16} ${2 * R + 16}" width="${2 * R + 16}" height="${2 * R + 16}"><title>hash-avatar world map</title>` +
  `<defs><radialGradient id="sea"><stop offset="0" stop-color="#2C6FB0"/><stop offset="1" stop-color="#173E72"/></radialGradient></defs>` +
  `<circle cx="${C}" cy="${C}" r="${R + 6}" fill="url(#sea)" stroke="#0F2C55" stroke-width="4"/>${grat}${cells}</svg>\n`;
fs.mkdirSync(path.join(__dirname, '..', 'dist'), { recursive: true });
fs.writeFileSync(path.join(__dirname, '..', 'dist', 'world.svg'), svg);
console.log('wrote dist/world.svg:', n, 'avatars,', (svg.length / 1048576).toFixed(1) + ' MB');
