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
];
// option variants: salt, size, fingerprint off
const VARIANTS = [
  ['alice@example.com', { salt: 'pepper' }],
  ['alice@example.com', { size: 64, fingerprint: false }],
  ['bob', { gender: 'male', age: 'old', race: 'black', salt: 'pepper', fingerprint: false }],
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
  for (const g of HA.GENDERS) for (const a of HA.AGES) for (const r of HA.RACES) {
    for (let i = 0; i < 100; i++) {
      const s = HA.svg('e' + i, { gender: g, age: a, race: r });
      assert.doesNotMatch(s, /NaN|undefined/, `${g}/${a}/${r}/e${i}`);
    }
  }
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
