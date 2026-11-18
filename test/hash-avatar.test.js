const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const HA = require('../src/hash-avatar.js');

const sha = s => crypto.createHash('sha256').update(s).digest('hex');

test('sha256 matches node:crypto on random-length inputs', () => {
  for (let i = 0; i < 300; i++) {
    const m = crypto.randomBytes(crypto.randomInt(0, 300));
    assert.equal(Buffer.from(HA.sha256(m)).toString('hex'), crypto.createHash('sha256').update(m).digest('hex'));
  }
  // block-boundary lengths
  for (const n of [55, 56, 63, 64, 65, 119, 120, 127, 128]) {
    const m = crypto.randomBytes(n);
    assert.equal(Buffer.from(HA.sha256(m)).toString('hex'), crypto.createHash('sha256').update(m).digest('hex'));
  }
});

test('hash input format is the v1 contract', () => {
  const expected = sha('hash-avatar/v1\0' + 's3cret' + '\0' + 'alice@example.com');
  assert.equal(HA.hash('  Alice@Example.com ', 's3cret').hex, expected);
  assert.equal(HA.hash('bob').hex, sha('hash-avatar/v1\0\0bob'));
});

test('deterministic: same input and options give identical output', () => {
  for (const [g, a, r] of [['male', 'youth', 'asian'], ['female', 'old', 'black'], ['neutral', 'baby', 'auto']]) {
    const o = { gender: g, age: a, race: r, salt: 'x' };
    assert.equal(HA.svg('someone@example.com', o), HA.svg('someone@example.com', o));
  }
});

// Contract guard (README: "Versioning contract"). Regenerate ONLY when intentionally bumping the version:
//   UPDATE_GOLDEN=1 node --test
const GOLDEN = path.join(__dirname, 'golden.json');
const CASES = [
  ['alice@example.com', 'female', 'youth', 'white'],
  ['bob@example.com', 'male', 'middle', 'black'],
  ['carol', 'female', 'old', 'asian'],
  ['dave', 'male', 'teen', 'brown'],
  ['eve', 'neutral', 'baby', 'auto'],
  ['李伟', 'male', 'youth', 'asian'],
  ['王芳', 'female', 'middle', 'asian'],
  ['', 'neutral', 'youth', 'auto'],
  ['   spaced    out   ', 'neutral', 'old', 'white'],
  ['UPPER@CASE.ORG', 'male', 'old', 'white'],
  ['octocat', 'male', 'baby', 'black'],
  ['torvalds', 'male', 'old', 'auto'],
  ['grace.hopper@navy.mil', 'female', 'old', 'white'],
  ['ada', 'female', 'teen', 'auto'],
  ['user-0001', 'neutral', 'middle', 'brown'],
  ['user-0002', 'female', 'baby', 'brown'],
  ['😀 emoji', 'neutral', 'teen', 'black'],
  ['Ñandú', 'male', 'middle', 'auto'],
  ['team@hash-avatar.dev', 'female', 'youth', 'black'],
  ['zeta', 'male', 'youth', 'asian'],
  ['luna', 'female', 'youth', 'cat'],
  ['rex', 'male', 'old', 'dog'],
  ['rx-78', 'neutral', 'teen', 'robot'],
  ['aoi', 'female', 'middle', 'dragon'],
  ['tamamo', 'female', 'youth', 'kitsune'],
  ['boo', 'neutral', 'baby', 'ghost'],
  ['legolas', 'male', 'youth', 'elf'],
  ['nova', 'neutral', 'youth', 'ai'],
  ['somebody', 'male', 'youth', 'any'],
  ['moo', 'female', 'middle', 'ox'],
  ['shan', 'male', 'youth', 'tiger'],
  ['ruyi', 'neutral', 'youth', 'qilin'],
  ['fenghuang', 'female', 'youth', 'phoenix'],
  ['tsuki', 'male', 'old', 'tanuki'],
  ['ariel', 'female', 'teen', 'mermaid'],
  ['karasu', 'male', 'middle', 'tengu'],
  ['unit-7', 'neutral', 'youth', 'android'],
  ['spud', 'neutral', 'baby', 'capybara'],
  ['jack', 'male', 'youth', 'pumpkin'],
];
// option variants: salt, size, fingerprint off
const VARIANTS = [
  ['alice@example.com', { salt: 'pepper' }],
  ['alice@example.com', { size: 64, fingerprint: false }],
  ['bob', { gender: 'male', age: 'old', race: 'black', salt: 'pepper', fingerprint: false }],
  ['flynn', { gender: 'male', race: 'asian', animate: false }],
  ['flynn', { gender: 'male', race: 'asian', qr: 'https://github.com/suifei/hash-avatar' }],
  ...['pixel', 'ink', 'comic', 'sketch', 'neon', 'pop', 'mood', 'watercolor', 'glitch'].map(art => ['flynn', { race: 'cat', art }]),
];

test('golden snapshots (v1 contract)', () => {
  const actual = {};
  for (const [input, gender, age, race] of CASES) actual[[input, gender, age, race].join(' | ')] = sha(HA.svg(input, { gender, age, race }));
  for (const [input, opts] of VARIANTS) actual[input + ' | ' + JSON.stringify(opts)] = sha(HA.svg(input, opts));
  if (process.env.UPDATE_GOLDEN) {
    fs.writeFileSync(GOLDEN, JSON.stringify(actual, null, 2) + '\n');
    return;
  }
  const golden = JSON.parse(fs.readFileSync(GOLDEN, 'utf8'));
  assert.deepEqual(actual, golden, 'rendered output changed: this breaks the v1 contract (see README "Versioning contract")');
});

test('uniqueness: 20,000 inputs give 20,000 distinct SVGs', () => {
  const seen = new Set();
  for (let i = 0; i < 20000; i++) seen.add(HA.svg('u' + i, { gender: 'female', age: 'youth', race: 'asian' }));
  assert.equal(seen.size, 20000);
});

test('no NaN or undefined across every dimension combination', () => {
  let k = 0;
  for (const g of HA.GENDERS) for (const a of HA.AGES) for (const r of HA.RACES) {
    for (let i = 0; i < 24; i++) {
      const o = { gender: g, age: a, race: r, art: HA.ARTS[k++ % HA.ARTS.length], animate: i % 2 === 0 };
      const s = HA.svg('e' + i, o);
      assert.doesNotMatch(s, /NaN|undefined|Infinity/, JSON.stringify(o) + ` e${i}`);
    }
  }
});

test('animation: deterministic, scoped to the avatar id, and differs per identity', () => {
  const a = HA.svg('flynn'), b = HA.svg('flynn'), c = HA.svg('flynm');
  assert.equal(a, b);
  const css = s => s.match(/<style>(.*?)<\/style>/)[1];
  const id = a.match(/class="(ha[0-9a-z]+)"/)[1];
  // every class selector and keyframe name carries the avatar id, so inline SVGs never clash
  for (const sel of css(a).match(/\.(?=[a-z])[\w-]+/g)) assert.ok(sel.startsWith('.' + id), sel);
  for (const kf of css(a).match(/@keyframes [\w-]+/g)) assert.ok(kf.slice(11).startsWith(id), kf);
  const strip = s => css(s).replace(/ha[0-9a-f]{12}[a-z0-9]+/g, '');
  assert.notEqual(strip(a), strip(c), 'motion parameters should depend on the hash');
  assert.match(css(a), /prefers-reduced-motion/);
  assert.doesNotMatch(HA.svg('flynn', { animate: false }), /<style>|class=/);
});

test('race "any" picks a deterministic species from the hash and reaches every species', () => {
  const seen = new Set();
  for (let i = 0; i < 3000; i++) {
    const s = HA.svg('p' + i, { race: 'any', animate: false });
    seen.add(s.match(/id="ha[0-9a-f]{12}..([0-9a-z]{2})[fn]\d[as]"/)[1]);
  }
  assert.equal(seen.size, HA.RACES.length - 2); // every race except 'auto' and 'any' itself
});

test('qr: structure, version choice and capacity', () => {
  // format info for level H: the 15-bit word must be a valid BCH codeword after unmasking
  const valid = new Set();
  for (let m = 0; m < 8; m++) { const dt = 2 << 3 | m; let r = dt; for (let i = 0; i < 10; i++) r = (r << 1) ^ ((r >>> 9) * 0x537); valid.add((dt << 10 | r) ^ 0x5412); }
  for (const [text, ver] of [['hi', 1], ['x'.repeat(7), 1], ['x'.repeat(8), 2], ['x'.repeat(1273), 40]]) {
    const M = HA.qrMatrix(text), n = M.length;
    assert.equal(n, ver * 4 + 17, `${text.length} bytes -> version ${ver}`);
    // finder pattern ring + center in all three corners
    for (const [x, y] of [[0, 0], [n - 7, 0], [0, n - 7]]) {
      for (let i = 0; i < 7; i++) assert.ok(M[y][x + i] && M[y + 6][x + i] && M[y + i][x] && M[y + i][x + 6]);
      assert.ok(M[y + 3][x + 3] && !M[y + 1][x + 1]);
    }
    let f = 0;
    for (let i = 0; i <= 5; i++) f |= M[i][8] << i;
    f |= M[7][8] << 6 | M[8][8] << 7 | M[8][7] << 8;
    for (let i = 9; i < 15; i++) f |= M[8][14 - i] << i;
    assert.ok(valid.has(f), 'format bits');
    assert.equal(M[n - 8][8], 1, 'dark module');
  }
  assert.throws(() => HA.qrMatrix('x'.repeat(1274)), RangeError);
  const q = HA.svg('flynn', { qr: 'hello', size: 300 });
  assert.match(q, /^<svg [^>]*width="300" height="300"/);
  assert.match(q, /<svg xmlns="http:\/\/www.w3.org\/2000\/svg" viewBox="0 0 256 256" x="/, 'avatar nested in the centre');
  assert.equal(HA.svg('flynn', { qr: '' }), HA.svg('flynn'), 'empty qr means no qr');
});

test('normalization: email case, whitespace, NFC vs NFD', () => {
  const same = (a, b) => assert.equal(HA.svg(a), HA.svg(b), `${JSON.stringify(a)} vs ${JSON.stringify(b)}`);
  same('Alice@Example.COM', 'alice@example.com');
  same('  alice@example.com\t', 'alice@example.com');
  same('John   \n  Smith', 'John Smith');
  same(' John Smith ', 'John Smith');
  same('José', 'José');
  same('Renée@Example.com', 'renée@example.com');
  // non-email input keeps case
  assert.notEqual(HA.svg('Alice'), HA.svg('alice'));
});
