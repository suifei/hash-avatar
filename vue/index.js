// CommonJS build of vue/index.mjs (keep the two in sync).
// <HashAvatar name="flynn" race="cat" :size="96" /> for Vue 3. Renders the SVG inline, so animation and the hover card effect work.
// app.use(HashAvatar) registers it globally as <HashAvatar>.
'use strict';
const { defineComponent, h, computed } = require('vue');
const HA = require('../src/hash-avatar.js');

const HashAvatar = defineComponent({
  name: 'HashAvatar',
  props: {
    name: { type: String, default: '' },
    gender: String, age: String, race: String, art: String, salt: String, qr: String, title: String,
    size: [Number, String],
    fingerprint: { type: Boolean, default: undefined },
    animate: { type: Boolean, default: undefined },
  },
  setup(p) {
    const html = computed(() => HA.svg(p.name, {
      gender: p.gender, age: p.age, race: p.race, art: p.art, salt: p.salt, qr: p.qr,
      size: p.size == null ? undefined : +p.size, fingerprint: p.fingerprint, animate: p.animate,
    }));
    return () => h('span', {
      role: 'img', 'aria-label': p.title != null ? p.title : p.name, title: p.title,
      style: { display: 'inline-block', lineHeight: 0, verticalAlign: 'middle' },
      innerHTML: html.value,
    });
  },
});
HashAvatar.install = app => { app.component('HashAvatar', HashAvatar); };
module.exports = HashAvatar;
module.exports.HashAvatar = HashAvatar;
module.exports.default = HashAvatar;
