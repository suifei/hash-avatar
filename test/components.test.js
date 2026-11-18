// React and Vue wrappers, exercised against minimal stand-ins so CI needs neither library.
// (They are also checked against real react@18 / vue@3 SSR before each release.)
const test = require('node:test');
const assert = require('node:assert/strict');
const Module = require('node:module');
const HA = require('../src/hash-avatar.js');

const stubs = {
  react: { createElement: (type, props) => ({ type, props }), useMemo: fn => fn() },
  vue: { defineComponent: o => o, computed: fn => ({ get value() { return fn(); } }), h: (type, props) => ({ type, props }) },
};
const load = Module._load;
Module._load = function (req, ...rest) { return stubs[req] || load.call(this, req, ...rest); };

test('react: inline SVG, options and extra props pass through', () => {
  const HashAvatar = require('../react/index.js');
  const el = HashAvatar({ name: 'flynn', race: 'cat', size: '96', art: 'pop', className: 'x', title: 'Flynn' });
  assert.equal(el.type, 'span');
  assert.equal(el.props.dangerouslySetInnerHTML.__html, HA.svg('flynn', { race: 'cat', size: 96, art: 'pop' }));
  assert.equal(el.props.className, 'x');
  assert.equal(el.props['aria-label'], 'Flynn');
  assert.equal(el.props.race, undefined, 'avatar options are not forwarded to the DOM');
  assert.equal(HashAvatar.default, HashAvatar);
});

test('vue: inline SVG, unset booleans keep library defaults, install()', () => {
  const C = require('../vue/index.js');
  const props = { name: 'flynn', race: 'qilin', size: 64, fingerprint: undefined, animate: undefined };
  const vnode = C.setup(props)();
  assert.equal(vnode.props.innerHTML, HA.svg('flynn', { race: 'qilin', size: 64 }));
  assert.equal(C.setup({ name: 'flynn', animate: false })().props.innerHTML, HA.svg('flynn', { animate: false }));
  let reg; C.install({ component: (n, c) => { reg = [n, c]; } });
  assert.deepEqual(reg, ['HashAvatar', C]);
});
