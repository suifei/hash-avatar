// Minifies src/hash-avatar.js into src/hash-avatar.min.js (terser via npx, no package dependency),
// then checks that the minified build renders byte-identical SVGs.
const { execSync } = require('child_process');
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const root = path.join(__dirname, '..');
const src = path.join(root, 'src/hash-avatar.js'), out = path.join(root, 'src/hash-avatar.min.js');
const version = require('../package.json').version;

execSync(`npx -y terser@5.36.0 "${src}" --compress passes=2 --mangle --comments false --ecma 2017 ` + `-o "${out}"`, { stdio: 'inherit' });
fs.writeFileSync(out, `/*! @suifei/hash-avatar ${version} | Apache-2.0 | github.com/suifei/hash-avatar */
` + fs.readFileSync(out, 'utf8'));

const A = require(src), B = require(out), h = s => crypto.createHash('sha256').update(s).digest('hex');
let n = 0;
for (const race of A.RACES) for (const art of A.ARTS) {
  const o = { race, art, gender: A.GENDERS[n % 3], age: A.AGES[n % 5], animate: n % 2 === 0, qr: n % 7 ? '' : 'hi' + n };
  if (h(A.svg('m' + n, o)) !== h(B.svg('m' + n, o))) throw new Error('minified output differs: ' + JSON.stringify(o));
  n++;
}
const kb = f => (fs.statSync(f).size / 1024).toFixed(1) + ' KB';
const gz = f => (require('zlib').gzipSync(fs.readFileSync(f)).length / 1024).toFixed(1) + ' KB gz';
console.log(`ok: ${n} renders identical | ${kb(src)} (${gz(src)}) -> ${kb(out)} (${gz(out)})`);
