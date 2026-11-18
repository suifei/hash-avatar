// Inlines the library and the world map module into demo/page.html and writes a single self-contained dist/index.html.
const fs = require('fs'), path = require('path');

const root = path.join(__dirname, '..');
let page = fs.readFileSync(path.join(root, 'demo/page.html'), 'utf8');

for (const [tag, file] of [
  ['<script src="../src/hash-avatar.js"></script>', 'src/hash-avatar.js'],
  ['<script src="../scripts/world.js"></script>', 'scripts/world.js'],
]) {
  const code = fs.readFileSync(path.join(root, file), 'utf8');
  if (!page.includes(tag)) throw new Error('demo/page.html no longer contains: ' + tag);
  if (/<\/script/i.test(code)) throw new Error(file + ' contains "</script" and cannot be inlined safely');
  page = page.replace(tag, () => '<script>\n' + code + '</script>');
}

fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
fs.writeFileSync(path.join(root, 'dist/index.html'), page);
console.log('wrote dist/index.html');
