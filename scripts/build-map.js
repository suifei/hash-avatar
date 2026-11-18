// Builds dist/world.svg from scripts/world.js. Render it to PNG for the README with any headless browser, e.g.
//   msedge --headless=new --window-size=1416,1416 --screenshot=assets/world.png dist/world.svg
const fs = require('fs'), path = require('path');
const HA = require('../src/hash-avatar.js'), W = require('./world.js');
const list = W.cells(HA), svg = W.svg(HA, list) + '\n';
fs.mkdirSync(path.join(__dirname, '..', 'dist'), { recursive: true });
fs.writeFileSync(path.join(__dirname, '..', 'dist', 'world.svg'), svg);
console.log('wrote dist/world.svg:', list.length, 'avatars,', (svg.length / 1048576).toFixed(1) + ' MB');
