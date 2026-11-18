const test = require('node:test');
const assert = require('node:assert/strict');
const HA = require('../src/hash-avatar.js');
const W = require('../scripts/world.js');

test('world map: deterministic land cells with valid races, all inside the disk', () => {
  const a = W.cells(HA), b = W.cells(HA);
  assert.equal(a.length, 583);
  assert.deepEqual(a, b);
  const R = (W.size - 16) / 2;
  for (const c of a) {
    assert.ok(HA.RACES.includes(c.opts.race), c.opts.race);
    assert.ok(Math.hypot(c.x - R, c.y - R) <= R, c.name);
  }
  assert.ok(a.some(c => c.opts.race === 'penguin' && c.lat < -60), 'penguins on Antarctica');
  assert.equal((W.svg(HA, a.slice(0, 3)).match(/data-i="/g) || []).length, 3);
});
