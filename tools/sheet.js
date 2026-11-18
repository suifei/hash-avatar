// Visual check: renders every hair / headwear / facial-hair / clothing / glasses variant into PNG contact sheets.
// Usage: node tools/sheet.js && rsvg-convert hair.svg -o hair.png && rsvg-convert parts.svg -o parts.png
const HA = require('../src/hash-avatar.js'), fs = require('fs');

function sheet(items, cols, file, s = 130) {
  const rows = Math.ceil(items.length / cols);
  let out = `<svg xmlns="http://www.w3.org/2000/svg" width="${cols * s}" height="${rows * (s + 14)}"><rect width="100%" height="100%" fill="#fff"/>`;
  items.forEach((it, i) => {
    const x = (i % cols) * s, y = Math.floor(i / cols) * (s + 14);
    out += `<g transform="translate(${x + 3},${y + 2}) scale(${(s - 6) / 256})">${HA.svg(it[0], it[1])}</g><text x="${x + s / 2}" y="${y + s + 8}" font-size="11" text-anchor="middle" font-family="sans-serif">${it[2] || ''}</text>`;
  });
  fs.writeFileSync(file, out + '</svg>');
}

const races = ['asian', 'white', 'black', 'brown'];
const hair = [];
['crop', 'swept', 'spiky', 'buzz', 'curly', 'afro', 'quiff', 'sidepart', 'manbun', 'mohawk', 'shaggy', 'locs', 'cornrows', 'shoulder', 'receding', 'bald', 'perm', 'combover']
  .forEach((s, i) => hair.push(['m' + i, { gender: 'male', age: ['bald', 'receding', 'combover', 'perm'].includes(s) ? 'old' : 'youth', race: races[i % 4], _force: { style: s, hat: 'none', glasses: 'none', beard: 'none' } }, s]));
['bob', 'long', 'ponytail', 'bun', 'wavy', 'pixie', 'twinbraids', 'pigtails', 'puffs', 'bangslong', 'curtain', 'locs']
  .forEach((s, i) => hair.push(['f' + i, { gender: 'female', age: 'youth', race: races[i % 4], _force: { style: s, hat: 'none', glasses: 'none' } }, s]));
['tuft', 'fuzz', 'tuft2', 'babycurls', 'sprout']
  .forEach((s, i) => hair.push(['b' + i, { gender: 'female', age: 'baby', race: races[i % 4], _force: { style: s, hat: 'none' } }, s]));
sheet(hair, 7, 'hair.svg');

const parts = [];
['beanie', 'cap', 'bucket', 'beret', 'headband', 'flower', 'flatcap', 'sunhat'].forEach((h, i) => parts.push(['h' + i, {
  gender: h === 'sunhat' || h === 'flower' ? 'female' : 'male', age: h === 'sunhat' || h === 'flatcap' ? 'old' : 'youth', race: races[i % 4],
  _force: { hat: h, style: ['crop', 'long', 'bob', 'curly', 'wavy', 'bob', 'bald', 'perm'][i] } }, h]));
['knit', 'bonnet'].forEach((h, i) => parts.push(['k' + i, { gender: 'female', age: 'baby', race: races[i], _force: { hat: h, style: 'tuft' } }, h]));
['stubble', 'mustache', 'beard', 'longbeard', 'goatee', 'chinstrap', 'soulpatch', 'sideburns', 'handlebar'].forEach((bd, i) => parts.push(['d' + i, { gender: 'male', age: bd === 'longbeard' ? 'old' : 'middle', race: races[i % 4], _force: { beard: bd, hat: 'none', glasses: 'none' } }, bd]));
['tee', 'hoodie', 'collar', 'cardigan', 'suit', 'turtleneck', 'stripes', 'overalls'].forEach((c, i) => parts.push(['c' + i, { gender: ['male', 'female', 'neutral'][i % 3], age: 'youth', race: races[i % 4], _force: { cloth: c } }, c]));
['onesie', 'stripes', 'overalls'].forEach((c, i) => parts.push(['o' + i, { gender: 'male', age: 'baby', race: races[i], _force: { cloth: c } }, c]));
['round', 'rect', 'half', 'sun'].forEach((gl, i) => parts.push(['g' + i, { gender: 'neutral', age: 'youth', race: races[i], _force: { glasses: gl, hat: 'none' } }, gl]));
sheet(parts, 8, 'parts.svg');
console.log('wrote hair.svg, parts.svg');
